<?php

namespace App\Http\Controllers\Endorser;

use App\Http\Controllers\Controller;
use App\Models\Issuance;
use App\Models\Item;
use App\Models\Request as ModelsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EndorserController extends Controller
{
    private function getAvailableStock(Item $item): int
    {
        $totalQuantity = (int) ($item->total_quantity ?? $item->quantities->sum('quantity'));
        $fulfilledQuantity = (int) $item->issuances->sum(fn ($issuance) => (int) $issuance->fulfilled_quantity);

        return max($totalQuantity - $fulfilledQuantity, 0);
    }

    public function endorserPage(Request $request){
        $requests = ModelsRequest::with('user', 'items', 'issuances')->whereIn('status', ['approved', 'on-hold', 'pending'])
        ->orderByRaw("FIELD(status, 'pending', 'on-hold', 'approved')");
        $items = Item::withSum('quantities as total_quantity', 'quantity')
            ->with('issuances')
            ->get()
            ->map(function ($item) {
                $item->setAttribute('available_stock', $this->getAvailableStock($item));

                return $item;
            });

        if (filled($request->search)) {
        $requests->where(function ($query) use ($request) {
            $query->where('item', 'like', '%' . $request->search . '%')
                ->orWhere('quantity', 'like', '%' . $request->search . '%')
                ->orWhere('status', 'like', '%' . $request->search . '%')
                ->orWhere('id', 'like', '%' . $request->search . '%')
                ->orWhere('message', 'like', '%' . $request->search . '%');
        })
        ->orWhereHas('user', function ($query) use ($request) {
            $query->where('department', 'like', '%' . $request->search . '%')->whereIn('status', ['approved', 'on-hold', 'pending']);
        });
    }


        $requests = $requests->paginate(10)->withQueryString();

        return inertia('Endorser/Requests', ['requests' => $requests, 'items' => $items]);
    }

    public function endorserDoneRequestPage(Request $request){
    $requests = ModelsRequest::with('user', 'issuances')
        ->whereIn('status', ['rejected', 'cancelled', 'for-pickup'])
        ->orderByRaw("FIELD(status, 'for-pickup', 'rejected', 'cancelled')");
        
    if (filled($request->search)) {
        $requests->where(function ($query) use ($request) {
            $query->where('item', 'like', '%' . $request->search . '%')
                ->orWhere('quantity', 'like', '%' . $request->search . '%')
                ->orWhere('status', 'like', '%' . $request->search . '%')
                ->orWhere('id', 'like', '%' . $request->search . '%')
                ->orWhere('message', 'like', '%' . $request->search . '%');
        })
        ->orWhereHas('user', function ($query) use ($request) {
            $query->where('department', 'like', '%' . $request->search . '%')->whereIn('status', ['rejected', 'cancelled', 'for-pickup']);
        });
    }


        $requests = $requests->paginate(10)->withQueryString();

        return inertia('Endorser/DoneRequests', ['requests' => $requests]);
    }

    public function actionReject(Request $request){
        $findItem = ModelsRequest::findOrFail($request->request_id);

        $findItem->update([
            'status' => 'rejected',
            'endorser_message' => $request->endorser_message
        ]);
    }

    public function actionApprove(Request $request){
        $findRequest = ModelsRequest::findOrFail($request->request_id);
        $itemIds = array_values(array_map('intval', (array) $request->item_id));
        $fulfilledQuantities = array_values(array_map('intval', (array) $request->fulfilled_quantity));
        $unfulfilledQuantities = array_values(array_map('intval', (array) $request->unfulfilled_quantity));
        $requestedQuantities = array_values((array) $findRequest->quantity);

        if($findRequest->status === 'cancelled'){
            return back()->with('error', 'Request is Cancelled by Department');
        }

        if (
            count($itemIds) !== count($requestedQuantities) ||
            count($fulfilledQuantities) !== count($requestedQuantities) ||
            count($unfulfilledQuantities) !== count($requestedQuantities)
        ) {
            return back()->with('error', 'Approval data does not match the request.');
        }

        // First validate all items and quantities before making any DB changes
        foreach ($itemIds as $index => $itemId) {
            $findItem = Item::withSum('quantities as total_quantity', 'quantity')
                ->with('issuances')
                ->findOrFail($itemId);
            $fulfilled = $fulfilledQuantities[$index];
            $unfulfilled = $unfulfilledQuantities[$index];
            $requested = $requestedQuantities[$index];
            $availableStock = $this->getAvailableStock($findItem);

            if ($fulfilled + $unfulfilled != $requested) {
                return back()->with('error', 'The fulfilled and unfulfilled items do not match the department’s request.');
            }

            if ($availableStock < $fulfilled) {
                return back()->with('error', 'Insufficient stock available for selected item: ' . $findItem->description);
            }
        }

        try {
            DB::transaction(function () use ($itemIds, $fulfilledQuantities, $unfulfilledQuantities, $findRequest, $request) {
                $issuedItems = [];

                foreach ($itemIds as $index => $itemId) {
                    $findItem = Item::withSum('quantities as total_quantity', 'quantity')
                        ->with('issuances')
                        ->whereKey($itemId)
                        ->lockForUpdate()
                        ->firstOrFail();
                    $fulfilled = $fulfilledQuantities[$index];
                    $availableStock = $this->getAvailableStock($findItem);

                    if ($fulfilled < 0) {
                        throw new \RuntimeException('Invalid fulfilled quantity for selected item: ' . $findItem->description);
                    }

                    if ($availableStock - $fulfilled < 0) {
                        throw new \RuntimeException('Insufficient stock available for selected item: ' . $findItem->description);
                    }

                    $issuedItems[] = $findItem->description;
                    $newLess = (int) $findItem->less + $fulfilled;
                    $findItem->update([
                        'less' => $newLess,
                    ]);
                }

                $findRequest->update([
                    'status' => 'approved',
                    'endorser_message' => $request->endorser_message,
                ]);

                foreach ($itemIds as $index => $itemId) {
                    Issuance::create([
                        'user_id' => $findRequest->user_id,
                        'request_id' => $findRequest->id,
                        'item_id' => $itemId,
                        'issued_item' => $issuedItems[$index],
                        'fulfilled_quantity' => $fulfilledQuantities[$index],
                        'unfulfilled_quantity' => $unfulfilledQuantities[$index],
                    ]);
                }
            });
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Request approved successfully');
    }

    public function actionHold(Request $request){
        $findRequest = ModelsRequest::findOrFail($request->request_id);

        if($findRequest->status === 'cancelled'){
            return back()->with('error', 'Request is Cancelled by Department');
        }

        $findRequest->update([
            'status' => 'on-hold',
            'endorser_message' => $request->endorser_message
        ]);
        
        return back()->with('success', 'Request held successfully');
    }

    public function actionPickup(Request $request){
        $findRequest = ModelsRequest::findOrFail($request->request_id);

        if($findRequest->status === 'cancelled'){
            return back()->with('error', 'Request is Cancelled by Department');
        }

        $findRequest->update([
            'status' => 'for-pickup',
        ]);
        
        return back()->with('success', 'Request marked as for pickup successfully');
    }
}