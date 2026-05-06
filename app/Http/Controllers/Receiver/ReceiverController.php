<?php

namespace App\Http\Controllers\Receiver;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Quantity;
use App\Models\UnitofMeasure;
use Illuminate\Http\Request;

class ReceiverController extends Controller
{
    public function receiverPage(Request $request){
        $UnitOfMeasure = UnitofMeasure::query()->get();
        $items = Item::with('requests', 'quantities', 'issuances', 'history');

        if(filled($request->search)){
            $items->where('description', 'like', '%' . $request->search . '%')
            ->orWhere('unit_of_measure', 'like', '%' . $request->search . '%');
        }

        $items = $items->get();

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
            'added_receipt' => array_merge($item->added_receipt ?? [], [$request->quantity]),
            'total' => $item->total + $request->quantity
        ]);
    }

    public function editReceipt(Request $request){
        $findItem = Item::findOrFail($request->item_id);

        foreach ($request->quantity as $item) {
            Quantity::query()->where('id', $item['id'])->update([
                'quantity' => $item['quantity']
            ]);
        }

        $updatedQuantities = $findItem->quantities()->orderBy('id')->pluck('quantity')->all();

        $findItem->update([
            'total' => array_sum($updatedQuantities),
            'added_receipt' => $updatedQuantities
        ]);

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
                'total' => $item->total,
                'less' => $item->less,
                'ending_balance' => $item->total - $item->less,
                'beginning_inventory' => $lastHistory ? $lastHistory?->ending_balance : 0,
            ]);
        }

        foreach($items as $item){
            $item->update([
            'total' => $item->total - $item->less,
            'less' => 0,
            'added_receipt' => [],

        ]);
        }
    }
}
