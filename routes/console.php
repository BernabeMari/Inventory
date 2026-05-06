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