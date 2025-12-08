import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Shield } from "lucide-react"; // 🛡️ Ikon untuk Jenis APD

export default function Index({ auth, jenisApds, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const { flash } = usePage().props;

    // 🔁 Sorting kolom
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

    // 🔽 Komponen header sortable
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

    // 🗑️ Hapus data jenis APD
    const deleteJenisApd = (jenis) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus Jenis APD "${jenis.nama_jenis}"?`)) return;
        router.delete(route("jenis-apd.destroy", jenis.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-start justify-between">
                    {/* 🛡️ Header kiri */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-gray-700">
                            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Data Jenis APD
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Daftar kategori atau jenis Alat Pelindung Diri (APD) beserta jumlah APD yang dimiliki.
                            </p>
                        </div>
                    </div>

                    {/* ➕ Tombol Tambah */}
                    <Link
                        href={route("jenis-apd.create")}
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
                        Tambah Jenis
                    </Link>
                </div>
            }
        >
            <Head title="Data Jenis APD" />

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
                                    placeholder="Cari nama jenis APD..."
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
                                                <SortableHeader field="nama_jenis" label="Nama Jenis APD" />
                                                <th className="px-3 py-2 whitespace-nowrap">Deskripsi</th>
                                                <SortableHeader field="apds_count" label="Jumlah APD" />
                                                <th className="px-3 py-2 text-right whitespace-nowrap">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jenisApds.data.length > 0 ? (
                                                jenisApds.data.map((jenis, index) => (
                                                    <tr key={jenis.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            {(jenisApds.current_page - 1) * jenisApds.per_page + index + 1}
                                                        </td>
                                                        <th className="px-3 py-2 text-gray-800 dark:text-gray-100 min-w-[200px] max-w-[250px]">
                                                            <Link href={route("jenis-apd.show", jenis.id)} className="hover:underline">
                                                                {jenis.nama_jenis}
                                                            </Link>
                                                        </th>
                                                        <td className="px-3 py-2 max-w-sm">{jenis.deskripsi || "-"}</td>

                                                        {/* Jumlah APD */}
                                                        <td className="px-3 py-2 text-center whitespace-nowrap">
                                                            <Link
                                                                href={route("apd.index", { jenis_id: jenis.id })}
                                                                className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold transition duration-150 hover:scale-105 ${
                                                                    jenis.apds_count === 0
                                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200/80"
                                                                        : jenis.apds_count < 5
                                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-200/80"
                                                                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200/80"
                                                                }`}
                                                            >
                                                                {jenis.apds_count ?? 0}
                                                            </Link>
                                                        </td>

                                                        {/* AKSI - DIBUAT VERTIKAL DAN RINGKAS */}
                                                        <td className="px-3 py-2 text-right whitespace-nowrap">
                                                            <div className="flex flex-col items-end gap-1">
                                                                <Link
                                                                    href={route("jenis-apd.edit", jenis.id)}
                                                                    className="text-xs text-blue-600 dark:text-blue-500 hover:underline"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteJenisApd(jenis)}
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
                                                    <td colSpan="7" className="px-3 py-4 text-center text-gray-400">
                                                        Tidak ada data ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 📱 TABEL MOBILE */}
                            <div className="md:hidden">
                                {jenisApds.data.length > 0 ? (
                                    jenisApds.data.map((jenis, index) => (
                                        <div key={jenis.id} className="border-b py-3 flex justify-between items-start">
                                            {/* Data Kiri */}
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                                     No. {(jenisApds.current_page - 1) * jenisApds.per_page + index + 1}
                                                </div>
                                                <Link
                                                    href={route("jenis-apd.show", jenis.id)}
                                                    className="font-semibold text-gray-800 dark:text-gray-100 hover:underline block mb-1 truncate"
                                                >
                                                    {jenis.nama_jenis}
                                                </Link>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                                                    <p className="line-clamp-2">{jenis.deskripsi || "Tidak ada deskripsi."}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Jumlah APD:</span>
                                                        <Link
                                                            href={route("apd.index", { jenis_id: jenis.id })}
                                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                                jenis.apds_count === 0
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                                    : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                            }`}
                                                        >
                                                            {jenis.apds_count ?? 0}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aksi Kanan (Vertikal) */}
                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                <Link
                                                    href={route("jenis-apd.edit", jenis.id)}
                                                    className="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteJenisApd(jenis)}
                                                    className="text-xs font-medium text-red-600 dark:text-red-500 hover:underline"
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

                            <Pagination links={jenisApds.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}