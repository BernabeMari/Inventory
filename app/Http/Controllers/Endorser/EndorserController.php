<?php

namespace App\Http\Controllers\Endorser;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EndorserController extends Controller
{
    public function endorserPage(){
        return inertia('Endorser/Requests');
    }
}
