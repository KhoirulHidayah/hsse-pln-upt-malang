import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { MapPin, ArrowLeft } from "lucide-react"; // Menambahkan ArrowLeft

export default function Show({ auth, lokasi }) {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // 🎨 Badge warna sesuai jumlah gardu induk (disesuaikan agar lebih seragam)
    const getBadgeClass = (count) => {
        if (count === 0)
            // Merah
            return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200";
        if (count < 3)
            // Kuning
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-200";
        // Hijau
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // 🗺️ HEADER SERAGAM DENGAN STYLE CYAN/TEAL
                <div className="flex items-center gap-2">
                    {/* Mengubah ikon menjadi gradient Cyan/Teal */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        {/* Menyesuaikan ukuran dan warna teks header */}
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

            {/* PERUBAHAN: Mengubah py-12 menjadi py-2 */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-5xl menjadi max-w-7xl */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4"> {/* Mengubah gap-y-6 menjadi gap-y-4 */}

                                {/* Kolom kiri */}
                                <div>
                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            ID Lokasi
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {lokasi.lokasi_id}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Nama Lokasi
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {lokasi.nama_lokasi}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom kanan */}
                                <div>
                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Jumlah Gardu Induk
                                        </label>

                                        <div className="mt-1">
                                            <Link
                                                href={route("gardu-induk.index", { lokasi_id: lokasi.lokasi_id })}
                                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-sm ${getBadgeClass( // Menyesuaikan style badge
                                                    lokasi.gardu_induk_count
                                                )}`}
                                            >
                                                {lokasi.gardu_induk_count ?? 0}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        {/* Menyesuaikan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                                            {formatDate(lokasi.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 🔙 TOMBOL KEMBALI */}
                            {/* Menyesuaikan style border-t dan padding-top */}
                            <div className="mt-6 flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("lokasi.index")}
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