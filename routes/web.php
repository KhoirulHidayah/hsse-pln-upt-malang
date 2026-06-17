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
use App\Http\Controllers\PemeriksaanApdController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', 'dashboard');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Hanya admin ──
    Route::middleware('admin.only')->group(function () {
        Route::resource('jenis-apd', JenisApdController::class);
        Route::resource('apd', ApdController::class);
        Route::resource('lokasi', LokasiController::class);
        Route::resource('gardu-induk', GarduIndukController::class);

        // Monitoring APD (admin)
        Route::get('/monitoring-apd/saw', [MonitoringApdController::class, 'saw'])->name('monitoring-apd.saw');
        Route::post('/monitoring-apd/import', [MonitoringApdController::class, 'import'])->name('monitoring-apd.import');
        Route::get('/monitoring-apd/template', [MonitoringApdController::class, 'template'])->name('monitoring-apd.template');
        Route::get('/monitoring-apd/laporan', [MonitoringApdController::class, 'laporan'])->name('monitoring-apd.laporan');
        Route::get('/monitoring-apd/laporan/export', [MonitoringApdController::class, 'exportLaporan'])->name('monitoring-apd.export-laporan');
        Route::resource('monitoring-apd', MonitoringApdController::class);

        // Notifikasi
        Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
        Route::get('/notifikasi/preview', [NotifikasiController::class, 'preview'])->name('notifikasi.preview');
        Route::get('/notifikasi/{id}', [NotifikasiController::class, 'show'])->name('notifikasi.show');
        Route::post('/notifikasi/mark-all-read', [NotifikasiController::class, 'markAllAsRead'])->name('notifikasi.markAllAsRead');
        Route::post('/notifikasi/{id}/mark-as-read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.markAsRead');

        // Serah Terima
        Route::resource('serah-terima', SerahTerimaController::class);
        Route::get('/serah-terima/{id}/preview', [SerahTerimaController::class, 'previewPdf'])->name('serah-terima.preview');
        Route::get('/serah-terima/{id}/pdf', [SerahTerimaController::class, 'exportPdf'])->name('serah-terima.export');

        Route::resource('user', UserController::class);
    });

    // ── Pemeriksaan APD (admin + pemeriksa) ──
    Route::get('/pemeriksaan-apd', [PemeriksaanApdController::class, 'index'])->name('pemeriksaan-apd.index');
    Route::get('/pemeriksaan-apd/{garduIndukId}', [PemeriksaanApdController::class, 'show'])->name('pemeriksaan-apd.show');
    Route::patch('/pemeriksaan-apd/{monitoringId}/kondisi', [PemeriksaanApdController::class, 'updateKondisi'])->name('pemeriksaan-apd.update-kondisi');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
