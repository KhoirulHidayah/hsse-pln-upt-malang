<?php

use App\Http\Controllers\ApdController;
use App\Http\Controllers\ApdDetailController;
use App\Http\Controllers\JenisApdController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\GarduIndukController;
use App\Http\Controllers\MonitoringApdController;
use App\Http\Controllers\NotifikasiController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', 'dashboard');

Route::middleware(['auth', 'verified'])->group(function(){
    Route::get('/dashboard', fn()=> Inertia::render('Dashboard') )
    ->name('dashboard');

    Route::resource('jenis-apd', JenisApdController::class);
    Route::resource('apd', ApdController::class);
    Route::resource('detail', ApdDetailController::class);
    Route::resource('lokasi', LokasiController::class);
    Route::resource('gardu-induk', GarduIndukController::class);
    Route::post('/monitoring-apd/import', [MonitoringApdController::class, 'import'])
        ->name('monitoring-apd.import');
    Route::get('/monitoring-apd/template', [MonitoringApdController::class, 'template'])
        ->name('monitoring-apd.template');
    Route::resource('monitoring-apd', MonitoringApdController::class);
    Route::resource('notifikasi', NotifikasiController::class);

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
