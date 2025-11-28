import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    MagnifyingGlassIcon, 
    BellIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    MapPinIcon,
    CalendarIcon,
    ShieldCheckIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, notifications, statistics, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.status || 'Semua');

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        router.get(route('notifikasi.index'), {
            search: value,
            status: activeFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle filter status
    const handleFilterStatus = (status) => {
        setActiveFilter(status);
        
        router.get(route('notifikasi.index'), {
            search: search,
            status: status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle mark all as read
    const handleMarkAllRead = () => {
        router.post(route('notifikasi.markAllAsRead'), {}, {
            preserveState: true,
        });
    };

    // Get badge color class
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

    // Get icon color class
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
                <div className="flex items-center gap-3">
                    <BellIcon className="w-7 h-7 text-orange-500" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Notifikasi Monitoring APD
                        </h2>
                        <p className="text-sm text-gray-500">
                            Monitoring masa expired Alat Pelindung Diri (APD) berdasarkan standar SPLN
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Notifikasi APD" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Expired Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                            <div className="flex items-center gap-3 mb-2">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                                <p className="text-sm text-gray-600">
                                    Expired / Segera Expired
                                </p>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">
                                {statistics.expired}
                            </p>
                        </div>

                        {/* Warning Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center gap-3 mb-2">
                                <ClockIcon className="w-5 h-5 text-yellow-500" />
                                <p className="text-sm text-gray-600">
                                    Masa Pakai Menipis
                                </p>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">
                                {statistics.warning}
                            </p>
                        </div>

                        {/* Active Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                <p className="text-sm text-gray-600">
                                    Kondisi Aman
                                </p>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">
                                {statistics.active}
                            </p>
                        </div>
                    </div>

                    {/* Filter & Search Section */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Filter Tabs */}
                        <div className="px-6 pt-6">
                            <div className="flex flex-wrap gap-2 pb-4">
                                <button
                                    onClick={() => handleFilterStatus('Semua')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeFilter === 'Semua'
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => handleFilterStatus('Merah')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                        activeFilter === 'Merah'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                                    }`}
                                >
                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                    Merah (&lt; 30 hari)
                                </button>
                                <button
                                    onClick={() => handleFilterStatus('Kuning')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                        activeFilter === 'Kuning'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50'
                                    }`}
                                >
                                    <ClockIcon className="w-4 h-4" />
                                    Kuning (30-90 hari)
                                </button>
                                <button
                                    onClick={() => handleFilterStatus('Hijau')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                        activeFilter === 'Hijau'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                                    }`}
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Hijau (&gt; 90 hari)
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-6 py-4 ">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Cari nama APD, lokasi, atau gardu induk..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                />
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Notifikasi</h3>
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline"
                                >
                                    Tandai Semua Dibaca
                                </button>
                            </div>

                            {notifications.data.length === 0 ? (
                                <div className="text-center py-16">
                                    <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-base">Tidak ada notifikasi ditemukan</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {notifications.data.map((notif) => (
                                            <div
                                                key={notif.monitoring_id}
                                                className="bg-white rounded-lg p-5 hover:shadow-md transition-all border border-gray-200 hover:border-gray-300"
                                            >
                                                <div className="flex gap-4">
                                                    {/* Icon */}
                                                    <div className={`flex-shrink-0 w-14 h-14 rounded-lg ${getIconColorClass(notif.badge_color)} flex items-center justify-center`}>
                                                        {notif.apd_detail_gambar ? (
                                                            <img 
                                                                src={notif.apd_detail_gambar} 
                                                                alt={notif.apd_detail_nama}
                                                                className="w-10 h-10 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <ShieldCheckIcon className={`w-8 h-8 ${
                                                                notif.badge_color === 'red' ? 'text-red-500' :
                                                                notif.badge_color === 'yellow' ? 'text-yellow-500' :
                                                                'text-green-500'
                                                            }`} />
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Header */}
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-base font-semibold text-gray-900 truncate">
                                                                    {notif.apd_nama}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 mt-0.5">
                                                                    {notif.apd_detail_nama}
                                                                </p>
                                                            </div>
                                                            <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(notif.badge_color)}`}>
                                                                • {notif.status_notifikasi}
                                                            </span>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                                            {notif.status_notifikasi === 'Expired' && notif.hari_tersisa < 0
                                                                ? `APD telah melewati masa expired. Segera lakukan pergantian untuk menjaga keamanan pekerja.`
                                                                : notif.status_notifikasi === 'Expired'
                                                                ? `Masa pakai APD tersisa ${notif.hari_tersisa} hari. Monitor kondisi secara berkala.`
                                                                : notif.status_notifikasi === 'Warning'
                                                                ? `Masa pakai APD masih dalam masa pakai yang aman. Tidak perlu tindakan saat ini.`
                                                                : `Kondisi APD masih dalam masa pakai yang aman. Tidak perlu tindakan saat ini.`
                                                            }
                                                        </p>

                                                        {/* Details Grid */}
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <BuildingOfficeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span>{notif.lokasi_nama}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span>{notif.gardu_nama}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span>Expired: {new Date(notif.tanggal_berakhir).toLocaleDateString('id-ID')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <ShieldCheckIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span>SPLN: {notif.standar}</span>
                                                            </div>
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between">
                                                            <span className={`text-sm font-semibold ${
                                                                notif.badge_color === 'red' ? 'text-red-600' :
                                                                notif.badge_color === 'yellow' ? 'text-yellow-600' :
                                                                'text-green-600'
                                                            }`}>
                                                                • {notif.status_text}
                                                            </span>
                                                            <p className="text-xs text-gray-500">
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
                                        <div className="flex items-center justify-center gap-2 mt-8">
                                            {notifications.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => router.get(link.url, {
                                                        search: search,
                                                        status: activeFilter,
                                                    })}
                                                    disabled={!link.url || link.active}
                                                    className={`min-w-[40px] px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        link.active
                                                            ? 'bg-teal-600 text-white'
                                                            : link.url
                                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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