import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { MapPin } from "lucide-react"; // 📍 Ikon lokasi

export default function Index({ auth, lokasis, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const { flash } = usePage().props;

    // 🔁 Sorting kolom
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

    // 🔽 Komponen Header yang bisa di-sort
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

    // 🗑️ Hapus data lokasi
    const deleteLokasi = (lokasi) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus lokasi "${lokasi.nama_lokasi}"?`)) return;
        router.delete(route("lokasi.destroy", lokasi.lokasi_id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-start justify-between">
                    {/* 📍 Header kiri */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-gray-700">
                            <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Data Lokasi
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Daftar lokasi gardu induk beserta jumlah gardu induk yang terdaftar di setiap lokasi.
                            </p>
                        </div>
                    </div>

                    {/* ➕ Tombol Tambah */}
                    <Link
                        href={route("lokasi.create")}
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Tambah Lokasi
                    </Link>
                </div>
            }
        >
            <Head title="Data Lokasi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* 🔎 Filter pencarian */}
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <TextInput
                                    className="w-full md:w-1/2"
                                    placeholder="Cari nama lokasi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* 📋 TABEL DESKTOP */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                            <tr>
                                                <th className="px-3 py-2 whitespace-nowrap">No</th>
                                                <SortableHeader field="nama_lokasi" label="Nama Lokasi" />
                                                <SortableHeader field="gardu_induk_count" label="Jumlah Gardu Induk" />
                                                {/* Kolom Tanggal Buat dan Tanggal Update dihapus */}
                                                <th className="px-3 py-2 text-right whitespace-nowrap">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lokasis.data.length > 0 ? (
                                                lokasis.data.map((lokasi, index) => (
                                                    <tr key={lokasi.lokasi_id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            {(lokasis.current_page - 1) * lokasis.per_page + index + 1}
                                                        </td>
                                                        <th className="px-3 py-2 text-gray-800 dark:text-gray-100 min-w-[200px] max-w-[250px]">
                                                            <Link href={route("lokasi.show", lokasi.lokasi_id)} className="hover:underline">
                                                                {lokasi.nama_lokasi}
                                                            </Link>
                                                        </th>

                                                        {/* Jumlah Gardu Induk */}
                                                        <td className="px-3 py-2 text-center whitespace-nowrap">
                                                            <Link
                                                                href={route("gardu-induk.index", { lokasi_id: lokasi.lokasi_id })}
                                                                className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold transition duration-150 hover:scale-105 ${
                                                                    lokasi.gardu_induk_count === 0
                                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200/80"
                                                                        : lokasi.gardu_induk_count < 3
                                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-200/80"
                                                                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200/80"
                                                                }`}
                                                            >
                                                                {lokasi.gardu_induk_count ?? 0}
                                                            </Link>
                                                        </td>

                                                        {/* Kolom Tanggal Buat dan Tanggal Update Dihapus dari sini */}
                                                        
                                                        {/* AKSI - DIBUAT VERTIKAL DAN RINGKAS */}
                                                        <td className="px-3 py-2 text-right whitespace-nowrap">
                                                            <div className="flex flex-col items-end gap-1">
                                                                <Link
                                                                    href={route("lokasi.edit", lokasi.lokasi_id)}
                                                                    className="text-xs text-blue-600 dark:text-blue-500 hover:underline"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteLokasi(lokasi)}
                                                                    className="text-xs text-red-600 dark:text-red-500 hover:underline"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    {/* colSpan disesuaikan dari 6 menjadi 4 (No, Nama Lokasi, Jumlah GI, Aksi) */}
                                                    <td colSpan="4" className="px-3 py-4 text-center text-gray-400">
                                                        Tidak ada data lokasi ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 📱 TABEL MOBILE */}
                            <div className="md:hidden">
                                {lokasis.data.length > 0 ? (
                                    lokasis.data.map((lokasi, index) => (
                                        <div key={lokasi.lokasi_id} className="border-b py-3 flex justify-between items-start">
                                            {/* Data Kiri */}
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                                     No. {(lokasis.current_page - 1) * lokasis.per_page + index + 1}
                                                </div>
                                                <Link
                                                    href={route("lokasi.show", lokasi.lokasi_id)}
                                                    className="font-semibold text-gray-800 dark:text-gray-100 hover:underline block mb-1 truncate"
                                                >
                                                    {lokasi.nama_lokasi}
                                                </Link>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Jumlah Gardu Induk:</span>
                                                        <Link
                                                            href={route("gardu-induk.index", { lokasi_id: lokasi.lokasi_id })}
                                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                                lokasi.gardu_induk_count === 0
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                                    : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                            }`}
                                                        >
                                                            {lokasi.gardu_induk_count ?? 0}
                                                        </Link>
                                                    </div>
                                                    {/* Info Tanggal Buat/Update dihapus dari sini */}
                                                </div>
                                            </div>

                                            {/* Aksi Kanan (Vertikal) */}
                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                <Link
                                                    href={route("lokasi.edit", lokasi.lokasi_id)}
                                                    className="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteLokasi(lokasi)}
                                                    className="text-xs font-medium text-red-600 dark:text-red-500 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-gray-400">Tidak ada data lokasi ditemukan.</p>
                                )}
                            </div>

                            <Pagination links={lokasis.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}