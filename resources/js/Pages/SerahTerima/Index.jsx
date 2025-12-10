import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
// Menambahkan ikon Pencil dan Trash2
import { Package, Plus, Pencil, Trash2 } from "lucide-react"; 

export default function Index({ auth, data, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const { flash } = usePage().props;

    const sortChanged = (field) => {
        router.get(
            route("serah-terima.index"),
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

    // Debounce Search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                route("serah-terima.index"),
                {
                    search,
                    sortField: filters.sortField,
                    sortDirection: filters.sortDirection,
                },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

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
                            filters.sortField === field &&
                            filters.sortDirection === "asc"
                                ? "text-cyan-600"
                                : ""
                        }`}
                    />
                    <ChevronDownIcon
                        className={`w-3 h-3 -mt-1 ${
                            filters.sortField === field &&
                            filters.sortDirection === "desc"
                                ? "text-cyan-600"
                                : ""
                        }`}
                    />
                </div>
            </div>
        </th>
    );

    const deleteData = (item) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus transaksi "${item.no_dokumen}"?`)) return;

        router.delete(route("serah-terima.destroy", item.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    {/* Header kiri */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                Transaksi Serah Terima
                            </h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Daftar transaksi serah terima barang APD
                            </p>
                        </div>
                    </div>

                    {/* Tombol Tambah */}
                    <Link
                        href={route("serah-terima.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Transaksi
                    </Link>
                </div>
            }
        >
            <Head title="Serah Terima" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    {flash.success && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-2 px-3 text-white rounded-lg mb-2 shadow-md text-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            {/* Filter pencarian */}
                            <div className="mb-2">
                                <TextInput
                                    className="w-full md:w-80 text-sm h-9"
                                    placeholder="Cari no seri, no dokumen, penerima, atau pengirim..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* TABEL DESKTOP */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                        <thead className="text-[11px] font-semibold uppercase bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-b-2 border-cyan-200 dark:border-gray-600">
                                            <tr>
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-10">No</th>
                                                <SortableHeader field="no_seri" label="No Seri" />
                                                <SortableHeader field="no_dokumen" label="No Dokumen" />
                                                <SortableHeader field="tanggal" label="Tanggal" />
                                                <SortableHeader field="nama_penerima" label="Penerima" />
                                                <SortableHeader field="nama_pengirim" label="Pengirim" />
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap">Total Item</th>
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-20">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {data.data.length > 0 ? (
                                                data.data.map((row, index) => (
                                                    <tr key={row.id} className="hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-2 py-1.5 text-center text-gray-600 dark:text-gray-400 font-medium text-sm">
                                                            {(data.current_page - 1) * data.per_page + index + 1}
                                                        </td>
                                                        <td className="px-2 py-1.5 font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                                            <Link
                                                                href={route("serah-terima.show", row.id)}
                                                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                                            >
                                                                {row.no_seri}
                                                            </Link>
                                                        </td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                                            {row.no_dokumen}
                                                        </td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                                            {row.tanggal}
                                                        </td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                                            {row.nama_penerima}
                                                        </td>
                                                        <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                                            {row.nama_pengirim}
                                                        </td>
                                                        <td className="px-2 py-1.5 text-center text-gray-800 dark:text-gray-100 font-semibold text-sm">
                                                            {row.total_item}
                                                        </td>

                                                        {/* AKSI - HORIZONTAL DENGAN IKON */}
                                                        <td className="px-2 py-1.5">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <Link
                                                                    href={route("serah-terima.edit", row.id)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                                                                    title="Edit Transaksi"
                                                                >
                                                                    <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteData(row)}
                                                                    className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                                                                    title="Hapus Transaksi"
                                                                >
                                                                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                                                        <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                                        <p>Tidak ada data ditemukan</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* TABEL MOBILE */}
                            <div className="md:hidden space-y-2">
                                {data.data.length > 0 ? (
                                    data.data.map((row, index) => (
                                        <div key={row.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                                        No. {(data.current_page - 1) * data.per_page + index + 1}
                                                    </div>
                                                    <Link
                                                        href={route("serah-terima.show", row.id)}
                                                        className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-cyan-600 dark:hover:text-cyan-400 block mb-1"
                                                    >
                                                        {row.no_seri}
                                                    </Link>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                        <div>No Dokumen: {row.no_dokumen}</div>
                                                        <div>Tanggal: {row.tanggal}</div>
                                                        <div>Penerima: {row.nama_penerima}</div>
                                                        <div>Pengirim: {row.nama_pengirim}</div>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">Total Item:</span>
                                                            <span className="font-bold text-gray-800 dark:text-gray-100">{row.total_item}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aksi (Mobile) */}
                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <Link
                                                    href={route("serah-terima.edit", row.id)}
                                                    className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-800"
                                                >
                                                    Edit
                                                </Link>
                                                <span className="text-gray-300 text-xs">|</span>
                                                <button
                                                    onClick={() => deleteData(row)}
                                                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                        <p>Tidak ada data ditemukan</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Pagination links={data.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}