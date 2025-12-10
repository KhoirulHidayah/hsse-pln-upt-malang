import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Shield, Plus, Pencil, Trash2, HardHat } from "lucide-react";

export default function Index({ auth, jenisApds, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const { flash } = usePage().props;

    // 🔀 Sorting kolom
    const sortChanged = (field) => {
        router.get(
            route("jenis-apd.index"),
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
                route("jenis-apd.index"),
                { search, sortField: filters.sortField, sortDirection: filters.sortDirection },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    // 📽 Komponen header sortable
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

    // 🗑️ Hapus data jenis APD
    const deleteJenisApd = (jenis) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus Jenis APD "${jenis.nama_jenis}"?`)) return;
        router.delete(route("jenis-apd.destroy", jenis.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    {/* 🛡️ Header kiri */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Data Jenis APD
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Kelola kategori Alat Pelindung Diri
                            </p>
                        </div>
                    </div>

                    {/* ➕ Tombol Tambah */}
                    <Link
                        href={route("jenis-apd.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Jenis
                    </Link>
                </div>
            }
        >
            <Head title="Data Jenis APD" />

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
                                    placeholder="Cari nama jenis APD..."
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
                                                <SortableHeader field="nama_jenis" label="Nama Jenis APD" />
                                                <th className="px-2 py-1.5 whitespace-nowrap">Deskripsi</th>
                                                <SortableHeader field="apds_count" label="Jumlah APD" className="w-32 text-center" />
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-20">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {jenisApds.data.length > 0 ? (
                                                jenisApds.data.map((jenis, index) => (
                                                    <tr key={jenis.id} className="hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-2 py-1.5 text-center text-gray-600 dark:text-gray-400 font-medium text-sm">
                                                            {(jenisApds.current_page - 1) * jenisApds.per_page + index + 1}
                                                        </td>
                                                        <td className="px-2 py-1.5 font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                                            <Link 
                                                                href={route("jenis-apd.show", jenis.id)} 
                                                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                                            >
                                                                {jenis.nama_jenis}
                                                            </Link>
                                                        </td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 max-w-md leading-relaxed text-sm">
                                                            <div className="line-clamp-2">
                                                                {jenis.deskripsi || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
                                                            </div>
                                                        </td>

                                                        {/* Jumlah APD - DENGAN IKON */}
                                                        <td className="px-2 py-1.5 text-center">
                                                            <Link
                                                                href={route("apd.index", { jenis_id: jenis.id })}
                                                                className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-sm ${
                                                                    jenis.apds_count === 0
                                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200"
                                                                        : jenis.apds_count < 5
                                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-200"
                                                                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200"
                                                                }`}
                                                            >
                                                                <HardHat className="h-3 w-3" />
                                                                {jenis.apds_count ?? 0}
                                                            </Link>
                                                        </td>

                                                        {/* AKSI - HORIZONTAL */}
                                                        <td className="px-2 py-1.5 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <Link
                                                                    href={route("jenis-apd.edit", jenis.id)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                                                                    title="Edit Jenis APD"
                                                                >
                                                                    <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteJenisApd(jenis)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                                                                    title="Hapus Jenis APD"
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
                                                        <Shield className="h-12 w-12 mx-auto mb-2 opacity-30" />
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
                                {jenisApds.data.length > 0 ? (
                                    jenisApds.data.map((jenis, index) => (
                                        <div key={jenis.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                                        No. {(jenisApds.current_page - 1) * jenisApds.per_page + index + 1}
                                                    </div>
                                                    <Link
                                                        href={route("jenis-apd.show", jenis.id)}
                                                        className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-cyan-600 dark:hover:text-cyan-400 block mb-1"
                                                    >
                                                        {jenis.nama_jenis}
                                                    </Link>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                                        {jenis.deskripsi || "Tidak ada deskripsi."}
                                                    </p>
                                                    
                                                    {/* Info Jumlah APD */}
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Jumlah APD:</span>
                                                        <Link
                                                            href={route("apd.index", { jenis_id: jenis.id })}
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
                                                                jenis.apds_count === 0
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                                    : jenis.apds_count < 5
                                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                                                                    : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                            }`}
                                                        >
                                                            <HardHat className="h-3 w-3" />
                                                            {jenis.apds_count ?? 0}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aksi Mobile */}
                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <Link
                                                    href={route("jenis-apd.edit", jenis.id)}
                                                    className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-800"
                                                >
                                                    Edit
                                                </Link>
                                                <span className="text-gray-300 text-xs">|</span>
                                                <button
                                                    onClick={() => deleteJenisApd(jenis)}
                                                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <Shield className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                        <p>Tidak ada data ditemukan</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Pagination links={jenisApds.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}