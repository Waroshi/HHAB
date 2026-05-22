<?php

// routes/web.php
// Defines browser routes for the Laravel app.
// Exists so Inertia pages can be reached from URLs.
// RELATED FILES: resources/js/Pages/Dashboard.jsx, resources/views/app.blade.php, resources/js/app.js

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'summary' => [
            'monthExpenses' => 0,
        ],
    ]);
})->name('dashboard');
