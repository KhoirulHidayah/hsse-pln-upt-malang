import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { MapPinned } from "lucide-react"; 

export default function Index({ auth, garduInduks, lokasis, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [lokasiFilter, setLokasiFilter] = useState(filters.lokasi_id || "");
    const { flash } = usePage().props;

    // 🔁 Fungsi sorting kolom
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

    // 🔽 Header kolom sortable
    const SortableHeader = ({ field, label }) => (
        <th onClick={() => sortChanged(field)} className="px-3 py-2 cursor-pointer">
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

    // 🗑️ Hapus data Gardu Induk
    const deleteGarduInduk = (gardu) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus Gardu Induk "${gardu.nama_gardu_induk}"?`)) return;
        router.delete(route("gardu-induk.destroy", gardu.gardu_induk_id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-start justify-between">
                    {/* Header kiri */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-gray-700">
                            <MapPinned className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Data Gardu Induk
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Daftar Gardu Induk beserta lokasi tempatnya.
                            </p>
                        </div>
                    </div>

                    {/* ➕ Tombol Tambah */}
                    <Link
                        href={route("gardu-induk.create")}
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tambah Gardu Induk
                    </Link>
                </div>
            }
        >
            <Head title="Data Gardu Induk" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">{flash.success}</div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* 🔎 Filter */}
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <TextInput
                                    className="w-full md:w-1/2"
                                    placeholder="Cari nama gardu induk..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Select
                                    className="w-full md:w-1/2"
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
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr>
                                            <th className="px-3 py-2">No</th>
                                            <SortableHeader field="nama_gardu_induk" label="Nama Gardu Induk" />
                                            <th className="px-3 py-2">Lokasi</th>
                                            <SortableHeader field="created_at" label="Tanggal Buat" />
                                            <SortableHeader field="updated_at" label="Tanggal Update" />
                                            <th className="px-3 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {garduInduks.data.length > 0 ? (
                                            garduInduks.data.map((gardu, index) => (
                                                <tr key={gardu.gardu_induk_id} className="border-b">
                                                    <td className="px-3 py-2">
                                                        {(garduInduks.current_page - 1) * garduInduks.per_page + index + 1}
                                                    </td>
                                                    <th className="px-3 py-2 text-gray-800 dark:text-gray-100 hover:underline">
                                                        <Link href={route("gardu-induk.show", gardu.gardu_induk_id)}>
                                                            {gardu.nama_gardu_induk}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2">{gardu.lokasi_nama || "-"}</td>
                                                    <td className="px-3 py-2">{gardu.created_at}</td>
                                                    <td className="px-3 py-2">{gardu.updated_at}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <Link
                                                            href={route("gardu-induk.edit", gardu.gardu_induk_id)}
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteGarduInduk(gardu)}
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-3 py-4 text-center text-gray-400">
                                                    Tidak ada data ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 📱 TABEL MOBILE */}
                            <div className="md:hidden">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr>
                                            <th className="px-2 py-2">No</th>
                                            <th className="px-2 py-2">Gardu Induk</th>
                                            <th className="px-2 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {garduInduks.data.length > 0 ? (
                                            garduInduks.data.map((gardu, index) => (
                                                <tr key={gardu.gardu_induk_id} className="border-b">
                                                    <td className="px-2 py-3">
                                                        {(garduInduks.current_page - 1) * garduInduks.per_page + index + 1}
                                                    </td>
                                                    <td className="px-2 py-3">
                                                        <Link
                                                            href={route("gardu-induk.show", gardu.gardu_induk_id)}
                                                            className="font-semibold text-gray-800 dark:text-gray-100 hover:underline block mb-1"
                                                        >
                                                            {gardu.nama_gardu_induk}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Lokasi: {gardu.lokasi_nama || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 text-right">
                                                        <div className="flex flex-col gap-1">
                                                            <Link
                                                                href={route("gardu-induk.edit", gardu.gardu_induk_id)}
                                                                className="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => deleteGarduInduk(gardu)}
                                                                className="text-xs font-medium text-red-600 dark:text-red-500 hover:underline"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-2 py-4 text-center text-gray-400">
                                                    Tidak ada data ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={garduInduks.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
