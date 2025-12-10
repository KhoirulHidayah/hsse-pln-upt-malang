import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { MapPinned, Plus, Pencil, Trash2, ClipboardCheck } from "lucide-react";

export default function Index({ auth, garduInduks, lokasis, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [lokasiFilter, setLokasiFilter] = useState(filters.lokasi_id || "");
    const { flash } = usePage().props;

    // 🔀 Fungsi sorting kolom
    const sortChanged = (field) => {
        router.get(
            route("gardu-induk.index"),
            {
                search,
                lokasi_id: lokasiFilter,
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
                route("gardu-induk.index"),
                { search, lokasi_id: lokasiFilter, sortField: filters.sortField, sortDirection: filters.sortDirection },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, lokasiFilter]);

    // 📽 Header kolom sortable
    const SortableHeader = ({ field, label, className }) => (
        <th onClick={() => sortChanged(field)} className={`px-2 py-1.5 cursor-pointer whitespace-nowrap ${className ?? ''}`}>
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon
                        className={`w-3 h-3 ${
                            filters.sortField === field && filters.sortDirection === "asc"
                                ? "text-cyan-600"
                                : ""
                        }`}
                    />
                    <ChevronDownIcon
                        className={`w-3 h-3 -mt-1 ${
                            filters.sortField === field && filters.sortDirection === "desc"
                                ? "text-cyan-600"
                                : ""
                        }`}
                    />
                </div>
            </div>
        </th>
    );

    // 🗑️ Hapus data Gardu Induk
    const deleteGarduInduk = (gardu) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus Gardu Induk "${gardu.nama_gardu_induk}"?`)) return;
        router.delete(route("gardu-induk.destroy", gardu.gardu_induk_id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    {/* 🛡️ Header kiri */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <MapPinned className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Data Gardu Induk
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Kelola data gardu induk
                            </p>
                        </div>
                    </div>

                    {/* ➕ Tombol Tambah */}
                    <Link
                        href={route("gardu-induk.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Gardu Induk
                    </Link>
                </div>
            }
        >
            <Head title="Data Gardu Induk" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    {flash.success && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-2 px-3 text-white rounded-lg mb-2 shadow-md text-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            {/* 🔎 Filter */}
                            <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <TextInput
                                    className="w-full text-sm h-9"
                                    placeholder="Cari nama gardu induk..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Select
                                    className="w-full text-sm h-9"
                                    value={lokasiFilter}
                                    onChange={(e) => setLokasiFilter(e.target.value)}
                                    placeholder="Semua Lokasi"
                                    options={lokasis.map((l) => ({
                                        value: l.lokasi_id,
                                        label: l.nama_lokasi,
                                    }))}
                                />
                            </div>

                            {/* 📋 TABEL DESKTOP */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                        <thead className="text-[11px] font-semibold uppercase bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-b-2 border-cyan-200 dark:border-gray-600">
                                            <tr>
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-10">No</th>
                                                <SortableHeader field="nama_gardu_induk" label="Nama Gardu Induk" />
                                                <SortableHeader field="lokasi.nama_lokasi" label="Lokasi" />
                                                <SortableHeader field="monitoring_apd_count" label="Jumlah Monitoring APD" className="w-32 text-center" />
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-20">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {garduInduks.data.length > 0 ? (
                                                garduInduks.data.map((gardu, index) => (
                                                    <tr key={gardu.gardu_induk_id} className="hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-2 py-1.5 text-center text-gray-600 dark:text-gray-400 font-medium text-sm">
                                                            {(garduInduks.current_page - 1) * garduInduks.per_page + index + 1}
                                                        </td>
                                                        <td className="px-2 py-1.5 font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                                            <Link 
                                                                href={route("gardu-induk.show", gardu.gardu_induk_id)} 
                                                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                                            >
                                                                {gardu.nama_gardu_induk}
                                                            </Link>
                                                        </td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                                            {gardu.lokasi_nama || "-"}
                                                        </td>

                                                        {/* Jumlah APD/Monitoring - DENGAN IKON */}
                                                        <td className="px-2 py-1.5 text-center">
                                                            <Link
                                                                href={route("monitoring-apd.index", { 
                                                                    gardu_induk_id: gardu.gardu_induk_id 
                                                                })}
                                                                className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-sm ${
                                                                    gardu.monitoring_apd_count === 0
                                                                        ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200"
                                                                        : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300 hover:bg-cyan-200"
                                                                }`}
                                                            >
                                                                <ClipboardCheck className="h-3 w-3" />
                                                                {gardu.monitoring_apd_count ?? 0}
                                                            </Link>
                                                        </td>
                                                        
                                                        {/* AKSI - HORIZONTAL DENGAN IKON */}
                                                        <td className="px-2 py-1.5 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <Link
                                                                    href={route("gardu-induk.edit", gardu.gardu_induk_id)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                                                                    title="Edit Gardu Induk"
                                                                >
                                                                    <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteGarduInduk(gardu)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                                                                    title="Hapus Gardu Induk"
                                                                >
                                                                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                                                        <MapPinned className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                                        <p>Tidak ada data ditemukan</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 📱 TABEL MOBILE */}
                            <div className="md:hidden space-y-2">
                                {garduInduks.data.length > 0 ? (
                                    garduInduks.data.map((gardu, index) => (
                                        <div key={gardu.gardu_induk_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                                        No. {(garduInduks.current_page - 1) * garduInduks.per_page + index + 1}
                                                    </div>
                                                    <Link
                                                        href={route("gardu-induk.show", gardu.gardu_induk_id)}
                                                        className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-cyan-600 dark:hover:text-cyan-400 block mb-2"
                                                    >
                                                        {gardu.nama_gardu_induk}
                                                    </Link>
                                                    
                                                    {/* Info Lokasi & APD */}
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">Lokasi: </span>
                                                            {gardu.lokasi_nama || "-"}
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">APD:</span>
                                                            <Link
                                                                href={route("monitoring-apd.index", { 
                                                                    gardu_induk_id: gardu.gardu_induk_id 
                                                                })}
                                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
                                                                    gardu.monitoring_apd_count === 0
                                                                        ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                                        : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
                                                                }`}
                                                            >
                                                                <ClipboardCheck className="h-3 w-3" />
                                                                {gardu.monitoring_apd_count ?? 0}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aksi (Mobile - Horizontal) */}
                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <Link
                                                    href={route("gardu-induk.edit", gardu.gardu_induk_id)}
                                                    className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-800"
                                                >
                                                    Edit
                                                </Link>
                                                <span className="text-gray-300 text-xs">|</span>
                                                <button
                                                    onClick={() => deleteGarduInduk(gardu)}
                                                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <MapPinned className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                        <p>Tidak ada data ditemukan</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Pagination links={garduInduks.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}