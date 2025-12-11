import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PackageSearch, Download, ArrowLeft, Eye, X, Maximize2 } from "lucide-react";

// PDF Preview Modal Component
function PdfPreviewModal({ isOpen, onClose, documentId, documentTitle }) {
    if (!isOpen) return null;

    const previewUrl = `/serah-terima/${documentId}/preview`;
    const downloadUrl = `/serah-terima/${documentId}/pdf`;

    const handleOpenNewTab = () => {
        window.open(previewUrl, '_blank');
    };

    const handleDownload = () => {
        window.location.href = downloadUrl;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-[90vh] mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <Eye className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                Preview Dokumen
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {documentTitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>

                        {/* Open in New Tab */}
                        <button
                            onClick={handleOpenNewTab}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Maximize2 className="w-4 h-4" />
                            Tab Baru
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title="PDF Preview"
                    />
                </div>

                {/* Footer Info */}
                <div className="px-6 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                    Tekan ESC atau klik di luar area untuk menutup preview
                </div>
            </div>
        </div>
    );
}

export default function Show({ auth, data }) {
    const [previewModal, setPreviewModal] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const openPreview = () => {
        setPreviewModal(true);
    };

    const closePreview = () => {
        setPreviewModal(false);
    };

    // Handle ESC key to close modal
    useState(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && previewModal) {
                closePreview();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [previewModal]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    {/* HEADER KIRI - GAYA GRADIENT CYAN/TEAL */}
                    <div className="flex items-center gap-2">
                        {/* Wrapper Icon Gradient */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <PackageSearch className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                {`Detail Serah Terima — ${data.no_seri}`}
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Informasi lengkap dokumen serah terima
                            </p>
                        </div>
                    </div>
                    
                    {/* TOMBOL AKSI PDF */}
                    <div className="flex items-center gap-2">
                        {/* Tombol Preview */}
                        <button
                            onClick={openPreview}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                        >
                            <Eye className="w-4 h-4" />
                            Preview PDF
                        </button>

                        {/* Tombol Download */}
                        <a
                            href={`/serah-terima/${data.id}/pdf`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`Detail ${data.no_seri}`} />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">

                    <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
                        <div className="p-3 text-gray-900 dark:text-gray-100 space-y-6">

                            {/* INFORMASI UMUM */}
                            <div>
                                <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                                    Informasi Umum
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">

                                    <div>
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
                                <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                                    Daftar Barang
                                </h3>

                                {data.items.length ? (
                                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <table className="w-full text-sm text-gray-700 dark:text-gray-300">

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
                                <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                                    Informasi Tambahan
                                </h3>

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

                            {/* TOMBOL KEMBALI */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <Link
                                    href={route("serah-terima.index")}
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

            {/* Preview Modal */}
            <PdfPreviewModal
                isOpen={previewModal}
                onClose={closePreview}
                documentId={data.id}
                documentTitle={data.no_seri}
            />
        </AuthenticatedLayout>
    );
}