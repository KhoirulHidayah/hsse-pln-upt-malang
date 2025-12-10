import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    LayoutDashboard,
    ShieldCheck,
    AlertTriangle,
    XCircle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Clock,
    MapPin,
    HardHat,
    Package,
    ClipboardCheck,
    Building2,
    Calendar,
    BarChart3
} from "lucide-react";

export default function Dashboard({ auth, statistics }) {
    // Data statistik dari backend
    const stats = statistics || {
        total_apd: 0,
        total_monitoring: 0,
        status_counts: {
            active: 0,
            warning: 0,
            expired: 0
        },
        kondisi_counts: {
            baik: 0,
            perlu_diganti: 0,
            rusak: 0
        },
        lokasi_summary: [],
        gardu_summary: [],
        apd_expiring_soon: [],
        recent_monitoring: [],
        trends: {
            this_month: 0,
            last_month: 0,
            percentage_change: 0
        }
    };

    // Fungsi untuk mendapatkan persentase
    const getPercentage = (value, total) => {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(1);
    };

    // Fungsi untuk format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    // Fungsi untuk menghitung hari tersisa
    const getDaysRemaining = (expiryDate) => {
        if (!expiryDate) return null;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Dashboard Monitoring APD
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Sesuai SPLN U2.006:2023 - PT PLN (Persero)
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2 space-y-3">
                    
                    {/* Cards Ringkasan Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Total APD */}
                        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg shadow-md p-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs opacity-90">Total APD Terdaftar</p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.total_apd}</h3>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <HardHat className="h-8 w-8" />
                                </div>
                            </div>
                            <Link href={route('apd.index')} className="text-xs opacity-90 hover:opacity-100 flex items-center gap-1">
                                Lihat Detail <TrendingUp className="h-3 w-3" />
                            </Link>
                        </div>

                        {/* Total Monitoring */}
                        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs opacity-90">Total Monitoring Aktif</p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.total_monitoring}</h3>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <ClipboardCheck className="h-8 w-8" />
                                </div>
                            </div>
                            <Link href={route('monitoring-apd.index')} className="text-xs opacity-90 hover:opacity-100 flex items-center gap-1">
                                Lihat Detail <TrendingUp className="h-3 w-3" />
                            </Link>
                        </div>

                        {/* Status Warning */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md p-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs opacity-90">Perlu Perhatian</p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.status_counts.warning}</h3>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                            </div>
                            <p className="text-xs opacity-90">Masa pakai 30-90 hari</p>
                        </div>

                        {/* Status Expired */}
                        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-lg shadow-md p-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs opacity-90">Expired / Kritis</p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.status_counts.expired}</h3>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <XCircle className="h-8 w-8" />
                                </div>
                            </div>
                            <p className="text-xs opacity-90">Segera lakukan penggantian</p>
                        </div>
                    </div>

                    {/* Status Notifikasi & Kondisi APD */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Status Notifikasi Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-cyan-600" />
                                    Status Notifikasi SPLN
                                </h3>
                                <Link href={route('notifikasi.index')} className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                                    Lihat Semua
                                </Link>
                            </div>
                            
                            <div className="space-y-3">
                                {/* Active */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Active (Aman)</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {stats.status_counts.active} ({getPercentage(stats.status_counts.active, stats.total_monitoring)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getPercentage(stats.status_counts.active, stats.total_monitoring)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Warning */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Warning (30-90 hari)</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {stats.status_counts.warning} ({getPercentage(stats.status_counts.warning, stats.total_monitoring)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getPercentage(stats.status_counts.warning, stats.total_monitoring)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Expired */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-600" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Expired (&lt; 30 hari)</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {stats.status_counts.expired} ({getPercentage(stats.status_counts.expired, stats.total_monitoring)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-red-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getPercentage(stats.status_counts.expired, stats.total_monitoring)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                <p className="text-xs text-cyan-800 dark:text-cyan-300 leading-relaxed">
                                    <strong>Standar SPLN U2.006:2023:</strong> Monitoring otomatis masa pakai APD berdasarkan tanggal distribusi dan expired untuk memastikan keamanan pekerja.
                                </p>
                            </div>
                        </div>

                        {/* Kondisi APD */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-violet-600" />
                                    Kondisi Fisik APD
                                </h3>
                            </div>
                            
                            <div className="space-y-3">
                                {/* Baik */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Kondisi Baik</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {stats.kondisi_counts.baik} ({getPercentage(stats.kondisi_counts.baik, stats.total_monitoring)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getPercentage(stats.kondisi_counts.baik, stats.total_monitoring)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Perlu Diganti */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Perlu Diganti</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {stats.kondisi_counts.perlu_diganti} ({getPercentage(stats.kondisi_counts.perlu_diganti, stats.total_monitoring)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getPercentage(stats.kondisi_counts.perlu_diganti, stats.total_monitoring)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Rusak */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Rusak</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {stats.kondisi_counts.rusak} ({getPercentage(stats.kondisi_counts.rusak, stats.total_monitoring)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-red-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getPercentage(stats.kondisi_counts.rusak, stats.total_monitoring)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.total_monitoring}</p>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center">
                                    <p className="text-xs text-yellow-700 dark:text-yellow-400">Perlu Tindak Lanjut</p>
                                    <p className="text-lg font-bold text-yellow-800 dark:text-yellow-300">
                                        {stats.kondisi_counts.perlu_diganti + stats.kondisi_counts.rusak}
                                    </p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                                    <p className="text-xs text-green-700 dark:text-green-400">Layak Pakai</p>
                                    <p className="text-lg font-bold text-green-800 dark:text-green-300">{stats.kondisi_counts.baik}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Lokasi & APD Segera Expired */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Ringkasan per Lokasi */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    Ringkasan per Lokasi
                                </h3>
                                <Link href={route('lokasi.index')} className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                                    Lihat Semua
                                </Link>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {stats.lokasi_summary && stats.lokasi_summary.length > 0 ? (
                                    stats.lokasi_summary.map((lokasi, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                            <div className="flex items-center gap-2 flex-1">
                                                <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {lokasi.nama_lokasi}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {lokasi.gardu_count} Gardu Induk
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full text-xs font-semibold">
                                                    {lokasi.monitoring_count} MONITORING APD
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Belum ada data lokasi</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* APD Segera Expired */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-red-600" />
                                    APD Segera Expired
                                </h3>
                                <Link href={route('monitoring-apd.index')} className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                                    Lihat Semua
                                </Link>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {stats.apd_expiring_soon && stats.apd_expiring_soon.length > 0 ? (
                                    stats.apd_expiring_soon.map((apd, index) => {
                                        const daysRemaining = getDaysRemaining(apd.tanggal_berakhir);
                                        const isExpired = daysRemaining < 0;
                                        const isUrgent = daysRemaining <= 7 && daysRemaining >= 0;
                                        
                                        return (
                                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                <div className="flex-shrink-0">
                                                    {apd.apd_gambar ? (
                                                        <img 
                                                            src={apd.apd_gambar} 
                                                            alt={apd.apd_nama}
                                                            className="w-10 h-10 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                            <HardHat className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {apd.apd_nama}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                            {apd.lokasi_nama}
                                                        </span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                            {apd.gardu_nama}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {isExpired ? (
                                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-semibold">
                                                            Expired
                                                        </span>
                                                    ) : isUrgent ? (
                                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-semibold animate-pulse">
                                                            {daysRemaining}h lagi
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-semibold">
                                                            {daysRemaining}h lagi
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Semua APD dalam kondisi aman</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <Package className="h-5 w-5 text-cyan-600" />
                            Akses Cepat
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <Link 
                                href={route('monitoring-apd.create')}
                                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg hover:shadow-md transition-all border border-cyan-200 dark:border-cyan-800"
                            >
                                <ClipboardCheck className="h-6 w-6 text-cyan-600 dark:text-cyan-400 mb-1" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Tambah Monitoring</span>
                            </Link>
                            
                            <Link 
                                href={route('apd.create')}
                                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg hover:shadow-md transition-all border border-violet-200 dark:border-violet-800"
                            >
                                <HardHat className="h-6 w-6 text-violet-600 dark:text-violet-400 mb-1" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Tambah APD</span>
                            </Link>
                            
                            <Link 
                                href={route('serah-terima.create')}
                                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg hover:shadow-md transition-all border border-blue-200 dark:border-blue-800"
                            >
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Serah Terima</span>
                            </Link>
                            
                            <Link 
                                href={route('notifikasi.index')}
                                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg hover:shadow-md transition-all border border-amber-200 dark:border-amber-800"
                            >
                                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-1" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Lihat Notifikasi</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}