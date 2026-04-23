<?php

namespace App\Http\Controllers;

use App\Models\Receiver;
use App\Models\UnitofMeasure;
use Illuminate\Http\Request;

class ReceiverController extends Controller
{
    public function receiverPage(){
        $UnitOfMeasure = UnitofMeasure::get();
        $items = Receiver::get();
        return inertia('Receiver/CreateItem', ['unitofmeasure' => $UnitOfMeasure, 'items' => $items]);
    }

    public function createItem(Request $request){
        Receiver::create([
            'description' => $request->description,
            'unit_of_measure' => $request->unit_of_measure,
            'quantity' => (array) $request->quantity
        ]);
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
            'quantity' => $quantity
        ]);
    }
}
