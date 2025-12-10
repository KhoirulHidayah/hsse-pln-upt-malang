import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Shield, ArrowLeft, HardHat } from "lucide-react";

export default function Show({ auth, jenisApd }) {
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
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            {`Detail Jenis APD "${jenisApd.nama_jenis}"`}
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Informasi lengkap kategori Alat Pelindung Diri
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Jenis APD "${jenisApd.nama_jenis}"`} />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {/* Kolom Kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            ID Jenis APD
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {jenisApd.id}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Nama Jenis
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {jenisApd.nama_jenis}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                            <HardHat className="h-4 w-4" />
                                            Jumlah APD
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {jenisApd.apds_count ?? 0}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(jenisApd.created_at)}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Diperbarui
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(jenisApd.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 📋 DESKRIPSI */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                    Deskripsi Jenis APD
                                </label>
                                <div className="p-3 mt-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 min-h-[80px]">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                                        {jenisApd.deskripsi || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
                                    </p>
                                </div>
                            </div>

                            {/* 📊 Card APD yang bisa diklik */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("apd.index", { jenis_id: jenisApd.id })}
                                    className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer block"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-orange-700 dark:text-orange-400 font-medium mb-1">
                                                Total APD dalam Kategori Ini
                                            </p>
                                            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                                {jenisApd.apds_count ?? 0}
                                            </p>
                                        </div>
                                        <div className="bg-orange-200 dark:bg-orange-800 p-3 rounded-lg">
                                            <HardHat className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-orange-700 dark:text-orange-400 font-medium mt-2">
                                        Klik untuk lihat semua APD →
                                    </p>
                                </Link>
                            </div>

                            {/* 🔙 TOMBOL KEMBALI */}
                            <div className="mt-6 flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("jenis-apd.index")}
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