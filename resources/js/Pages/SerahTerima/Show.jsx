import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PackageSearch, Download } from "lucide-react";

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
                    <div className="flex items-center gap-2">
                        <PackageSearch className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Detail Serah Terima — {data.no_seri}
                        </h2>
                    </div>
                    
                    {/* GUNAKAN <a> TAG BIASA, BUKAN INERTIA LINK */}
                    <a
                        href={`/serah-terima/${data.id}/pdf`}
                        target="_blank"
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium shadow inline-flex items-center gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </a>
                </div>
            }
        >
            <Head title={`Detail ${data.no_seri}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6 text-gray-900 dark:text-gray-100 space-y-10">

                            {/* INFORMASI UMUM */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">
                                    Informasi Umum
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <label className="font-bold">No Seri</label>
                                        <p>{data.no_seri}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">No Dokumen</label>
                                        <p>{data.no_dokumen}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Status Dokumen</label>
                                        <p>{data.status_dokumen_display}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Copy No</label>
                                        <p>{data.copy_no || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Nomor Revisi</label>
                                        <p>{data.nomor_revisi}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Nomor Edisi</label>
                                        <p>{data.nomor_edisi}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Tanggal Efektif</label>
                                        <p>{formatDate(data.tanggal_efektif)}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Tanggal Dokumen</label>
                                        <p>{formatDate(data.tanggal)}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Nama Penerima</label>
                                        <p>{data.nama_penerima}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Jabatan Pengirim</label>
                                        <p>{data.jabatan_pengirim}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Nama Pengirim</label>
                                        <p>{data.nama_pengirim}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Lokasi</label>
                                        <p>{data.lokasi}</p>
                                    </div>

                                </div>
                            </div>

                            {/* DAFTAR BARANG */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">
                                    Daftar Barang
                                </h3>

                                {data.items.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border border-gray-300 dark:border-gray-700 text-sm">

                                            <thead className="bg-gray-100 dark:bg-gray-700">
                                                <tr>
                                                    <th className="border p-2 dark:border-gray-600">No</th>
                                                    <th className="border p-2 dark:border-gray-600">Nama Barang</th>
                                                    <th className="border p-2 dark:border-gray-600">Merk</th>
                                                    <th className="border p-2 dark:border-gray-600">Jumlah</th>
                                                    <th className="border p-2 dark:border-gray-600">Keadaan</th>
                                                    <th className="border p-2 dark:border-gray-600">Cek</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {data.items.map((item, index) => (
                                                    <tr key={index} className="text-center">
                                                        <td className="border p-2 dark:border-gray-600">{index + 1}</td>
                                                        <td className="border p-2 dark:border-gray-600 text-left">
                                                            {item.item_nama}
                                                        </td>
                                                        <td className="border p-2 dark:border-gray-600">
                                                            {item.item_merk || "-"}
                                                        </td>
                                                        <td className="border p-2 dark:border-gray-600">{item.jumlah}</td>
                                                        <td className="border p-2 dark:border-gray-600">
                                                            <span
                                                                className={
                                                                    item.keadaan === "Baik"
                                                                        ? "text-green-600 font-semibold"
                                                                        : "text-red-600 font-semibold"
                                                                }
                                                            >
                                                                {item.keadaan}
                                                            </span>
                                                        </td>
                                                        <td className="border p-2 dark:border-gray-600">
                                                            {item.cek ? "✓" : "✗"}
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
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">
                                    Informasi Tambahan
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="font-bold">Tanggal Dibuat</label>
                                        <p>{formatDate(data.created_at)}</p>
                                    </div>

                                    <div>
                                        <label className="font-bold">Tanggal Diperbarui</label>
                                        <p>{formatDate(data.updated_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* TOMBOL */}
                            <div className="pt-4 flex justify-end">
                                <Link
                                    href={route("serah-terima.index")}
                                    className="px-4 py-2 bg-teal-600 text-white rounded shadow hover:bg-teal-700 text-sm"
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