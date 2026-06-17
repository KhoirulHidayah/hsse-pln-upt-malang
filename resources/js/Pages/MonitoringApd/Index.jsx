import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
// Menambahkan ikon Pencil dan Trash2
import { ClipboardCheck, FileUp, AlertTriangle, CheckCircle, XCircle, RefreshCw, Plus, Pencil, Trash2, FileText, Calculator } from "lucide-react"; 

// ========== KOMPONEN MODAL IMPORT EXCEL ==========
const ImportExcelModal = ({ onClose, onImportSubmit }) => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const { errors } = usePage().props;

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                {/* Header with gradient */}
                <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <FileUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Import Data Excel</h3>
                                <p className="text-sm text-emerald-50">Upload file monitoring APD</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); if (file) onImportSubmit(file); }} className="p-6">
                    {/* Drag & Drop Area */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                            dragActive 
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                                : "border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500"
                        }`}
                    >
                        <input 
                            type="file" 
                            accept=".xlsx,.xls" 
                            required 
                            onChange={(e) => setFile(e.target.files[0])} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="file-upload"
                        />
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                                    {file ? (
                                        <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <FileUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                    )}
                                </div>
                            </div>
                            
                            {file ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setFile(null); }}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Hapus file
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Drag & drop file Excel atau{" "}
                                        <label htmlFor="file-upload" className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold">
                                            pilih file
                                        </label>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Format: .xlsx, .xls (Max 10MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        {errors.file && (
                            <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                                <AlertTriangle className="h-4 w-4" />
                                <span>{errors.file}</span>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 mt-0.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                                    Panduan Import
                                </p>
                                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5">
                                    <li>• Gunakan template Excel yang disediakan</li>
                                    <li>• Pastikan format data sesuai kolom</li>
                                    <li>• Periksa kembali sebelum upload</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 mt-6">
                        <a 
                            href={route("monitoring-apd.template")} 
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                <FileUp className="h-4 w-4" />
                            </div>
                            <span>Unduh Template</span>
                        </a>
                        <div className="flex gap-2">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={!file} 
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 transition-all"
                            >
                                <FileUp className="h-4 w-4" />
                                Import Data
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ========== KOMPONEN UTAMA ==========
export default function Index({ auth, monitorings, lokasiList, garduList, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [lokasiFilter, setLokasiFilter] = useState(filters.lokasi_id || "");
    const [garduFilter, setGarduFilter] = useState(filters.gardu_induk_id || "");
    const [kondisiFilter, setKondisiFilter] = useState(filters.kondisi || "");
    const [statusNotifikasiFilter, setStatusNotifikasiFilter] = useState(filters.status_notifikasi || "");
    const [showImportModal, setShowImportModal] = useState(false);
    const { flash } = usePage().props;

    const importResults = flash.import_results || null;

    // Sort aktif dari filters yang dikirim controller
    const activeSortField     = filters.sortField     || "nilai_saw";
    const activeSortDirection = filters.sortDirection || "asc";

    // Flag agar useEffect tidak jalan saat pertama render (mount)
    const isFirstRender = useRef(true);

    const sortChanged = (field) => {
        router.get(route("monitoring-apd.index"), {
            search, lokasi_id: lokasiFilter, gardu_induk_id: garduFilter, kondisi: kondisiFilter,
            status_notifikasi: statusNotifikasiFilter, sortField: field,
            sortDirection: activeSortField === field && activeSortDirection === "asc" ? "desc" : "asc",
        }, { preserveState: true, replace: true });
    };

    useEffect(() => {
        // Skip saat mount pertama — biarkan URL/controller yang tentukan nilai awal
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const delayDebounce = setTimeout(() => {
            router.get(route("monitoring-apd.index"), {
                search, lokasi_id: lokasiFilter, gardu_induk_id: garduFilter,
                kondisi: kondisiFilter, status_notifikasi: statusNotifikasiFilter,
                sortField: activeSortField, sortDirection: activeSortDirection,
            }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, lokasiFilter, garduFilter, kondisiFilter, statusNotifikasiFilter]);

    const SortableHeader = ({ field, label }) => (
        <th onClick={() => sortChanged(field)} className="px-2 py-1.5 cursor-pointer whitespace-nowrap">
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon className={`w-3 h-3 ${activeSortField === field && activeSortDirection === "asc" ? "text-cyan-600" : ""}`} />
                    <ChevronDownIcon className={`w-3 h-3 -mt-1 ${activeSortField === field && activeSortDirection === "desc" ? "text-cyan-600" : ""}`} />
                </div>
            </div>
        </th>
    );

    const deleteMonitoring = (item) => {
        if (!window.confirm(`Hapus "${item.apd_nama}"?`)) return;
        router.delete(route("monitoring-apd.destroy", item.monitoring_id), { preserveScroll: true });
    };

    const handleImportSubmit = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        router.post(route("monitoring-apd.import"), formData, {
            onSuccess: () => setShowImportModal(false),
            preserveScroll: true,
        });
    };

    const [selectedSaw, setSelectedSaw] = useState(null);

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <ClipboardCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Monitoring APD</h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Kelola monitoring APD</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route("monitoring-apd.saw")} // Pastikan nama route di web.php adalah ini
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        <Calculator size={18} />
                        Analisis SAW
                    </Link>
                    {/* ✅ TOMBOL BARU: Link ke Laporan */}
                    <Link 
                        href={route("monitoring-apd.laporan")} 
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-purple-700 hover:to-pink-700 transition-all"
                        title="Lihat laporan masa pakai APD"
                    >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Laporan</span>
                    </Link>
                    <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-emerald-700 hover:to-green-700 transition-all">
                        <FileUp className="h-4 w-4" />Import Excel
                    </button>
                    <Link href={route("monitoring-apd.create")} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all">
                        <Plus className="h-4 w-4" />Tambah
                    </Link>
                </div>
            </div>
        }>
            <Head title="Monitoring APD" />
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    {showImportModal && <ImportExcelModal onClose={() => setShowImportModal(false)} onImportSubmit={handleImportSubmit} />}
                    
                    {importResults && (importResults.skipped > 0 ? (
                        <div className="bg-red-500 py-2 px-3 text-white rounded-lg mb-2 text-sm shadow-md">
                            Import: {importResults.imported + importResults.updated} berhasil, {importResults.skipped} gagal
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-2 px-3 text-white rounded-lg mb-2 text-sm shadow-md">
                            Import berhasil! {importResults.imported} ditambah, {importResults.updated} diperbarui
                        </div>
                    ))}
                    
                    {!importResults && flash.success && <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-2 px-3 text-white rounded-lg mb-2 text-sm shadow-md">{flash.success}</div>}
                    {!importResults && flash.error && <div className="bg-red-500 py-2 px-3 text-white rounded-lg mb-2 text-sm shadow-md">{flash.error}</div>}
                    
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
                                <TextInput className="w-full xl:col-span-2 text-sm h-9" placeholder="Cari APD..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <Select className="w-full text-sm h-9" value={lokasiFilter} onChange={(e) => setLokasiFilter(e.target.value)} placeholder="Lokasi" options={lokasiList.map(l => ({ value: l.lokasi_id, label: l.nama_lokasi }))} />
                                <Select className="w-full text-sm h-9" value={garduFilter} onChange={(e) => setGarduFilter(e.target.value)} placeholder="Gardu" options={garduList.map(g => ({ value: g.gardu_induk_id, label: g.nama_gardu_induk }))} />
                                <Select className="w-full text-sm h-9" value={kondisiFilter} onChange={(e) => setKondisiFilter(e.target.value)} placeholder="Kondisi" options={[{ value: "Baik", label: "Baik" }, { value: "Perlu Diganti", label: "Perlu Diganti" }, { value: "Rusak", label: "Rusak" }]} />
                                <Select className="w-full text-sm h-9" value={statusNotifikasiFilter} onChange={(e) => setStatusNotifikasiFilter(e.target.value)} placeholder="Status" options={[{ value: "Active", label: "Active" }, { value: "Warning", label: "Warning" }, { value: "Expired", label: "Expired" }]} />
                            </div>

                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                        <thead className="text-[11px] font-semibold uppercase bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 border-b-2 border-cyan-200 dark:border-gray-600">
                                            <tr>
                                                <th className="px-2 py-1.5 text-center w-10">No</th>
                                                <th className="px-2 py-1.5">Gambar</th>
                                                <SortableHeader field="apd_id" label="Nama APD" />
                                                <th className="px-2 py-1.5">Lokasi</th>
                                                <th className="px-2 py-1.5">Gardu</th>
                                                <SortableHeader field="stok" label="Stok" />
                                                <SortableHeader field="tanggal_distribusi" label="Distribusi" />
                                                <SortableHeader field="tanggal_pemeriksaan" label="Periksa" />
                                                <SortableHeader field="tanggal_berakhir" label="Berakhir" />
                                                <SortableHeader field="kondisi" label="Kondisi" />
                                                <SortableHeader field="status_notifikasi_otomatis" label="Status" />
                                                <SortableHeader field="nilai_saw" label="Nilai SAW" />
                                                <SortableHeader field="" label="Kelayakan" />
                                                <th className="px-2 py-1.5 text-center w-20">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {monitorings.data.length > 0 ? monitorings.data.map((item, i) => (
                                                <tr key={item.monitoring_id} className={`hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors ${item.status_saw === "Tidak Layak" ? "bg-red-50/60 dark:bg-red-900/10" : ""}`}>
                                                    <td className="px-2 py-1.5 text-center text-sm">{(monitorings.current_page - 1) * monitorings.per_page + i + 1}</td>
                                                    <td className="px-2 py-1.5"><div className="w-12 h-12 rounded border bg-gray-50">{item.apd_gambar ? <img src={item.apd_gambar} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">-</span>}</div></td>
                                                    <td className="px-2 py-1.5 font-semibold text-sm"><Link href={route("monitoring-apd.show", item.monitoring_id)} className="hover:text-cyan-600">{item.apd_nama}</Link><p className="text-xs text-gray-500 font-normal">({item.apd_kode || 'N/A'})</p></td>
                                                    <td className="px-2 py-1.5 text-sm">{item.lokasi_nama || "-"}</td>
                                                    <td className="px-2 py-1.5 text-sm">{item.gardu_nama || "-"}</td>
                                                    <td className="px-2 py-1.5 text-center"><span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${item.stok <= 0 ? "bg-red-100 text-red-700" : item.stok <= 5 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{item.stok || 0}</span></td>
                                                    <td className="px-2 py-1.5 text-xs">{item.tanggal_distribusi || "-"}</td>
                                                    <td className="px-2 py-1.5 text-xs">{item.tanggal_pemeriksaan || "-"}</td>
                                                    <td className="px-2 py-1.5 text-xs">{item.tanggal_berakhir || "-"}</td>
                                                    <td className="px-2 py-1.5"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.kondisi === "Baik" ? "bg-green-100 text-green-700" : item.kondisi === "Perlu Diganti" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{item.kondisi || "-"}</span></td>
                                                    <td className="px-2 py-1.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status_notifikasi_otomatis === "Active" ? "bg-green-100 text-green-700" : item.status_notifikasi_otomatis === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{item.status_notifikasi_otomatis}</span></td>
                                                    <td className="px-2 py-1.5 text-center text-sm font-semibold">
                                                        {item.nilai_saw ?? "-"}
                                                    </td>
                                                    <td className="px-2 py-1.5">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                            item.status_saw === "Layak"
                                                                ? "bg-green-100 text-green-700"
                                                                : item.status_saw === "Perlu Pengecekan"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}>
                                                            {item.status_saw ?? "-"}
                                                        </span>
                                                    </td>
                                                    {/* AKSI - HORIZONTAL DENGAN IKON */}
                                                    <td className="px-2 py-1.5">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <Link
                                                                href={route("monitoring-apd.edit", item.monitoring_id)}
                                                                className="inline-flex items-center justify-center p-1.5 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                                                                title="Edit Data Monitoring"
                                                            >
                                                                <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                            </Link>
                                                            <button
                                                                onClick={() => deleteMonitoring(item)}
                                                                className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                                                                title="Hapus Data Monitoring"
                                                            >
                                                                <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="12" className="px-4 py-8 text-center text-gray-400"><ClipboardCheck className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>Tidak ada data</p></td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden space-y-2">
                                {monitorings.data.length > 0 ? monitorings.data.map((item, i) => (
                                    <div key={item.monitoring_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-400 mb-1">No. {(monitorings.current_page - 1) * monitorings.per_page + i + 1}</div>
                                                <Link href={route("monitoring-apd.show", item.monitoring_id)} className="font-semibold text-sm hover:text-cyan-600 block">{item.apd_nama}</Link>
                                                <p className="text-xs text-gray-500">({item.apd_kode || 'N/A'})</p>
                                                <p className="text-xs text-gray-500">{item.lokasi_nama} • {item.gardu_nama}</p>
                                                <div className="flex items-center gap-2 text-xs mt-2"><span>Stok:</span><span className={`px-2 py-0.5 rounded-full font-bold ${item.stok <= 0 ? "bg-red-100 text-red-700" : item.stok <= 5 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{item.stok}</span><span>Kondisi:</span><span className={`px-2 py-0.5 rounded-full font-bold ${item.kondisi === "Baik" ? "bg-green-100 text-green-700" : item.kondisi === "Perlu Diganti" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{item.kondisi}</span></div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.status_notifikasi_otomatis === "Active" ? "bg-green-100 text-green-700" : item.status_notifikasi_otomatis === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{item.status_notifikasi_otomatis}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <Link href={route("monitoring-apd.edit", item.monitoring_id)} className="text-xs font-medium text-cyan-600 hover:text-cyan-800">Edit</Link>
                                            <span className="text-gray-300 text-xs">|</span>
                                            <button onClick={() => deleteMonitoring(item)} className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800">Hapus</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-400"><ClipboardCheck className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>Tidak ada data</p></div>
                                )}
                            </div>

                            <div className="mt-4"><Pagination links={monitorings.links} /></div>
                        </div>
                    </div>
                </div>
            </div>


        </AuthenticatedLayout>
    );
}