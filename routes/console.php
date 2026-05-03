<?php

use App\Models\History;
use App\Models\Issuance;
use App\Models\Item;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Resets data on the 1st of every month
Schedule::call(function () {
    $snapshotPath = storage_path('app/ending_balances.json');
    $snapshots = file_exists($snapshotPath) ? json_decode(file_get_contents($snapshotPath), true) : [];

    Item::with('issuances', 'quantities', 'history')->get()->each(function ($item) use ($snapshotPath, &$snapshots) {
        $snapshots[$item->id] = ($item->total ?? 0) - ($item->less ?? 0);

        $item->history()->create([
            'item_id' => $item->id,
            'unit_of_measure' => $item->unit_of_measure,
            'beginning_inventory' => $item->total,
            'add_receipts' => $item->added_receipt,
            'total' => $item->total,
            'less' => $item->less,
            'ending_balance' => $snapshots[$item->id],
        ]);

        $item->update([
            'total'    => $snapshots[$item->id],
            'less'     => 0,
            'added_receipt' => []
        ]);

    });

    file_put_contents($snapshotPath, json_encode($snapshots));
    logger('Monthly carry-over completed');
})->everyMinute();
