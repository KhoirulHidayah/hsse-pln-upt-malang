import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { HardHat } from "lucide-react";

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
                <div className="flex items-center gap-2">
                    <HardHat className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Detail APD "{apd.nama_apd}"
                    </h2>
                </div>
            }
        >
            <Head title={`Detail APD "${apd.nama_apd}"`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {/* GAMBAR APD */}
                            <div className="w-full flex justify-center mb-10">
                                {apd.gambar ? (
                                    <img
                                        src={apd.gambar}
                                        alt={apd.nama_apd}
                                        className="w-64 h-64 object-cover rounded-xl shadow-md"
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-xl">
                                        Tidak ada gambar
                                    </div>
                                )}
                            </div>

                            {/* INFORMASI DASAR */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">Informasi Dasar</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">ID APD</label>
                                        <p>{apd.id}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Jenis APD</label>
                                        <p>{apd.jenis_apd || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Nama APD</label>
                                        <p>{apd.nama_apd}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Kode APD</label>
                                        <p>{apd.kode_apd}</p>
                                    </div>
                                </div>
                            </div>

                            {/* SPESIFIKASI APD */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">Spesifikasi APD</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Bahan</label>
                                        <p>{apd.bahan || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Warna</label>
                                        <p>{apd.warna || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Ukuran</label>
                                        <p>{apd.ukuran || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Kemampuan</label>
                                        <p>{apd.kemampuan || "-"}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="font-bold text-gray-700 dark:text-gray-300">Fungsi</label>
                                    <p className="mt-2 whitespace-pre-line">{apd.fungsi || "-"}</p>
                                </div>
                            </div>

                            {/* STANDAR DAN PENGGUNAAN */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">Standar dan Penggunaan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Standar APD</label>
                                        <p>{apd.standar || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Masa Penggunaan</label>
                                        <p>{apd.masa_penggunaan || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* DESKRIPSI */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">Deskripsi</h3>
                                <p className="whitespace-pre-line">{apd.deskripsi || "-"}</p>
                            </div>

                            {/* INFORMASI TAMBAHAN */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">Informasi Tambahan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Dibuat Oleh</label>
                                        <p>{apd.createdBy?.name || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Diperbarui Oleh</label>
                                        <p>{apd.updatedBy?.name || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Tanggal Dibuat</label>
                                        <p>{formatDate(apd.created_at)}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-700 dark:text-gray-300">Tanggal Diperbarui</label>
                                        <p>{formatDate(apd.updated_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* TOMBOL KEMBALI */}
                            <div className="mt-10 flex justify-end">
                                <Link
                                    href={route("apd.index")}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm shadow"
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