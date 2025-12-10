import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { MapPinned, ArrowLeft, ClipboardCheck } from "lucide-react";

export default function Show({ auth, garduInduk }) {
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
                        <MapPinned className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            {`Detail Gardu Induk "${garduInduk.nama_gardu_induk}"`}
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Informasi lengkap data Gardu Induk
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Gardu Induk "${garduInduk.nama_gardu_induk}"`} />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {/* Kolom Kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            ID Gardu Induk
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {garduInduk.gardu_induk_id}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Nama Gardu Induk
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {garduInduk.nama_gardu_induk}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Lokasi
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {garduInduk.lokasi_nama || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                            <ClipboardCheck className="h-4 w-4" />
                                            Jumlah APD/Monitoring
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {garduInduk.monitoring_apd_count ?? 0}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(garduInduk.created_at)}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Diperbarui
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(garduInduk.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 📊 Card APD yang bisa diklik */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("monitoring-apd.index", { 
                                        gardu_induk_id: garduInduk.gardu_induk_id 
                                    })}
                                    className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer block"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-cyan-700 dark:text-cyan-400 font-medium mb-1">
                                                Total Monitoring APD
                                            </p>
                                            <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                                                {garduInduk.monitoring_apd_count ?? 0}
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
                                    href={route("gardu-induk.index")}
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