<?php

namespace App\Http\Controllers\Endorser;

use App\Http\Controllers\Controller;
use App\Models\Request as ModelsRequest;
use Illuminate\Http\Request;

class EndorserController extends Controller
{
    public function endorserPage(){
        $requests = ModelsRequest::with('user')->get();
        return inertia('Endorser/Requests', ['requests' => $requests]);
    }
}
