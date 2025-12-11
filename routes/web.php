<?php

use App\Http\Controllers\ApdController;
use App\Http\Controllers\JenisApdController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\GarduIndukController;
use App\Http\Controllers\MonitoringApdController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\SerahTerimaController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', 'dashboard');

Route::middleware(['auth', 'verified'])->group(function(){
    // Ubah dari closure menjadi controller
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('jenis-apd', JenisApdController::class);
    Route::resource('apd', ApdController::class);
    Route::resource('lokasi', LokasiController::class);
    Route::resource('gardu-induk', GarduIndukController::class);
    Route::post('/monitoring-apd/import', [MonitoringApdController::class, 'import'])
        ->name('monitoring-apd.import');
    Route::get('/monitoring-apd/template', [MonitoringApdController::class, 'template'])
        ->name('monitoring-apd.template');
    Route::resource('monitoring-apd', MonitoringApdController::class);
        // Notifikasi Routes
    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::get('/notifikasi/preview', [NotifikasiController::class, 'preview'])->name('notifikasi.preview');
    Route::get('/notifikasi/{id}', [NotifikasiController::class, 'show'])->name('notifikasi.show');
    Route::post('/notifikasi/mark-all-read', [NotifikasiController::class, 'markAllAsRead'])->name('notifikasi.markAllAsRead');
    Route::post('/notifikasi/{id}/mark-as-read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.markAsRead');
    
    Route::resource('serah-terima', SerahTerimaController::class);
    
    // Route baru untuk preview dan export
    Route::get('/serah-terima/{id}/preview', [SerahTerimaController::class, 'previewPdf'])
        ->name('serah-terima.preview');
    
    Route::get('/serah-terima/{id}/pdf', [SerahTerimaController::class, 'exportPdf'])
        ->name('serah-terima.export');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';