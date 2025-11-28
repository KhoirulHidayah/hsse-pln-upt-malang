import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Shield } from "lucide-react";

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
                <div className="flex items-center gap-2">
                    {/* 🟦 Icon warna biru */}
                    <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {`Detail Jenis APD "${jenisApd.nama_jenis}"`}
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Jenis APD "${jenisApd.nama_jenis}"`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* 🧾 INFORMASI UTAMA */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Kolom Kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            ID Jenis APD
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">{jenisApd.id}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Nama Jenis
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {jenisApd.nama_jenis}
                                        </p>
                                    </div>
                                    {/* Jumlah APD dengan badge warna */}
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Jumlah APD
                                        </label>

                                        <div className="mt-1">
                                            <Link
                                                href={route("apd.index", { jenis_id: jenisApd.id })}
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition duration-150 hover:scale-105 ${
                                                    jenisApd.apds_count === 0
                                                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200"
                                                        : jenisApd.apds_count < 5
                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200"
                                                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200"
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
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {formatDate(jenisApd.created_at)}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Tanggal Diperbarui
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {formatDate(jenisApd.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 🧩 DESKRIPSI */}
                            <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
                                <label className="font-bold text-gray-700 dark:text-gray-300">
                                    Deskripsi Jenis APD
                                </label>
                                <p className="text-gray-800 dark:text-gray-200 mt-2 whitespace-pre-line">
                                    {jenisApd.deskripsi || "-"}
                                </p>
                            </div>

                            {/* 🔙 TOMBOL KEMBALI */}
                            <div className="mt-8 flex justify-end space-x-2">
                                <Link
                                    href={route("jenis-apd.index")}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow transition"
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
