import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Shield, ArrowLeft } from "lucide-react"; // Menambahkan ArrowLeft untuk tombol kembali

export default function Show({ auth, jenisApd }) {
    // Format tanggal agar hanya menampilkan yyyy-mm-dd tanpa jam
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
                // 🛡️ HEADER SERAGAM DENGAN INDEX DAN CREATE
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

            {/* PERUBAHAN: Mengubah py-12 menjadi py-2 */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah lebar maksimum dari max-w-5xl menjadi max-w-7xl agar mirip dengan Index.jsx */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 agar seragam dengan Create.jsx */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            {/* 🧾 INFORMASI UTAMA */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4"> {/* Mengubah gap-y-6 menjadi gap-y-4 */}
                                {/* Kolom Kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            ID Jenis APD
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{jenisApd.id}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Nama Jenis
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {jenisApd.nama_jenis}
                                        </p>
                                    </div>
                                    {/* Jumlah APD dengan badge warna */}
                                    <div className="mb-4">
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Jumlah APD
                                        </label>

                                        <div className="mt-1">
                                            <Link
                                                href={route("apd.index", { jenis_id: jenisApd.id })}
                                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold transition duration-150 hover:scale-105 shadow-sm ${ // Menyesuaikan style badge
                                                    jenisApd.apds_count === 0
                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200"
                                                        : jenisApd.apds_count < 5
                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-200"
                                                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200"
                                                }`}
                                            >
                                                {jenisApd.apds_count ?? 0}
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div>
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

                            {/* 🧩 DESKRIPSI */}
                            {/* Menyesuaikan style border-t dan padding-top */}
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

                            {/* 🔙 TOMBOL KEMBALI */}
                            <div className="mt-6 flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("jenis-apd.index")}
                                    // Mengubah style tombol agar seragam (Cyan/Teal)
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