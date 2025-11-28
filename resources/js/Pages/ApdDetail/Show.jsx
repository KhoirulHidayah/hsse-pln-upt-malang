import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ClipboardList } from "lucide-react";

export default function Show({ auth, detail }) {
    // 🗓️ Format tanggal agar hanya menampilkan tanggal
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
                        {`Detail Spesifikasi "${detail.nama_detail || "-"}"`}
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Spesifikasi ${detail.nama_detail || ""}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {/* 🖼️ GAMBAR DI ATAS */}
                            <div className="flex justify-center mb-6">
                                {detail.gambar ? (
                                    <img
                                        src={detail.gambar}
                                        alt={detail.nama_detail}
                                        className="w-64 h-64 object-cover rounded-xl border shadow-md"
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl">
                                        Tidak ada gambar
                                    </div>
                                )}
                            </div>

                            {/* 🧾 INFORMASI DETAIL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Kolom kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            ID Detail
                                        </label>
                                        <p>{detail.id}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Nama Detail
                                        </label>
                                        <p>{detail.nama_detail || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Kode Detail
                                        </label>
                                        <p>{detail.kode_detail || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            APD Terkait
                                        </label>
                                        <p>{detail.apd_nama || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Standar
                                        </label>
                                        <p>{detail.standar || "-"}</p>
                                    </div>
                                </div>

                                {/* Kolom kanan */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Bahan
                                        </label>
                                        <p>{detail.bahan || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Warna
                                        </label>
                                        <p>{detail.warna || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Ukuran
                                        </label>
                                        <p>{detail.ukuran || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Kemampuan
                                        </label>
                                        <p>{detail.kemampuan || "-"}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Masa Penggunaan
                                        </label>
                                        <p>{detail.masa_penggunaan || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 📘 FUNGSI & KETERANGAN */}
                            <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
                                <div className="mb-4">
                                    <label className="font-bold text-gray-700 dark:text-gray-300">
                                        Fungsi
                                    </label>
                                    <p className="mt-2 whitespace-pre-line">
                                        {detail.fungsi || "-"}
                                    </p>
                                </div>

                                <div>
                                    <label className="font-bold text-gray-700 dark:text-gray-300">
                                        Keterangan
                                    </label>
                                    <p className="mt-2 whitespace-pre-line">
                                        {detail.keterangan || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* 🕒 TANGGAL */}
                            <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label className="font-bold text-gray-700 dark:text-gray-300">
                                        Tanggal Dibuat
                                    </label>
                                    <p>{formatDate(detail.created_at)}</p>
                                </div>
                                <div>
                                    <label className="font-bold text-gray-700 dark:text-gray-300">
                                        Tanggal Diperbarui
                                    </label>
                                    <p>{formatDate(detail.updated_at)}</p>
                                </div>
                            </div>

                            {/* 🔙 Tombol kembali */}
                            <div className="mt-8 flex justify-end space-x-2">
                                <Link
                                    href={route("detail.index")}
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
