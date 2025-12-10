import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ClipboardList, ArrowLeft } from "lucide-react"; // Menambahkan ArrowLeft untuk tombol kembali

export default function Show({ auth, monitoring }) {
    // 🗓️ Format tanggal agar mudah dibaca
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // 🏷️ Gaya label yang konsisten
    const Label = ({ children }) => (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</label>
    );

    // 📰 Gaya teks nilai yang konsisten
    const Value = ({ children }) => (
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{children}</p>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    {/* 📦 HEADER KIRI - GAYA GRADIENT CYAN/TEAL */}
                    <div className="flex items-center gap-2">
                        {/* Wrapper Icon Gradient */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            {/* Icon diubah menjadi putih dan ukuran disesuaikan */}
                            <ClipboardList className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            {/* Menyesuaikan teks header */}
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                {`Detail Monitoring APD "${monitoring.apd?.nama_apd || "-"}"`}
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Informasi lengkap pemantauan Alat Pelindung Diri
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Monitoring APD ${monitoring.apd?.nama_apd || ""}`} />

            {/* PERUBAHAN: Mengubah py-12 menjadi py-2 */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-5xl menjadi max-w-7xl */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100 space-y-6">
                            
                            {/* 🖼️ Gambar APD Detail */}
                            <div className="w-full flex justify-center mb-6 pt-2"> {/* Mengurangi mb-10 menjadi mb-6 dan menambahkan pt-2 */}
                                {monitoring.apd?.gambar ? (
                                    <img
                                        src={
                                            monitoring.apd.gambar.startsWith("http")
                                                ? monitoring.apd.gambar
                                                : `/storage/${monitoring.apd.gambar}`
                                        }
                                        alt={monitoring.apd?.nama_apd} 
                                        className="w-48 h-48 object-cover rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700" // Menyesuaikan ukuran dan style gambar
                                    />
                                ) : (
                                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl text-xs shadow-md">
                                        Tidak ada gambar
                                    </div>
                                )}
                            </div>

                            {/* 📋 Informasi Detail Monitoring */}
                            {/* Mengubah gap-y-6 menjadi gap-y-4 untuk kepadatan yang lebih baik */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                
                                {/* Kolom kiri */}
                                <div>
                                    <div className="mb-4">
                                        <Label>ID Monitoring</Label>
                                        <Value>{monitoring.monitoring_id}</Value>
                                    </div>

                                    <div className="mb-4">
                                        <Label>Kode APD</Label>
                                        <Value>{monitoring.apd?.kode_apd || "-"}</Value>
                                    </div>

                                    <div className="mb-4">
                                        <Label>Nama APD</Label>
                                        <Value>{monitoring.apd?.nama_apd || "-"}</Value> 
                                    </div>

                                    <div className="mb-4">
                                        <Label>Lokasi</Label>
                                        <Value>{monitoring.lokasi?.nama_lokasi || "-"}</Value>
                                    </div>

                                    <div className="mb-4">
                                        <Label>Gardu Induk</Label>
                                        <Value>{monitoring.gardu_induk?.nama_gardu_induk || "-"}</Value>
                                    </div>
                                </div>

                                {/* Kolom kanan */}
                                <div>
                                    {/* 🧮 Stok */}
                                    <div className="mb-4">
                                        <Label>Stok</Label>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm shadow-sm ${
                                                    monitoring.stok <= 0
                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                        : monitoring.stok <= 5
                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                                                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                }`}
                                            >
                                                {monitoring.stok || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ⚙️ Kondisi */}
                                    <div className="mb-4">
                                        <Label>Kondisi</Label>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                                    monitoring.kondisi === "Baik"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-900"
                                                        : monitoring.kondisi === "Perlu Diganti"
                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900"
                                                        : monitoring.kondisi === "Rusak"
                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-900"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                                                }`}
                                            >
                                                {/* Memastikan ikon tetap di tempatnya */}
                                                {monitoring.kondisi === "Baik" && (
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                                {monitoring.kondisi === "Perlu Diganti" && (
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                                {monitoring.kondisi === "Rusak" && (
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                                {monitoring.kondisi || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 🔔 Status */}
                                    <div className="mb-4">
                                        <Label>Status Masa Berlaku</Label>
                                        <div className="mt-1">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium shadow-sm ${
                                                    monitoring.status_notifikasi_otomatis === "Active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                        : monitoring.status_notifikasi_otomatis === "Warning"
                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                }`}
                                            >
                                                {monitoring.status_notifikasi_otomatis || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <Label>Catatan</Label>
                                        <Value>{monitoring.catatan || "-"}</Value>
                                    </div>
                                </div>
                            </div>

                            {/* 🕒 Tanggal-tanggal Penting */}
                            {/* Mengubah gap-y-4 menjadi gap-y-6 dan menyesuaikan label/value */}
                            <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                <div>
                                    <Label>Tanggal Distribusi</Label>
                                    <Value>{formatDate(monitoring.tanggal_distribusi)}</Value>
                                </div>
                                <div>
                                    <Label>Tanggal Pemeriksaan</Label>
                                    <Value>{formatDate(monitoring.tanggal_pemeriksaan)}</Value>
                                </div>
                                <div>
                                    <Label>Tanggal Berakhir</Label>
                                    <Value>{formatDate(monitoring.tanggal_berakhir)}</Value>
                                </div>
                            </div>

                            {/* 🔙 Tombol kembali - GAYA GRADIENT CYAN/TEAL */}
                            {/* Mengubah mt-8 dan menambahkan border-t/pt-3 */}
                            <div className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <Link
                                    href={route("monitoring-apd.index")}
                                    // Menggunakan gaya gradient Cyan/Teal
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