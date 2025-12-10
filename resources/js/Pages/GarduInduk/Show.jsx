import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { MapPinned, ArrowLeft } from "lucide-react"; // Menambahkan ArrowLeft

export default function Show({ auth, garduInduk }) {
    // Format tanggal agar hanya menampilkan yyyy-mm-dd
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
                // 🗺️ HEADER SERAGAM DENGAN STYLE CYAN/TEAL
                <div className="flex items-center gap-2">
                    {/* Mengubah ikon menjadi gradient Cyan/Teal */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <MapPinned className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        {/* Menyesuaikan ukuran dan warna teks header */}
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

            {/* PERUBAHAN: Mengubah py-12 menjadi py-2 */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-5xl menjadi max-w-7xl */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            {/* 🧾 INFORMASI UTAMA */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4"> {/* Mengubah gap-y-6 menjadi gap-y-4 */}
                                {/* Kolom Kiri */}
                                <div>
                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            ID Gardu Induk
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {garduInduk.gardu_induk_id}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Nama Gardu Induk
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {garduInduk.nama_gardu_induk}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div>
                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Lokasi
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {garduInduk.lokasi_nama || "-"}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(garduInduk.created_at)}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Diperbarui
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(garduInduk.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 🔙 TOMBOL KEMBALI */}
                            <div className="mt-6 flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700"> {/* Menyesuaikan style border-t dan padding-top */}
                                <Link
                                    href={route("gardu-induk.index")}
                                    // Mengubah style tombol menjadi gradient Cyan/Teal
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