import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PackageSearch, Download, ArrowLeft } from "lucide-react"; // Menambahkan ArrowLeft

export default function Show({ auth, data }) {
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
                <div className="flex items-center justify-between">
                    {/* 📦 HEADER KIRI - GAYA GRADIENT CYAN/TEAL */}
                    <div className="flex items-center gap-2">
                        {/* Wrapper Icon Gradient */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <PackageSearch className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            {/* Menyesuaikan teks header */}
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                {`Detail Serah Terima — ${data.no_seri}`}
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Informasi lengkap dokumen serah terima
                            </p>
                        </div>
                    </div>
                    
                    {/* ⬇️ TOMBOL EXPORT PDF - PERUBAHAN KE MERAH */}
                    <a
                        href={`/serah-terima/${data.id}/pdf`}
                        target="_blank"
                        // PERUBAHAN: Menggunakan warna merah (bg-red-600)
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </a>
                </div>
            }
        >
            <Head title={`Detail ${data.no_seri}`} />

            {/* PERUBAHAN: Mengubah py-12 menjadi py-2 */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-5xl menjadi max-w-7xl */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">

                    <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 dan space-y-10 menjadi space-y-6 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100 space-y-6">

                            {/* INFORMASI UMUM */}
                            <div>
                                {/* Perubahan style h3 untuk konsistensi */}
                                <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                                    Informasi Umum
                                </h3>

                                {/* PERUBAHAN: Mengubah gap-6 menjadi gap-x-12 gap-y-4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">

                                    <div>
                                        {/* Perubahan style label */}
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">No Seri</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.no_seri}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">No Dokumen</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.no_dokumen}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Status Dokumen</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.status_dokumen_display}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Copy No</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.copy_no || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Nomor Revisi</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.nomor_revisi}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Nomor Edisi</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.nomor_edisi}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Tanggal Efektif</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{formatDate(data.tanggal_efektif)}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Tanggal Dokumen</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{formatDate(data.tanggal)}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Nama Penerima</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.nama_penerima}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Jabatan Pengirim</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.jabatan_pengirim}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Nama Pengirim</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.nama_pengirim}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Lokasi</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{data.lokasi}</p>
                                    </div>

                                </div>
                            </div>

                            {/* DAFTAR BARANG */}
                            <div>
                                {/* Perubahan style h3 untuk konsistensi */}
                                <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                                    Daftar Barang
                                </h3>

                                {data.items.length ? (
                                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <table className="w-full text-sm text-gray-700 dark:text-gray-300">

                                            {/* PERUBAHAN: Style thead menggunakan gradient cyan/teal */}
                                            <thead className="text-xs font-semibold uppercase bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-b-2 border-cyan-200 dark:border-gray-600">
                                                <tr>
                                                    <th className="p-2 border-r dark:border-gray-600 w-16">No</th>
                                                    <th className="p-2 border-r dark:border-gray-600 text-left">Nama Barang</th>
                                                    <th className="p-2 border-r dark:border-gray-600">Merk</th>
                                                    <th className="p-2 border-r dark:border-gray-600 w-20">Jumlah</th>
                                                    <th className="p-2 border-r dark:border-gray-600 w-24">Keadaan</th>
                                                    <th className="p-2 w-16">Cek</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {data.items.map((item, index) => (
                                                    <tr key={index} className="text-center hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="p-2 border-r dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-2 border-r dark:border-gray-600 text-left text-gray-800 dark:text-gray-100">
                                                            {item.item_nama}
                                                        </td>
                                                        <td className="p-2 border-r dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                                            {item.item_merk || "-"}
                                                        </td>
                                                        <td className="p-2 border-r dark:border-gray-600 text-gray-800 dark:text-gray-100 font-semibold">
                                                            {item.jumlah}
                                                        </td>
                                                        <td className="p-2 border-r dark:border-gray-600">
                                                            <span
                                                                className={`font-semibold text-xs px-2 py-0.5 rounded-full shadow-sm ${
                                                                    item.keadaan === "Baik"
                                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                                }`}
                                                            >
                                                                {item.keadaan}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 text-xl font-bold">
                                                            <span className={item.cek ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                                                {item.cek ? "✓" : "✗"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Tidak ada item barang.</p>
                                )}
                            </div>

                            {/* INFORMASI TAMBAHAN */}
                            <div>
                                {/* Perubahan style h3 untuk konsistensi */}
                                <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                                    Informasi Tambahan
                                </h3>

                                {/* PERUBAHAN: Mengubah gap-6 menjadi gap-x-12 gap-y-4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Tanggal Dibuat</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{formatDate(data.created_at)}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Tanggal Diperbarui</label>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{formatDate(data.updated_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 🔙 TOMBOL KEMBALI */}
                            {/* PERUBAHAN: Mengubah pt-4 menjadi pt-3, menambahkan border-t, dan mengubah style tombol menjadi Cyan/Teal */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <Link
                                    href={route("serah-terima.index")}
                                    // Mengubah style tombol menjadi gradient Cyan/Teal (konsisten dengan tombol kembali yang lain)
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