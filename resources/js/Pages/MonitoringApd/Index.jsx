import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { ClipboardCheck, FileUp, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

// ========== KOMPONEN ERROR DETAIL YANG LEBIH BAIK ==========
const ErrorDetailsCard = ({ errors }) => {
    if (!errors || errors.length === 0) return null;

    // Kelompokkan error berdasarkan jenis
    const errorsByType = {};
    errors.forEach(error => {
        error.errors.forEach(errMsg => {
            if (!errorsByType[errMsg]) {
                errorsByType[errMsg] = [];
            }
            errorsByType[errMsg].push(error);
        });
    });

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">
                        Detail Baris Yang Gagal Diimport ({errors.length} baris)
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        Berikut adalah detail error untuk setiap baris yang gagal. Perbaiki data sesuai petunjuk di bawah.
                    </p>
                </div>
            </div>

            {/* Summary Error by Type */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
                    📊 Ringkasan Error Berdasarkan Jenis:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(errorsByType).map(([errorType, errorList]) => (
                        <div key={errorType} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/30 rounded">
                            <span className="text-xs text-gray-700 dark:text-gray-300">{errorType}</span>
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
                                {errorList.length}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Error List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {errors.map((error, index) => (
                    <div 
                        key={index} 
                        className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-4 hover:shadow-md transition-shadow"
                    >
                        {/* Header dengan nomor baris */}
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white text-sm font-bold flex-shrink-0">
                                {error.row}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    Baris ke-{error.row}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {error.errors.length} error ditemukan
                                </p>
                            </div>
                        </div>

                        {/* Error Messages */}
                        <div className="space-y-2 mb-3">
                            {error.errors.map((errMsg, errIdx) => (
                                <div key={errIdx} className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                        {errMsg}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Data yang diinput */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                📋 Data yang diinput:
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Nama APD:</span>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {error.data.nama_apd || '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Detail APD:</span>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {error.data.detail_apd || '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Lokasi:</span>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {error.data.lokasi || '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">Gardu Induk:</span>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {error.data.gardu_induk || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Saran Perbaikan */}
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                💡 Cara Memperbaiki:
                            </p>
                            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                                {error.errors.map((errMsg, idx) => (
                                    <li key={idx}>
                                        {errMsg.includes('tidak ditemukan') && 
                                            'Pastikan nama yang diinput sama persis dengan data di sheet referensi (gunakan copy-paste)'
                                        }
                                        {errMsg.includes('tidak valid') && 
                                            'Periksa format data (tanggal harus YYYY-MM-DD, stok harus angka)'
                                        }
                                        {!errMsg.includes('tidak ditemukan') && !errMsg.includes('tidak valid') &&
                                            'Periksa kembali data sesuai panduan di sheet "Panduan"'
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer dengan tips */}
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    ⚠️ Tips untuk menghindari error:
                </p>
                <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1 list-disc list-inside">
                    <li>Gunakan copy-paste dari sheet referensi untuk Nama APD, Detail APD, Lokasi, dan Gardu Induk</li>
                    <li>Pastikan format tanggal adalah YYYY-MM-DD (contoh: 2025-01-15)</li>
                    <li>Pastikan tidak ada spasi berlebih di awal atau akhir data</li>
                    <li>Periksa sheet "Ref - APD", "Ref - Detail APD", "Ref - Lokasi", dan "Ref - Gardu Induk" untuk melihat daftar data yang tersedia</li>
                </ul>
            </div>
        </div>
    );
};

// ========== KOMPONEN RINGKASAN HASIL IMPORT ==========
const ImportSummaryCard = ({ results }) => {
    if (!results) return null;

    const { imported, updated, skipped, total_processed } = results;
    const successRate = total_processed > 0 
        ? Math.round(((imported + updated) / total_processed) * 100) 
        : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Hasil Import Excel
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tingkat keberhasilan: <span className="font-bold">{successRate}%</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Data Baru */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        <span className="text-3xl font-bold text-green-700 dark:text-green-300">
                            {imported}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Data Baru Ditambahkan
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Record baru berhasil disimpan
                    </p>
                </div>

                {/* Data Diperbarui */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                        <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                            {updated}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Data Diperbarui
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Data duplikat berhasil di-update
                    </p>
                </div>

                {/* Data Gagal */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-2">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        <span className="text-3xl font-bold text-red-700 dark:text-red-300">
                            {skipped}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        Data Gagal
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Baris dengan error atau tidak valid
                    </p>
                </div>
            </div>
        </div>
    );
};

// ========== MODAL IMPORT EXCEL ==========
const ImportExcelModal = ({ onClose, onImportSubmit, templateLink }) => {
    const [file, setFile] = useState(null);
    const { errors } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            onImportSubmit(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 transition-transform duration-300 transform scale-100">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Import Data Monitoring APD (Excel)
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pilih File Excel (.xlsx, .xls)
                        </label>
                        <input
                            type="file"
                            name="file"
                            accept=".xlsx,.xls"
                            required
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-300 dark:hover:file:bg-gray-600"
                        />
                         {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                         <a
                            href={templateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline text-sm hover:text-blue-600 transition"
                        >
                            Unduh Template Excel
                        </a>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-150 flex items-center gap-1"
                            disabled={!file}
                        >
                            <FileUp className="h-4 w-4" /> Import Data
                        </button>
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
    const [showImportModal, setShowImportModal] = useState(false);
    const { flash } = usePage().props;

    // ⚠️ Perubahan disini: Ambil import_results dari flash
    const importResults = flash.import_results || null;
    const showErrorDetails = flash.show_error_details || false;

    // 🔍 Sorting kolom
    const sortChanged = (field) => {
        router.get(
            route("monitoring-apd.index"),
            {
                search,
                lokasi_id: lokasiFilter,
                gardu_induk_id: garduFilter,
                kondisi: kondisiFilter,
                sortField: field,
                sortDirection:
                    filters.sortField === field && filters.sortDirection === "asc"
                        ? "desc"
                        : "asc",
            },
            { preserveState: true, replace: true }
        );
    };

    // 🔍 Pencarian otomatis (debounce)
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                route("monitoring-apd.index"),
                {
                    search,
                    lokasi_id: lokasiFilter,
                    gardu_induk_id: garduFilter,
                    kondisi: kondisiFilter,
                    sortField: filters.sortField,
                    sortDirection: filters.sortDirection,
                },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, lokasiFilter, garduFilter, kondisiFilter]);

    const SortableHeader = ({ field, label }) => (
        <th onClick={() => sortChanged(field)} className="px-3 py-2 cursor-pointer whitespace-nowrap">
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon
                        className={`w-3 h-3 ${
                            filters.sortField === field && filters.sortDirection === "asc"
                                ? "text-blue-500"
                                : ""
                        }`}
                    />
                    <ChevronDownIcon
                        className={`w-3 h-3 -mt-1 ${
                            filters.sortField === field && filters.sortDirection === "desc"
                                ? "text-blue-500"
                                : ""
                        }`}
                    />
                </div>
            </div>
        </th>
    );

    // 🗑️ Hapus data Monitoring
    const deleteMonitoring = (item) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus data Monitoring untuk "${item.apd_detail_nama}"?`))
            return;
        router.delete(route("monitoring-apd.destroy", item.monitoring_id), { preserveScroll: true });
    };

    // ⬆️ Handler Submit Import Excel
    const handleImportSubmit = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        router.post(route("monitoring-apd.import"), formData, {
            onSuccess: () => {
                setShowImportModal(false);
            },
            onError: () => {
                // Biarkan modal terbuka jika ada error
            },
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-gray-700">
                            <ClipboardCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Monitoring APD
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Data distribusi, kondisi, dan masa berlaku alat pelindung diri (APD).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition duration-150"
                        >
                            <FileUp className="h-4 w-4" />
                            Import Excel
                        </button>

                        <Link
                            href={route("monitoring-apd.create")}
                            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambah Monitoring
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Monitoring APD" />

            <div className="py-12">
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                    {/* ⚙️ MODAL IMPORT EXCEL */}
                    {showImportModal && (
                        <ImportExcelModal
                            onClose={() => setShowImportModal(false)}
                            onImportSubmit={handleImportSubmit}
                            templateLink={route("monitoring-apd.template")}
                        />
                    )}

                    {/* ✅ RINGKASAN HASIL IMPORT */}
                    {importResults && <ImportSummaryCard results={importResults} />}

                    {/* ⚠️ DETAIL ERROR JIKA ADA */}
                    {showErrorDetails && importResults?.errors && (
                        <ErrorDetailsCard errors={importResults.errors} />
                    )}

                    {/* Alert Messages - Simple alerts for quick feedback */}
                    {flash.success && !importResults && (
                        <div className="bg-emerald-500 py-3 px-4 text-white rounded-lg mb-4 flex items-start gap-2 shadow-lg">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="flex-1">{flash.success}</span>
                        </div>
                    )}

                    {flash.error && !showErrorDetails && (
                        <div className="bg-red-500 py-3 px-4 text-white rounded-lg mb-4 flex items-start gap-2 shadow-lg">
                            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="flex-1">{flash.error}</span>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* 🔎 Filter */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <TextInput
                                    className="w-full"
                                    placeholder="Cari nama APD..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Select
                                    className="w-full"
                                    value={lokasiFilter}
                                    onChange={(e) => setLokasiFilter(e.target.value)}
                                    placeholder="Semua Lokasi"
                                    options={lokasiList.map((l) => ({
                                        value: l.lokasi_id,
                                        label: l.nama_lokasi,
                                    }))}
                                />
                                <Select
                                    className="w-full"
                                    value={garduFilter}
                                    onChange={(e) => setGarduFilter(e.target.value)}
                                    placeholder="Semua Gardu Induk"
                                    options={garduList.map((g) => ({
                                        value: g.gardu_induk_id,
                                        label: g.nama_gardu_induk,
                                    }))}
                                />
                                <Select
                                    className="w-full"
                                    value={kondisiFilter}
                                    onChange={(e) => setKondisiFilter(e.target.value)}
                                    placeholder="Semua Kondisi"
                                    options={[
                                        { value: "Baik", label: "Baik" },
                                        { value: "Perlu Diganti", label: "Perlu Diganti" },
                                        { value: "Rusak", label: "Rusak" },
                                    ]}
                                />
                            </div>

                            {/* 📋 TABEL DESKTOP - Dengan wrapper scroll horizontal */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr>
                                                <th className="px-3 py-2 whitespace-nowrap sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">No</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Gambar</th>
                                                <SortableHeader field="apd_detail_nama" label="Nama APD Detail" />
                                                <th className="px-3 py-2 whitespace-nowrap">Lokasi</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Gardu Induk</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Stok</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Tanggal Distribusi</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Tanggal Pemeriksaan</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Tanggal Berakhir</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Kondisi</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Status</th>
                                                <th className="px-3 py-2 text-right whitespace-nowrap sticky right-0 bg-gray-50 dark:bg-gray-700 z-10">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monitorings.data.length > 0 ? (
                                                monitorings.data.map((item, index) => (
                                                    <tr key={item.monitoring_id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-3 py-2 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800">
                                                            {(monitorings.current_page - 1) * monitorings.per_page +
                                                                index +
                                                                1}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <div className="w-16 h-16 overflow-hidden rounded-md border flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                                {item.apd_detail_gambar ? (
                                                                    <img
                                                                        src={item.apd_detail_gambar}
                                                                        alt={item.apd_detail_nama}
                                                                        className="object-contain w-full h-full"
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">-</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-100 min-w-[200px] max-w-[250px]">
                                                            <Link
                                                                href={route("monitoring-apd.show", item.monitoring_id)}
                                                                className="hover:underline line-clamp-2"
                                                            >
                                                                {item.apd_detail_nama}
                                                            </Link>
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap">{item.lokasi_nama || "-"}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">{item.gardu_nama || "-"}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                                                                    item.stok <= 0
                                                                        ? "bg-red-100 text-red-700"
                                                                        : item.stok <= 5
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : "bg-green-100 text-green-700"
                                                                }`}
                                                            >
                                                                {item.stok || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap">{item.tanggal_distribusi || "-"}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">{item.tanggal_pemeriksaan || "-"}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">{item.tanggal_berakhir || "-"}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                                    item.kondisi === "Baik"
                                                                        ? "bg-green-100 text-green-700 border border-green-200"
                                                                        : item.kondisi === "Perlu Diganti"
                                                                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                                                        : item.kondisi === "Rusak"
                                                                        ? "bg-red-100 text-red-700 border border-red-200"
                                                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                                                }`}
                                                            >
                                                                {item.kondisi === "Baik" && (
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                                {item.kondisi === "Perlu Diganti" && (
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                                {item.kondisi === "Rusak" && (
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                                {item.kondisi || "-"}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    item.status_notifikasi_otomatis === "Active"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : item.status_notifikasi_otomatis === "Warning"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                {item.status_notifikasi_otomatis}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 text-right whitespace-nowrap sticky right-0 bg-white dark:bg-gray-800">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={route("monitoring-apd.edit", item.monitoring_id)}
                                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteMonitoring(item)}
                                                                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="12" className="px-3 py-4 text-center text-gray-400">
                                                        Tidak ada data ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 📱 MOBILE VIEW */}
                            <div className="md:hidden">
                                {monitorings.data.length > 0 ? (
                                    monitorings.data.map((item, index) => (
                                        <div key={item.monitoring_id} className="border-b py-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                                                        {item.apd_detail_nama}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {item.lokasi_nama || "-"} • {item.gardu_nama || "-"}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                                        item.status_notifikasi_otomatis === "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.status_notifikasi_otomatis === "Warning"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {item.status_notifikasi_otomatis}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500 flex items-center gap-3 flex-wrap">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">Stok:</span>
                                                    <span
                                                        className={`inline-flex items-center justify-center px-2 py-1 rounded-full font-semibold text-xs ${
                                                            item.stok <= 0
                                                                ? "bg-red-100 text-red-700"
                                                                : item.stok <= 5
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-green-100 text-green-700"
                                                        }`}
                                                    >
                                                        {item.stok || 0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">Kondisi:</span>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                                            item.kondisi === "Baik"
                                                                ? "bg-green-100 text-green-700"
                                                                : item.kondisi === "Perlu Diganti"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {item.kondisi || "-"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex gap-3 text-xs">
                                                <Link
                                                    href={route("monitoring-apd.edit", item.monitoring_id)}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteMonitoring(item)}
                                                    className="text-red-600 dark:text-red-400 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 py-4">Tidak ada data ditemukan.</p>
                                )}
                            </div>

                            <Pagination links={monitorings.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}