<?php

namespace App\Http\Controllers\Receiver;

use App\Http\Controllers\Controller;
use App\Models\Receiver;
use App\Models\UnitofMeasure;
use Illuminate\Http\Request;

class ReceiverController extends Controller
{
    public function receiverPage(){
        $UnitOfMeasure = UnitofMeasure::get();
        $items = Receiver::with('requests')->get();
        return inertia('Receiver/CreateItem', ['unitofmeasure' => $UnitOfMeasure, 'items' => $items]);
    }

    public function createItem(Request $request){
        Receiver::create([
            'description' => $request->description,
            'unit_of_measure' => $request->unit_of_measure,
            'total' => $request->quantity,
            'quantity' => (array) $request->quantity
        ]);

        return back()->with('success', 'Item created successfully');
    }

    public function addReceipt(Request $request){
        $find = Receiver::findOrFail($request->item_id);

        $quantity = $find->quantity;

        // FORCE array
        if (!is_array($quantity)) {
            $quantity = $quantity ? [$quantity] : [];
        }

        $quantity[] = (int) $request->quantity;

        $find->update([
            'quantity' => $quantity,
            'total' => $find->total + $request->quantity
        ]);
    }
}
