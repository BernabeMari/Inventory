<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EndorserController extends Controller
{
    public function endorserPage(){
        return inertia('Endorser/Requests');
    }
}
