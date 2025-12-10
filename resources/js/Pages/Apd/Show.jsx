import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { HardHat, ArrowLeft } from "lucide-react"; // Menambahkan ArrowLeft

export default function Show({ auth, apd }) {
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
                // 👷 HEADER SERAGAM DENGAN STYLE CYAN/TEAL
                <div className="flex items-center gap-2">
                    {/* Mengubah ikon menjadi gradient Cyan/Teal */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <HardHat className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            {`Detail APD "${apd.nama_apd}"`}
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Informasi lengkap data Alat Pelindung Diri
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Detail APD "${apd.nama_apd}"`} />

            {/* PERUBAHAN: Mengubah py-12 menjadi py-2 */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-5xl menjadi max-w-7xl */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">

                            {/* GAMBAR APD */}
                            <div className="w-full flex justify-center mb-6 pt-2"> {/* Mengurangi mb-10 menjadi mb-6 dan menambahkan pt-2 */}
                                {apd.gambar ? (
                                    <img
                                        src={apd.gambar}
                                        alt={apd.nama_apd}
                                        className="w-48 h-48 object-cover rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700" // Menyesuaikan ukuran dan style gambar
                                    />
                                ) : (
                                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl text-xs shadow-md">
                                        Tidak ada gambar
                                    </div>
                                )}
                            </div>

                            {/* INFORMASI DASAR */}
                            <div className="mb-6 pt-3 border-t border-gray-200 dark:border-gray-700"> {/* Menyesuaikan margin dan border */}
                                {/* Mengubah h3 style */}
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">
                                    Informasi Dasar
                                </h3>
                                {/* Mengubah gap-6 menjadi gap-x-12 gap-y-4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <div>
                                        {/* Menyesuaikan label dan p style */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">ID APD</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.id}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Jenis APD</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.jenis_apd || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Nama APD</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.nama_apd}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Kode APD</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.kode_apd}</p>
                                    </div>
                                </div>
                            </div>

                            {/* SPESIFIKASI APD */}
                            <div className="mb-6 pt-3 border-t border-gray-200 dark:border-gray-700"> {/* Menyesuaikan margin dan border */}
                                {/* Mengubah h3 style */}
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">
                                    Spesifikasi APD
                                </h3>
                                {/* Mengubah gap-6 menjadi gap-x-12 gap-y-4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Bahan</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.bahan || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Warna</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.warna || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Ukuran</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.ukuran || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Kemampuan</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.kemampuan || "-"}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Fungsi</label>
                                    {/* Menyesuaikan style box deskripsi/fungsi */}
                                    <div className="p-3 mt-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 min-h-[50px]">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                                            {apd.fungsi || <span className="text-gray-400 italic">Tidak ada fungsi spesifik</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* STANDAR DAN PENGGUNAAN */}
                            <div className="mb-6 pt-3 border-t border-gray-200 dark:border-gray-700"> {/* Menyesuaikan margin dan border */}
                                {/* Mengubah h3 style */}
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">
                                    Standar dan Penggunaan
                                </h3>
                                {/* Mengubah gap-6 menjadi gap-x-12 gap-y-4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Standar APD</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.standar || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Masa Penggunaan</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.masa_penggunaan || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* DESKRIPSI */}
                            <div className="mb-6 pt-3 border-t border-gray-200 dark:border-gray-700"> {/* Menyesuaikan margin dan border */}
                                {/* Mengubah h3 style */}
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">
                                    Deskripsi Tambahan
                                </h3>
                                {/* Menyesuaikan style box deskripsi/fungsi */}
                                <div className="p-3 mt-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 min-h-[50px]">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                                        {apd.deskripsi || <span className="text-gray-400 italic">Tidak ada deskripsi tambahan</span>}
                                    </p>
                                </div>
                            </div>

                            {/* INFORMASI TAMBAHAN */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700"> {/* Menyesuaikan border-t */}
                                {/* Mengubah h3 style */}
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">
                                    Informasi Log
                                </h3>
                                {/* Mengubah gap-6 menjadi gap-x-12 gap-y-4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Dibuat Oleh</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.createdBy?.name || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Diperbarui Oleh</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{apd.updatedBy?.name || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Tanggal Dibuat</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{formatDate(apd.created_at)}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Tanggal Diperbarui</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{formatDate(apd.updated_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* TOMBOL KEMBALI */}
                            <div className="mt-6 flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("apd.index")}
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