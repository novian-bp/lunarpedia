<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $serviceTypes = ServiceType::published()->take(3)->get();
        return view('welcome', compact('serviceTypes'));
    }
}