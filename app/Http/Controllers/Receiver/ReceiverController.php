<?php

namespace App\Http\Controllers\Receiver;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Quantity;
use App\Models\UnitofMeasure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReceiverController extends Controller
{
    public function receiverPage(Request $request){
        $UnitOfMeasure = UnitofMeasure::query()->get();
        $items = Item::with('requests', 'quantities', 'issuances', 'history')
            ->withSum('quantities as total_quantity', 'quantity');

        if(filled($request->search)){
            $items->where('description', 'like', '%' . $request->search . '%')
            ->orWhere('unit_of_measure', 'like', '%' . $request->search . '%');
        }

        $items = $items->get();
        
        

        $items = $items->map(function ($item) {
            $totalQuantity = (int) ($item->total_quantity ?? 0);
            $fulfilledQuantity = $item->issuances->sum(function ($issuance) {
                $fulfilled = $issuance->fulfilled_quantity;

                if (is_array($fulfilled)) {
                    return collect($fulfilled)->sum(function ($quantity) {
                        return (int) $quantity;
                    });
                }

                return (int) $fulfilled;
            });

            $item->computed_total_without_less = $totalQuantity;
            $item->computed_less = $fulfilledQuantity;
            $item->computed_total = $totalQuantity - $fulfilledQuantity;

            return $item;
        });

        if($items->isEmpty() && filled($request->search)){
            return back()->with('error', 'No matching items found');
        }
        return inertia('Receiver/CreateItem', ['unitofmeasure' => $UnitOfMeasure, 'items' => $items]);
    }

    public function createItem(Request $request){
        $unitOfMeasure = trim($request->unit_of_measure);

        if ($unitOfMeasure !== '') {
            UnitofMeasure::firstOrCreate([
                'unit_of_measure' => $unitOfMeasure,
            ]);
        }

        $item = Item::create([
            'description' => $request->description,
            'unit_of_measure' => $unitOfMeasure,
            'total' => $request->quantity
        ]);

        $id = $item->id;

        Quantity::create([
            'quantity' => $request->quantity,
            'item_id' => $id
        ]);

        return back()->with('success', 'Item created successfully');
    }

    public function addReceipt(Request $request){
        $item = Item::findOrFail($request->item_id);

        Quantity::create([
            'quantity' => $request->quantity,
            'item_id' => $item->id
        ]);

        $item->update([
            'added_receipt' => array_merge($item->added_receipt ?? [], [$request->quantity])
        ]);
    }

    public function editReceipt(Request $request){
        DB::transaction(function () use ($request) {
            $findItem = Item::findOrFail($request->item_id);
            $updatedReceipts = array_values(array_map('intval', (array) $request->quantity));

            $findItem->update([
                'added_receipt' => $updatedReceipts,
            ]);

            $receiptQuantities = $findItem->quantities()
                ->orderBy('id')
                ->get()
                ->skip(1)
                ->values();

            foreach ($updatedReceipts as $index => $quantity) {
                if (isset($receiptQuantities[$index])) {
                    $receiptQuantities[$index]->update([
                        'quantity' => $quantity,
                    ]);
                } else {
                    Quantity::create([
                        'item_id' => $findItem->id,
                        'quantity' => $quantity,
                    ]);
                }
            }

            if ($receiptQuantities->count() > count($updatedReceipts)) {
                $receiptQuantities->slice(count($updatedReceipts))->each->delete();
            }
        });

        return back()->with('success', 'Receipt updated successfully');
    }

    public function resetInventory(){
        $items = Item::with('quantities', 'history')->get();
        
        foreach($items as $item){
            $lastHistory = $item->history()->orderByDesc('id')->first();
            
            $item->history()->create([
                'item_id' => $item->id,
                'unit_of_measure' => $item->unit_of_measure,
                'add_receipts' => $item->added_receipt,
                'total' => $item->total + ($item->added_receipt ? array_sum($item->added_receipt) : 0),
                'less' => $item->less,
                'ending_balance' => $item->total - $item->less + ($item->added_receipt ? array_sum($item->added_receipt) : 0),
                'beginning_inventory' => $lastHistory ? $lastHistory?->ending_balance : 0,
            ]);
        }

        foreach($items as $item){
            $item->update([
            'total' =>$item->total - $item->less + ($item->added_receipt ? array_sum($item->added_receipt) : 0),
            'less' => 0,
            'added_receipt' => [],

        ]);
        }
    }
}
