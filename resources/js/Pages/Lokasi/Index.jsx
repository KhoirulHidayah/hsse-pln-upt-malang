import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
// Menambahkan ikon untuk Aksi agar bisa dipertimbangkan jika ingin diganti.
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"; 

export default function Index({ auth, lokasis, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const { flash } = usePage().props;

    // 🔍 Sorting kolom
    const sortChanged = (field) => {
        router.get(
            route("lokasi.index"),
            {
                search,
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
                route("lokasi.index"),
                { search, sortField: filters.sortField, sortDirection: filters.sortDirection },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    // 📽 Komponen Header yang bisa di-sort
    const SortableHeader = ({ field, label, className }) => ( // 🛠️ TAMBAH className
        <th onClick={() => sortChanged(field)} className={`px-2 py-1.5 cursor-pointer whitespace-nowrap ${className ?? ''}`}> {/* 🛠️ GUNAKAN className */}
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

    // 🗑️ Hapus data lokasi
    const deleteLokasi = (lokasi) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus lokasi "${lokasi.nama_lokasi}"?`)) return;
        router.delete(route("lokasi.destroy", lokasi.lokasi_id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    {/* 🛡️ Header kiri */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Data Lokasi
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Kelola lokasi gardu induk
                            </p>
                        </div>
                    </div>

                    {/* ➕ Tombol Tambah */}
                    <Link
                        href={route("lokasi.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Lokasi
                    </Link>
                </div>
            }
        >
            <Head title="Data Lokasi" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    {flash.success && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-2 px-3 text-white rounded-lg mb-2 shadow-md text-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            {/* 🔎 Filter pencarian */}
                            <div className="mb-2">
                                <TextInput
                                    className="w-full md:w-80 text-sm h-9"
                                    placeholder="Cari nama lokasi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* 📋 TABEL DESKTOP */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                        <thead className="text-[11px] font-semibold uppercase bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-b-2 border-cyan-200 dark:border-gray-600">
                                            <tr>
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-10">No</th>
                                                <SortableHeader field="nama_lokasi" label="Nama Lokasi" />
                                                <SortableHeader field="gardu_induk_count" label="Jumlah Gardu Induk" className="w-36" /> {/* 🛠️ TAMBAH w-36 */}
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-20">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {lokasis.data.length > 0 ? (
                                                lokasis.data.map((lokasi, index) => (
                                                    <tr key={lokasi.lokasi_id} className="hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-2 py-1.5 text-center text-gray-600 dark:text-gray-400 font-medium text-sm">
                                                            {(lokasis.current_page - 1) * lokasis.per_page + index + 1}
                                                        </td>
                                                        <td className="px-2 py-1.5 font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                                            <Link 
                                                                href={route("lokasi.show", lokasi.lokasi_id)} 
                                                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                                            >
                                                                {lokasi.nama_lokasi}
                                                            </Link>
                                                        </td>

                                                        {/* Jumlah Gardu Induk */}
                                                        <td className="px-2 py-1.5 text-center">
                                                            <Link
                                                                href={route("gardu-induk.index", { lokasi_id: lokasi.lokasi_id })}
                                                                className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-sm ${
                                                                    lokasi.gardu_induk_count === 0
                                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200"
                                                                        : lokasi.gardu_induk_count < 3
                                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-200"
                                                                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200"
                                                                }`}
                                                            >
                                                                {lokasi.gardu_induk_count ?? 0}
                                                            </Link>
                                                        </td>

                                                        {/* AKSI - HORIZONTAL */}
                                                        <td className="px-2 py-1.5 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                {/* Tombol Edit dengan Ikon */}
                                                                <Link
                                                                    href={route("lokasi.edit", lokasi.lokasi_id)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                                                                    title="Edit Lokasi"
                                                                >
                                                                    <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </Link>
                                                                
                                                                {/* Tombol Hapus dengan Ikon */}
                                                                <button
                                                                    onClick={() => deleteLokasi(lokasi)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                                                                    title="Hapus Lokasi"
                                                                >
                                                                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                                                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
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
                                {lokasis.data.length > 0 ? (
                                    lokasis.data.map((lokasi, index) => (
                                        <div key={lokasi.lokasi_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                                        No. {(lokasis.current_page - 1) * lokasis.per_page + index + 1}
                                                    </div>
                                                    <Link
                                                        href={route("lokasi.show", lokasi.lokasi_id)}
                                                        className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-cyan-600 dark:hover:text-cyan-400 block mb-2"
                                                    >
                                                        {lokasi.nama_lokasi}
                                                    </Link>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Jumlah Gardu Induk:</span>
                                                        <Link
                                                            href={route("gardu-induk.index", { lokasi_id: lokasi.lokasi_id })}
                                                            className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                                                                lokasi.gardu_induk_count === 0
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                                    : lokasi.gardu_induk_count < 3
                                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                                                                    : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                            }`}
                                                        >
                                                            {lokasi.gardu_induk_count ?? 0}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aksi (Mobile - Horizontal, tetap menggunakan teks) */}
                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <Link
                                                    href={route("lokasi.edit", lokasi.lokasi_id)}
                                                    className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-800"
                                                >
                                                    Edit
                                                </Link>
                                                <span className="text-gray-300 text-xs">|</span>
                                                <button
                                                    onClick={() => deleteLokasi(lokasi)}
                                                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                        <p>Tidak ada data ditemukan</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Pagination links={lokasis.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}