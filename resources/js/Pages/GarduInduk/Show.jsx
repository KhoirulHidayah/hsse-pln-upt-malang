import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { MapPinned } from "lucide-react"; // 

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
                <div className="flex items-center gap-2">
                    <MapPinned className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {`Detail Gardu Induk "${garduInduk.nama_gardu_induk}"`}
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Gardu Induk "${garduInduk.nama_gardu_induk}"`} />

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
                                            ID Gardu Induk
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {garduInduk.gardu_induk_id}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Nama Gardu Induk
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {garduInduk.nama_gardu_induk}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Lokasi
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {garduInduk.lokasi_nama || "-"}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {formatDate(garduInduk.created_at)}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Tanggal Diperbarui
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {formatDate(garduInduk.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 🔙 TOMBOL KEMBALI */}
                            <div className="mt-8 flex justify-end space-x-2">
                                <Link
                                    href={route("gardu-induk.index")}
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
