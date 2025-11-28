import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { MapPin } from "lucide-react";

export default function Show({ auth, lokasi }) {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // 🎨 Badge warna sesuai jumlah gardu induk (sama seperti index)
    const getBadgeClass = (count) => {
        if (count === 0)
            return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
        if (count < 3)
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {`Detail Lokasi "${lokasi.nama_lokasi}"`}
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Lokasi "${lokasi.nama_lokasi}"`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                                {/* Kolom kiri */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            ID Lokasi
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {lokasi.lokasi_id}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Nama Lokasi
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {lokasi.nama_lokasi}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom kanan */}
                                <div>
                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Jumlah Gardu Induk
                                        </label>

                                        <div className="mt-1">
                                            <Link
                                                href={route("gardu-induk.index", { lokasi_id: lokasi.lokasi_id })}
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold transition hover:scale-105 ${getBadgeClass(
                                                    lokasi.gardu_induk_count
                                                )}`}
                                            >
                                                {lokasi.gardu_induk_count ?? 0}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-bold text-gray-700 dark:text-gray-300">
                                            Tanggal Dibuat
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {formatDate(lokasi.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Link
                                    href={route("lokasi.index")}
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
