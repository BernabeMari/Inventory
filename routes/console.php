<?php

use App\Models\Receiver;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// 1. Generates PDF every minute
Schedule::call(function () {
    try {
        $receivers = Receiver::all();
        $dir = public_path('reports');
        $timestamp = now()->format('Ymd_His');

        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        $snapshotPath = storage_path('app/ending_balances.json');
        $beginnings = file_exists($snapshotPath) ? json_decode(file_get_contents($snapshotPath), true) : [];

        $pdf = Pdf::loadView('pdf.reports', compact('receivers', 'beginnings'));
        $pdf->save($dir . '/receivers_' . $timestamp . '.pdf');

        logger('PDF generated successfully');
    } catch (\Exception $e) {
        logger()->error('PDF generation failed: ' . $e->getMessage());
    }
})->everyMinute();

// 2. Resets data on the 1st of every month
Schedule::call(function () {
    $snapshotPath = storage_path('app/ending_balances.json');
    $snapshots = file_exists($snapshotPath) ? json_decode(file_get_contents($snapshotPath), true) : [];

    Receiver::all()->each(function ($receiver) use ($snapshotPath, &$snapshots) {
        $snapshots[$receiver->id] = ($receiver->total ?? 0) - ($receiver->less ?? 0);

        $receiver->update([
            'quantity' => [],
            'total'    => $snapshots[$receiver->id],
            'less'     => 0,
        ]);
    });

    file_put_contents($snapshotPath, json_encode($snapshots));
    logger('Monthly carry-over completed');
})->everyMinute();