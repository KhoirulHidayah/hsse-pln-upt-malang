import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Package } from "lucide-react";

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
            className="px-3 py-2 cursor-pointer whitespace-nowrap"
        >
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon
                        className={`w-3 h-3 ${
                            filters.sortField === field &&
                            filters.sortDirection === "asc"
                                ? "text-blue-500"
                                : ""
                        }`}
                    />
                    <ChevronDownIcon
                        className={`w-3 h-3 -mt-1 ${
                            filters.sortField === field &&
                            filters.sortDirection === "desc"
                                ? "text-blue-500"
                                : ""
                        }`}
                    />
                </div>
            </div>
        </th>
    );

    const deleteData = (item) => {
        if (!window.confirm(`Hapus transaksi ${item.no_dokumen}?`)) return;

        router.delete(route("serah-terima.destroy", item.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                            <Package className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Transaksi Serah Terima
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Daftar transaksi serah terima barang APD.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route("serah-terima.create")}
                        className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v12m6-6H6"
                            />
                        </svg>
                        Tambah Transaksi
                    </Link>
                </div>
            }
        >
            <Head title="Serah Terima" />

            <div className="py-12">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">

                    {flash.success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 overflow-hidden">
                        <div className="p-6">

                            {/* FILTER */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <TextInput
                                    className="w-full"
                                    placeholder="Cari no seri, no dokumen, nama penerima, atau pengirim..." // Kueri diperluas
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* DESKTOP TABLE */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
                                            <tr>
                                                <th className="px-3 py-2">No</th>
                                                <SortableHeader field="no_seri" label="No Seri" /> {/* Kolom baru */}
                                                <SortableHeader field="no_dokumen" label="No Dokumen" />
                                                <SortableHeader field="tanggal" label="Tanggal Transaksi" />
                                                <SortableHeader field="nama_penerima" label="Penerima" />
                                                <SortableHeader field="nama_pengirim" label="Pengirim" />
                                                <th className="px-3 py-2">Total Item</th>
                                                <th className="px-3 py-2 text-right">Aksi</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {data.data.length ? (
                                                data.data.map((row, index) => (
                                                    <tr key={row.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                        <td className="px-3 py-2">
                                                            {(data.current_page - 1) * data.per_page + index + 1}
                                                        </td>
                                                        <td className="px-3 py-2 font-medium">
                                                            <Link
                                                                href={route("serah-terima.show", row.id)}
                                                                className="hover:underline"
                                                            >
                                                                {row.no_seri} {/* Menampilkan No Seri */}
                                                            </Link>
                                                        </td>
                                                        <td className="px-3 py-2">{row.no_dokumen}</td> {/* Menampilkan No Dokumen */}
                                                        <td className="px-3 py-2">{row.tanggal}</td>
                                                        <td className="px-3 py-2">{row.nama_penerima}</td>
                                                        <td className="px-3 py-2">{row.nama_pengirim}</td>
                                                        <td className="px-3 py-2">{row.total_item}</td>

                                                        <td className="px-3 py-2 text-right">
                                                            <div className="flex flex-col items-end">
                                                                <Link
                                                                    href={route("serah-terima.edit", row.id)}
                                                                    className="text-blue-600 text-xs hover:underline"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteData(row)}
                                                                    className="text-red-600 text-xs hover:underline"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="8" // colspan ditingkatkan menjadi 8
                                                        className="py-4 text-center text-gray-500"
                                                    >
                                                        Tidak ada data ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* MOBILE LIST */}
                            <div className="md:hidden">
                                {data.data.length ? (
                                    data.data.map((row) => (
                                        <div key={row.id} className="border-b py-3">
                                            <Link
                                                href={route("serah-terima.show", row.id)}
                                                className="font-semibold text-gray-800 dark:text-gray-200"
                                            >
                                                {row.no_seri} {/* Menampilkan No Seri */}
                                            </Link>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                No Dokumen: {row.no_dokumen}
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                <div>Tanggal: {row.tanggal}</div>
                                                <div>Penerima: {row.nama_penerima}</div>
                                                <div>Pengirim: {row.nama_pengirim}</div>
                                                <div>Total Item: {row.total_item}</div>
                                            </div>

                                            <div className="flex gap-3 mt-2 text-xs">
                                                <Link
                                                    href={route("serah-terima.edit", row.id)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteData(row)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Tidak ada data ditemukan.</p>
                                )}
                            </div>

                            <Pagination links={data.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}