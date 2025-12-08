import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ClipboardList } from "lucide-react";

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {`Detail Monitoring APD "${monitoring.apd?.nama_apd || "-"}"`}
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Monitoring APD ${monitoring.apd?.nama_apd || ""}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* 🖼️ Gambar APD Detail */}
                            <div className="flex justify-center mb-6">
                                {/* PERUBAHAN: Menggunakan monitoring.apd?.gambar */}
                                {monitoring.apd?.gambar ? (
                                    <img
                                        src={
                                            monitoring.apd.gambar.startsWith("http")
                                                ? monitoring.apd.gambar
                                                : `/storage/${monitoring.apd.gambar}`
                                        }
                                        /* PERUBAHAN: Menggunakan monitoring.apd?.nama_apd untuk alt */
                                        alt={monitoring.apd?.nama_apd} 
                                        className="w-64 h-64 object-cover rounded-xl border shadow-md"
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl">
                                        Tidak ada gambar
                                    </div>
                                )}
                            </div>

                            {/* 📋 Informasi Detail Monitoring */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Kolom kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            ID Monitoring
                                        </label>
                                        <p>{monitoring.monitoring_id}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Kode APD
                                        </label>
                                        <p>{monitoring.apd?.kode_apd || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Nama APD
                                        </label>
                                        {/* PERUBAHAN: Menggunakan monitoring.apd?.nama_apd */}
                                        <p>{monitoring.apd?.nama_apd || "-"}</p> 
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Lokasi
                                        </label>
                                        <p>{monitoring.lokasi?.nama_lokasi || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Gardu Induk
                                        </label>
                                        <p>{monitoring.gardu_induk?.nama_gardu_induk || "-"}</p>
                                    </div>
                                </div>

                                {/* Kolom kanan */}
                                <div>
                                    {/* 🧮 Stok */}
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Stok
                                        </label>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                                                    monitoring.stok <= 0
                                                        ? "bg-red-100 text-red-700"
                                                        : monitoring.stok <= 5
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {monitoring.stok || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ⚙️ Kondisi */}
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Kondisi
                                        </label>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                    monitoring.kondisi === "Baik"
                                                        ? "bg-green-100 text-green-700 border border-green-200"
                                                        : monitoring.kondisi === "Perlu Diganti"
                                                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                                        : monitoring.kondisi === "Rusak"
                                                        ? "bg-red-100 text-red-700 border border-red-200"
                                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }`}
                                            >
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
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Status Masa Berlaku
                                        </label>
                                        <div className="mt-1">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    monitoring.status_notifikasi_otomatis === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : monitoring.status_notifikasi_otomatis === "Warning"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {monitoring.status_notifikasi_otomatis || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Catatan
                                        </label>
                                        <p>{monitoring.catatan || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 🕒 Tanggal-tanggal Penting */}
                            <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-y-4">
                                <div>
                                    <label className="font-bold text-gray-700 dark:text-gray-300">
                                        Tanggal Distribusi
                                    </label>
                                    <p>{formatDate(monitoring.tanggal_distribusi)}</p>
                                </div>
                                <div>
                                    <label className="font-bold text-gray-700 dark:text-gray-300">
                                        Tanggal Pemeriksaan
                                    </label>
                                    <p>{formatDate(monitoring.tanggal_pemeriksaan)}</p>
                                </div>
                                <div>
                                    <label className="font-bold text-gray-700 dark:text-gray-300">
                                        Tanggal Berakhir
                                    </label>
                                    <p>{formatDate(monitoring.tanggal_berakhir)}</p>
                                </div>
                            </div>

                            {/* 🔙 Tombol kembali */}
                            <div className="mt-8 flex justify-end space-x-2">
                                <Link
                                    href={route("monitoring-apd.index")}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow"
                                >
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