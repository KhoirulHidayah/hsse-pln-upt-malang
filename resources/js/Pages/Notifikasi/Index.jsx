import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Bell,
    Search,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    Calendar,
    Shield,
    Building2,
    Check,
    Eye,
    EyeOff
} from 'lucide-react';

export default function Index({ auth, notifications, statistics, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.status || 'Semua');
    const [readFilter, setReadFilter] = useState(filters.read_status || 'Semua');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        router.get(route('notifikasi.index'), {
            search: value,
            status: activeFilter,
            read_status: readFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterStatus = (status) => {
        setActiveFilter(status);
        
        router.get(route('notifikasi.index'), {
            search: search,
            status: status,
            read_status: readFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReadFilter = (status) => {
        setReadFilter(status);
        
        router.get(route('notifikasi.index'), {
            search: search,
            status: activeFilter,
            read_status: status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleMarkAllRead = () => {
        router.post(route('notifikasi.markAllAsRead'), {}, {
            preserveState: true,
            onSuccess: () => {
                router.reload({ only: ['notifications', 'statistics'] });
            }
        });
    };

    const handleMarkAsRead = (id) => {
        router.post(route('notifikasi.markAsRead', id), {}, {
            preserveState: true,
            onSuccess: () => {
                router.reload({ only: ['notifications', 'statistics'] });
            }
        });
    };

    const getBadgeClass = (color) => {
        switch(color) {
            case 'red':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'yellow':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'green':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getIconColorClass = (color) => {
        switch(color) {
            case 'red':
                return 'bg-red-50';
            case 'yellow':
                return 'bg-yellow-50';
            case 'green':
                return 'bg-green-50';
            default:
                return 'bg-gray-50';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Notifikasi Monitoring APD
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Monitoring masa expired APD berdasarkan standar SPLN
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Notifikasi APD" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2 space-y-2">
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-cyan-500">
                            <div className="flex items-center gap-2 mb-1">
                                <Bell className="w-4 h-4 text-cyan-500" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Belum Dibaca</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {statistics.unread}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-red-500">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Expired / Segera</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {statistics.expired}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-yellow-500">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Masa Menipis</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {statistics.warning}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Kondisi Aman</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {statistics.active}
                            </p>
                        </div>
                    </div>

                    {/* Filter & Search Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        {/* Filter Read Status */}
                        <div className="px-3 pt-3">
                            <div className="flex flex-wrap gap-1.5 pb-2">
                                <button
                                    onClick={() => handleReadFilter('Semua')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        readFilter === 'Semua'
                                            ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <Bell className="w-3 h-3" />
                                    Semua Notifikasi
                                </button>
                                <button
                                    onClick={() => handleReadFilter('Belum Dibaca')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        readFilter === 'Belum Dibaca'
                                            ? 'bg-cyan-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'
                                    }`}
                                >
                                    <EyeOff className="w-3 h-3" />
                                    Belum Dibaca {statistics.unread > 0 && `(${statistics.unread})`}
                                </button>
                                <button
                                    onClick={() => handleReadFilter('Sudah Dibaca')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        readFilter === 'Sudah Dibaca'
                                            ? 'bg-gray-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/20'
                                    }`}
                                >
                                    <Eye className="w-3 h-3" />
                                    Sudah Dibaca
                                </button>
                            </div>
                        </div>

                        {/* Filter Status Tabs */}
                        <div className="px-3">
                            <div className="flex flex-wrap gap-1.5 pb-2">
                                <button
                                    onClick={() => handleFilterStatus('Semua')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        activeFilter === 'Semua'
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Semua Status
                                </button>
                                <button
                                    onClick={() => handleFilterStatus('Merah')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        activeFilter === 'Merah'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    }`}
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    Merah (&lt; 30 hari)
                                </button>
                                <button
                                    onClick={() => handleFilterStatus('Kuning')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        activeFilter === 'Kuning'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                    }`}
                                >
                                    <Clock className="w-3 h-3" />
                                    Kuning (30-90 hari)
                                </button>
                                <button
                                    onClick={() => handleFilterStatus('Hijau')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                        activeFilter === 'Hijau'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20'
                                    }`}
                                >
                                    <CheckCircle className="w-3 h-3" />
                                    Hijau (&gt; 90 hari)
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-3 py-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Cari nama APD, lokasi, atau gardu induk..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Daftar Notifikasi
                                </h3>
                                {statistics.unread > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium hover:underline flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" />
                                        Tandai Semua Dibaca
                                    </button>
                                )}
                            </div>

                            {notifications.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2 opacity-30" />
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada notifikasi ditemukan</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        {notifications.data.map((notif) => (
                                            <div
                                                key={notif.monitoring_id}
                                                onClick={() => {
                                                    if (!notif.is_read) {
                                                        handleMarkAsRead(notif.monitoring_id);
                                                    }
                                                    router.visit(route('notifikasi.show', notif.monitoring_id));
                                                }}
                                                className={`bg-white dark:bg-gray-700 rounded-lg p-3 hover:shadow-md transition-all border cursor-pointer ${
                                                    !notif.is_read 
                                                        ? 'border-cyan-300 dark:border-cyan-700 bg-cyan-50/50 dark:bg-cyan-900/20' 
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                }`}
                                            >
                                                <div className="flex gap-3">
                                                    {/* Icon */}
                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${getIconColorClass(notif.badge_color)} flex items-center justify-center relative`}>
                                                        {notif.apd_gambar ? (
                                                            <img 
                                                                src={notif.apd_gambar} 
                                                                alt={notif.apd_nama}
                                                                className="w-9 h-9 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <Shield className={`w-6 h-6 ${
                                                                notif.badge_color === 'red' ? 'text-red-500' :
                                                                notif.badge_color === 'yellow' ? 'text-yellow-500' :
                                                                'text-green-500'
                                                            }`} />
                                                        )}
                                                        {!notif.is_read && (
                                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white"></span>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Header */}
                                                        <div className="flex items-start justify-between gap-3 mb-1.5">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`text-sm truncate ${
                                                                    !notif.is_read 
                                                                        ? 'font-bold text-gray-900 dark:text-gray-100' 
                                                                        : 'font-semibold text-gray-700 dark:text-gray-300'
                                                                }`}>
                                                                    {notif.apd_nama}
                                                                </h4>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                                                    Kode: {notif.apd_kode}
                                                                </p>
                                                            </div>
                                                            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getBadgeClass(notif.badge_color)}`}>
                                                                • {notif.status_notifikasi}
                                                            </span>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                                                            {notif.status_notifikasi === 'Expired' && notif.hari_tersisa < 0
                                                                ? `APD telah melewati masa expired. Segera lakukan pergantian untuk menjaga keamanan pekerja.`
                                                                : notif.status_notifikasi === 'Expired'
                                                                ? `Masa pakai APD tersisa ${notif.hari_tersisa} hari. Monitor kondisi secara berkala.`
                                                                : notif.status_notifikasi === 'Warning'
                                                                ? `Masa pakai APD akan habis dalam ${notif.hari_tersisa} hari. Persiapkan pergantian.`
                                                                : `Kondisi APD masih dalam masa pakai yang aman. Tidak perlu tindakan saat ini.`
                                                            }
                                                        </p>

                                                        {/* Details Grid */}
                                                        <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <Building2 className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                                <span>{notif.lokasi_nama}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                                <span>{notif.gardu_nama}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                                <span>Masa Pakai: {notif.masa_penggunaan || '-'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                                <span>Expired: {new Date(notif.tanggal_berakhir).toLocaleDateString('id-ID')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Shield className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                                <span>SPLN: {notif.standar}</span>
                                                            </div>
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between">
                                                            <span className={`text-xs font-semibold ${
                                                                notif.badge_color === 'red' ? 'text-red-600 dark:text-red-400' :
                                                                notif.badge_color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                                                                'text-green-600 dark:text-green-400'
                                                            }`}>
                                                                • {notif.status_text}
                                                            </span>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-500">
                                                                {notif.created_at}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {notifications.links && notifications.links.length > 3 && (
                                        <div className="flex items-center justify-center gap-1.5 mt-4">
                                            {notifications.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => router.get(link.url, {
                                                        search: search,
                                                        status: activeFilter,
                                                        read_status: readFilter,
                                                    })}
                                                    disabled={!link.url || link.active}
                                                    className={`min-w-[32px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        link.active
                                                            ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
                                                            : link.url
                                                            ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}