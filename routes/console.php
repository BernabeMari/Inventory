<?php

use App\Models\Receiver;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::call(function () {
    try {
        $receivers = Receiver::all();
        $dir = public_path('reports');
        $timestamp = now()->format('Ymd_His');

        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        foreach ($receivers as $receiver) {
            $pdf = Pdf::loadView('pdf.reports', compact('receiver'));
            $pdf->save($dir . '/receiver_' . $receiver->id . '_' . $timestamp . '.pdf');
        }
        
        logger('PDFs generated successfully');
    } catch (\Exception $e) {
        logger()->error('PDF generation failed: ' . $e->getMessage());
        $r = Receiver::first();
        if ($r) {
            logger('id: ' . json_encode($r->id));
            logger('description: ' . json_encode($r->description));
            logger('unit_of_measure: ' . json_encode($r->unit_of_measure));
            logger('quantity: ' . json_encode($r->quantity));
            logger('total: ' . json_encode($r->total));
            logger('less: ' . json_encode($r->less));
        }
    }
})->monthly();