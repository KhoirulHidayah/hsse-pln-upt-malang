import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Select from "@/Components/Select";
import { Head, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import { FileText, Download, Printer, Filter, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export default function Laporan({ auth, monitorings, lokasiList, garduList, stats, filters }) {
    const [lokasiFilter, setLokasiFilter] = useState(filters.lokasi_id || "");
    const [garduFilter, setGarduFilter] = useState(filters.gardu_induk_id || "");
    const [kondisiFilter, setKondisiFilter] = useState(filters.kondisi || "");
    const [statusFilter, setStatusFilter] = useState(filters.status_notifikasi || "");
    const printRef = useRef();

    const applyFilters = () => {
        router.get(route("monitoring-apd.laporan"), {
            lokasi_id: lokasiFilter,
            gardu_induk_id: garduFilter,
            kondisi: kondisiFilter,
            status_notifikasi: statusFilter,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setLokasiFilter("");
        setGarduFilter("");
        setKondisiFilter("");
        setStatusFilter("");
        router.get(route("monitoring-apd.laporan"), {}, { preserveState: true });
    };

    const exportExcel = () => {
        const params = new URLSearchParams({
            lokasi_id: lokasiFilter || "",
            gardu_induk_id: garduFilter || "",
            kondisi: kondisiFilter || "",
            status_notifikasi: statusFilter || "",
        });
        window.location.href = route("monitoring-apd.export-laporan") + "?" + params.toString();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Laporan Masa Pakai APD
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Analisis dan monitoring masa pakai APD
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 print:hidden">
                        <button
                            onClick={exportExcel}
                            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-emerald-700 hover:to-green-700 transition-all"
                        >
                            <Download className="h-4 w-4" />
                            Export Excel
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Laporan Masa Pakai APD" />

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    {/* Filter Section */}
                    <div className="mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 print:hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Filter Laporan
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <Select
                                className="w-full text-sm h-9"
                                value={lokasiFilter}
                                onChange={(e) => setLokasiFilter(e.target.value)}
                                placeholder="Semua Lokasi"
                                options={lokasiList.map((l) => ({
                                    value: l.lokasi_id,
                                    label: l.nama_lokasi,
                                }))}
                            />
                            <Select
                                className="w-full text-sm h-9"
                                value={garduFilter}
                                onChange={(e) => setGarduFilter(e.target.value)}
                                placeholder="Semua Gardu Induk"
                                options={garduList.map((g) => ({
                                    value: g.gardu_induk_id,
                                    label: g.nama_gardu_induk,
                                }))}
                            />
                            <Select
                                className="w-full text-sm h-9"
                                value={kondisiFilter}
                                onChange={(e) => setKondisiFilter(e.target.value)}
                                placeholder="Semua Kondisi"
                                options={[
                                    { value: "Baik", label: "Baik" },
                                    { value: "Perlu Diganti", label: "Perlu Diganti" },
                                    { value: "Rusak", label: "Rusak" },
                                ]}
                            />
                            <Select
                                className="w-full text-sm h-9"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                placeholder="Semua Status"
                                options={[
                                    { value: "Active", label: "Active" },
                                    { value: "Warning", label: "Warning" },
                                    { value: "Expired", label: "Expired" },
                                ]}
                            />
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-md"
                            >
                                Terapkan Filter
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3 print:grid-cols-4 print:gap-2">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs opacity-90">Total APD</p>
                                    <p className="text-2xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <BarChart3 className="h-8 w-8 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs opacity-90">Active</p>
                                    <p className="text-2xl font-bold mt-1">{stats.active}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs opacity-90">Warning</p>
                                    <p className="text-2xl font-bold mt-1">{stats.warning}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs opacity-90">Expired</p>
                                    <p className="text-2xl font-bold mt-1">{stats.expired}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 opacity-80" />
                            </div>
                        </div>
                    </div>

                    {/* Report Table */}
                    <div id="print-area" className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 hidden print:block">
                            <h1 className="text-xl font-bold text-center mb-2">
                                LAPORAN MASA PAKAI APD
                            </h1>
                            <p className="text-sm text-center text-gray-600">
                                Tanggal: {new Date().toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                            {(lokasiFilter || garduFilter || kondisiFilter || statusFilter) && (
                                <div className="mt-2 text-xs text-gray-600">
                                    <p className="font-semibold">Filter yang diterapkan:</p>
                                    {lokasiFilter && <p>Lokasi: {lokasiList.find(l => l.lokasi_id == lokasiFilter)?.nama_lokasi}</p>}
                                    {garduFilter && <p>Gardu: {garduList.find(g => g.gardu_induk_id == garduFilter)?.nama_gardu_induk}</p>}
                                    {kondisiFilter && <p>Kondisi: {kondisiFilter}</p>}
                                    {statusFilter && <p>Status: {statusFilter}</p>}
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-2 py-2 text-left font-semibold">No</th>
                                        <th className="px-2 py-2 text-left font-semibold">Kode APD</th>
                                        <th className="px-2 py-2 text-left font-semibold">Nama APD</th>
                                        <th className="px-2 py-2 text-left font-semibold">Lokasi</th>
                                        <th className="px-2 py-2 text-left font-semibold">Gardu Induk</th>
                                        <th className="px-2 py-2 text-center font-semibold">Stok</th>
                                        <th className="px-2 py-2 text-center font-semibold">Distribusi</th>
                                        <th className="px-2 py-2 text-center font-semibold">Berakhir</th>
                                        <th className="px-2 py-2 text-center font-semibold">Masa Pakai</th>
                                        <th className="px-2 py-2 text-center font-semibold">Sisa Hari</th>
                                        <th className="px-2 py-2 text-center font-semibold">Kondisi</th>
                                        <th className="px-2 py-2 text-center font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {monitorings.length > 0 ? (
                                        monitorings.map((item, index) => (
                                            <tr key={item.monitoring_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-2 py-2">{index + 1}</td>
                                                <td className="px-2 py-2 font-mono">{item.apd_kode}</td>
                                                <td className="px-2 py-2 font-medium">{item.apd_nama}</td>
                                                <td className="px-2 py-2">{item.lokasi_nama}</td>
                                                <td className="px-2 py-2">{item.gardu_nama}</td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                                                        item.stok <= 0
                                                            ? "bg-red-100 text-red-700"
                                                            : item.stok <= 5
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}>
                                                        {item.stok}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-center">{item.tanggal_distribusi}</td>
                                                <td className="px-2 py-2 text-center">{item.tanggal_berakhir}</td>
                                                <td className="px-2 py-2 text-center font-semibold">
                                                    {item.masa_pakai_hari ? `${item.masa_pakai_hari} hari` : "-"}
                                                </td>
                                                <td className="px-2 py-2 text-center font-semibold">
                                                    {item.sisa_masa_pakai_hari !== null ? (
                                                        <span className={
                                                            item.sisa_masa_pakai_hari < 0
                                                                ? "text-red-600"
                                                                : item.sisa_masa_pakai_hari < 30
                                                                ? "text-orange-600"
                                                                : item.sisa_masa_pakai_hari < 90
                                                                ? "text-yellow-600"
                                                                : "text-green-600"
                                                        }>
                                                            {item.sisa_masa_pakai_hari} hari
                                                        </span>
                                                    ) : "-"}
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        item.kondisi === "Baik"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.kondisi === "Perlu Diganti"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {item.kondisi}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        item.status_notifikasi === "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.status_notifikasi === "Warning"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {item.status_notifikasi}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="12" className="px-4 py-8 text-center text-gray-400">
                                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                                <p>Tidak ada data yang ditampilkan</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}