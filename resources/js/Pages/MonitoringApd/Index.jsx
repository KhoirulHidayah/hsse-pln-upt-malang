import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
// Menambahkan ikon Pencil dan Trash2
import { ClipboardCheck, FileUp, AlertTriangle, CheckCircle, XCircle, RefreshCw, Plus, Pencil, Trash2 } from "lucide-react"; 

// ========== KOMPONEN MODAL IMPORT EXCEL ==========
const ImportExcelModal = ({ onClose, onImportSubmit }) => {
    const [file, setFile] = useState(null);
    const { errors } = usePage().props;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold">Import Data Monitoring APD</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (file) onImportSubmit(file); }} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Pilih File Excel</label>
                        <input type="file" accept=".xlsx,.xls" required onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm" />
                        {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <a href={route("monitoring-apd.template")} className="text-blue-500 text-sm underline">Unduh Template</a>
                        <button type="submit" disabled={!file} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Import</button>
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

    const sortChanged = (field) => {
        router.get(route("monitoring-apd.index"), {
            search, lokasi_id: lokasiFilter, gardu_induk_id: garduFilter, kondisi: kondisiFilter,
            status_notifikasi: statusNotifikasiFilter, sortField: field,
            sortDirection: filters.sortField === field && filters.sortDirection === "asc" ? "desc" : "asc",
        }, { preserveState: true, replace: true });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(route("monitoring-apd.index"), {
                search, lokasi_id: lokasiFilter, gardu_induk_id: garduFilter,
                kondisi: kondisiFilter, status_notifikasi: statusNotifikasiFilter,
                sortField: filters.sortField, sortDirection: filters.sortDirection,
            }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, lokasiFilter, garduFilter, kondisiFilter, statusNotifikasiFilter]);

    const SortableHeader = ({ field, label }) => (
        <th onClick={() => sortChanged(field)} className="px-2 py-1.5 cursor-pointer whitespace-nowrap">
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon className={`w-3 h-3 ${filters.sortField === field && filters.sortDirection === "asc" ? "text-cyan-600" : ""}`} />
                    <ChevronDownIcon className={`w-3 h-3 -mt-1 ${filters.sortField === field && filters.sortDirection === "desc" ? "text-cyan-600" : ""}`} />
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
                                                <th className="px-2 py-1.5 text-center w-20">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {monitorings.data.length > 0 ? monitorings.data.map((item, i) => (
                                                <tr key={item.monitoring_id} className="hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors">
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