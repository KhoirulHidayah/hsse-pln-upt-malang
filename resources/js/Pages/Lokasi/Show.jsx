import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { MapPin, ArrowLeft, Building2, ClipboardCheck } from "lucide-react";

export default function Show({ auth, lokasi }) {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            {`Detail Lokasi "${lokasi.nama_lokasi}"`}
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Informasi lengkap data lokasi
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Lokasi "${lokasi.nama_lokasi}"`} />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-3 text-gray-900 dark:text-gray-100">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">

                                {/* Kolom kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            ID Lokasi
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {lokasi.lokasi_id}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Nama Lokasi
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {lokasi.nama_lokasi}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(lokasi.created_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom kanan - Hanya info statis */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                            <Building2 className="h-4 w-4" />
                                            Jumlah Gardu Induk
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {lokasi.gardu_induk_count ?? 0}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                            <ClipboardCheck className="h-4 w-4" />
                                            Jumlah APD/Monitoring
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {lokasi.monitoring_apd_count ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 📊 Card yang bisa diklik - HANYA DI SINI */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {/* Card Gardu Induk - Clickable */}
                                <Link
                                    href={route("gardu-induk.index", { lokasi_id: lokasi.lokasi_id })}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">
                                                Total Gardu Induk
                                            </p>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                                {lokasi.gardu_induk_count ?? 0}
                                            </p>
                                        </div>
                                        <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-lg">
                                            <Building2 className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-2">
                                        Klik untuk lihat semua gardu →
                                    </p>
                                </Link>

                                {/* Card APD/Monitoring - Clickable */}
                                <Link
                                    href={route("monitoring-apd.index", { lokasi_id: lokasi.lokasi_id })}
                                    className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-cyan-700 dark:text-cyan-400 font-medium mb-1">
                                                Total Monitoring APD
                                            </p>
                                            <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                                                {lokasi.monitoring_apd_count ?? 0}
                                            </p>
                                        </div>
                                        <div className="bg-cyan-200 dark:bg-cyan-800 p-3 rounded-lg">
                                            <ClipboardCheck className="h-6 w-6 text-cyan-700 dark:text-cyan-300" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-cyan-700 dark:text-cyan-400 font-medium mt-2">
                                        Klik untuk lihat semua APD →
                                    </p>
                                </Link>
                            </div>

                            {/* 🔙 TOMBOL KEMBALI */}
                            <div className="mt-6 flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("lokasi.index")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}