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
        $UnitOfMeasure = UnitofMeasure::get();
        $items = Item::with('requests', 'quantities', 'issuances');

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

        $oldTotal = Quantity::where('item_id', $request->item_id)->sum('quantity');

        foreach ($request->quantity as $item) {
            Quantity::where('id', $item['id'])->update([
                'quantity' => $item['quantity']
            ]);
        }

        $newTotal = Quantity::where('item_id', $request->item_id)->sum('quantity');

        $findItem->update([
            'total' => $findItem->total + ($newTotal - $oldTotal)
        ]);

        return back()->with('success', 'Receipt updated successfully');
    }
}
