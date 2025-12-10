import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
// Menambahkan ikon Pencil dan Trash2
import { HardHat, Plus, Pencil, Trash2 } from "lucide-react"; 

export default function Index({ auth, apds, jenisApds, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [jenisFilter, setJenisFilter] = useState(filters.jenis_id || "");
    const { flash } = usePage().props;

    const sortChanged = (field) => {
        router.get(
            route("apd.index"),
            {
                search,
                jenis_id: jenisFilter,
                sortField: field,
                sortDirection:
                    filters.sortField === field && filters.sortDirection === "asc"
                        ? "desc"
                        : "asc",
            },
            { preserveState: true, replace: true }
        );
    };

    // Debounce search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                route("apd.index"),
                {
                    search,
                    jenis_id: jenisFilter,
                    sortField: filters.sortField,
                    sortDirection: filters.sortDirection,
                },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, jenisFilter]);

    const SortableHeader = ({ field, label }) => (
        <th
            onClick={() => sortChanged(field)}
            className="px-2 py-1.5 cursor-pointer whitespace-nowrap"
        >
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

    const deleteApd = (apd) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus APD "${apd.nama_apd}"?`)) return;
        router.delete(route("apd.destroy", apd.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    {/* 🛡️ Header kiri */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <HardHat className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Data APD
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Kelola Alat Pelindung Diri
                            </p>
                        </div>
                    </div>

                    {/* ➕ Tombol Tambah */}
                    <Link
                        href={route("apd.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah APD
                    </Link>
                </div>
            }
        >
            <Head title="Data APD" />

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
                            <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <TextInput
                                    className="w-full text-sm h-9"
                                    placeholder="Cari nama, kode, bahan, atau warna APD..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <Select
                                    className="w-full text-sm h-9"
                                    value={jenisFilter}
                                    onChange={(e) => setJenisFilter(e.target.value)}
                                    placeholder="Semua Jenis APD"
                                    options={jenisApds.map((jenis) => ({
                                        value: jenis.id,
                                        label: jenis.nama_jenis,
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
                                                <th className="px-2 py-1.5 whitespace-nowrap">Gambar</th>
                                                <SortableHeader field="nama_apd" label="Nama APD" />
                                                <SortableHeader field="kode_apd" label="Kode APD" />
                                                <th className="px-2 py-1.5 whitespace-nowrap">Jenis</th>
                                                <th className="px-2 py-1.5 whitespace-nowrap">Bahan</th>
                                                <th className="px-2 py-1.5 whitespace-nowrap">Warna</th>
                                                <th className="px-2 py-1.5 whitespace-nowrap">Ukuran</th>
                                                <th className="px-2 py-1.5 whitespace-nowrap">Standar</th>
                                                <th className="px-2 py-1.5 whitespace-nowrap">Masa Pakai</th>
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-20">Aksi</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {apds.data.length > 0 ? (
                                                apds.data.map((apd, index) => (
                                                    <tr
                                                        key={apd.id}
                                                        className="hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        <td className="px-2 py-1.5 text-center text-gray-600 dark:text-gray-400 font-medium text-sm">
                                                            {(apds.current_page - 1) * apds.per_page + index + 1}
                                                        </td>

                                                        {/* Thumbnail */}
                                                        <td className="px-2 py-1.5">
                                                            <div className="w-12 h-12 overflow-hidden rounded-md border flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                                {apd.gambar ? (
                                                                    <img
                                                                        src={apd.gambar}
                                                                        className="w-full h-full object-cover"
                                                                        alt={apd.nama_apd}
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-400 text-xs">-</span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="px-2 py-1.5 font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                                            <Link 
                                                                href={route("apd.show", apd.id)} 
                                                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                                            >
                                                                {apd.nama_apd}
                                                            </Link>
                                                        </td>

                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">{apd.kode_apd}</td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">{apd.jenis_apd || "-"}</td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">{apd.bahan || "-"}</td>
                                                        
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                                            {apd.warna ? (
                                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-medium">
                                                                    {apd.warna}
                                                                </span>
                                                            ) : "-"}
                                                        </td>

                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">{apd.ukuran || "-"}</td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">{apd.standar || "-"}</td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">{apd.masa_penggunaan || "-"}</td>

                                                        {/* AKSI - Horizontal dengan Ikon */}
                                                        <td className="px-2 py-1.5">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <Link
                                                                    href={route("apd.edit", apd.id)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                                                                    title="Edit APD"
                                                                >
                                                                    <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteApd(apd)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                                                                    title="Hapus APD"
                                                                >
                                                                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11" className="px-4 py-8 text-center text-gray-400">
                                                        <HardHat className="h-12 w-12 mx-auto mb-2 opacity-30" />
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
                                {apds.data.length > 0 ? (
                                    apds.data.map((apd, index) => (
                                        <div key={apd.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                            <div className="flex gap-3 items-start mb-2">
                                                {/* Thumbnail */}
                                                <div>
                                                    {apd.gambar ? (
                                                        <img
                                                            src={apd.gambar}
                                                            className="w-14 h-14 object-cover rounded-md"
                                                            alt={apd.nama_apd}
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-400">
                                                            -
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                                        No. {(apds.current_page - 1) * apds.per_page + index + 1}
                                                    </div>
                                                    <Link
                                                        href={route("apd.show", apd.id)}
                                                        className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-cyan-600 dark:hover:text-cyan-400 block mb-1"
                                                    >
                                                        {apd.nama_apd}
                                                    </Link>
                                                    
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                                        <div>Kode: <span className="font-medium">{apd.kode_apd}</span></div>
                                                        <div>Jenis: {apd.jenis_apd || "-"}</div>
                                                        <div>Bahan: {apd.bahan || "-"}</div>
                                                        <div>Warna: {apd.warna || "-"}</div>
                                                        <div>Ukuran: {apd.ukuran || "-"}</div>
                                                        <div>Standar: {apd.standar || "-"}</div>
                                                        <div>Masa Pakai: {apd.masa_penggunaan || "-"}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aksi (Mobile) - Tetap horizontal dengan teks */}
                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <Link
                                                    href={route("apd.edit", apd.id)}
                                                    className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-800"
                                                >
                                                    Edit
                                                </Link>
                                                <span className="text-gray-300 text-xs">|</span>
                                                <button
                                                    onClick={() => deleteApd(apd)}
                                                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <HardHat className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                        <p>Tidak ada data ditemukan</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Pagination links={apds.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}