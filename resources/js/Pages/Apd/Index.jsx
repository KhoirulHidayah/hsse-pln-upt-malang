import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { HardHat } from "lucide-react";

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
            className="px-3 py-2 cursor-pointer whitespace-nowrap"
        >
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

    const deleteApd = (apd) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus APD "${apd.nama_apd}"?`)) return;
        router.delete(route("apd.destroy", apd.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-gray-700">
                            <HardHat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Data APD
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Daftar APD beserta spesifikasi lengkap, standar, dan masa penggunaan.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route("apd.create")}
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                        </svg>
                        Tambah APD
                    </Link>
                </div>
            }
        >
            <Head title="Data APD" />

            <div className="py-12">
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">

                    {flash.success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {/* FILTER */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <TextInput
                                    className="w-full"
                                    placeholder="Cari nama, kode, bahan, atau warna APD..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <Select
                                    className="w-full"
                                    value={jenisFilter}
                                    onChange={(e) => setJenisFilter(e.target.value)}
                                    placeholder="Semua Jenis APD"
                                    options={jenisApds.map((jenis) => ({
                                        value: jenis.id,
                                        label: jenis.nama_jenis,
                                    }))}
                                />
                            </div>

                            {/* TABEL DESKTOP */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-500 dark:text-gray-300">
                                            <tr>
                                                <th className="px-3 py-2 sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">No</th>
                                                <th className="px-3 py-2">Gambar</th>
                                                <SortableHeader field="nama_apd" label="Nama APD" />
                                                <SortableHeader field="kode_apd" label="Kode APD" />
                                                <th className="px-3 py-2 whitespace-nowrap">Jenis</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Bahan</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Warna</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Ukuran</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Standar</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Masa Pakai</th>
                                                <th className="px-3 py-2 text-right sticky right-0 bg-gray-50 dark:bg-gray-700 z-10">Aksi</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {apds.data.length > 0 ? (
                                                apds.data.map((apd, index) => (
                                                    <tr
                                                        key={apd.id}
                                                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/40"
                                                    >
                                                        <td className="px-3 py-2 sticky left-0 bg-white dark:bg-gray-800">
                                                            {(apds.current_page - 1) * apds.per_page + index + 1}
                                                        </td>

                                                        {/* Thumbnail */}
                                                        <td className="px-3 py-2">
                                                            <div className="w-14 h-14 overflow-hidden rounded-md border flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                                {apd.gambar ? (
                                                                    <img
                                                                        src={apd.gambar}
                                                                        className="w-full h-full object-cover"
                                                                        alt={apd.nama_apd}
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">-</span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-100">
                                                            <Link href={route("apd.show", apd.id)} className="hover:underline">
                                                                {apd.nama_apd}
                                                            </Link>
                                                        </td>

                                                        <td className="px-3 py-2">{apd.kode_apd}</td>
                                                        <td className="px-3 py-2">{apd.jenis_apd || "-"}</td>
                                                        <td className="px-3 py-2">{apd.bahan || "-"}</td>
                                                        
                                                        <td className="px-3 py-2">
                                                            {apd.warna ? (
                                                                <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-medium">
                                                                    {apd.warna}
                                                                </span>
                                                            ) : "-"}
                                                        </td>

                                                        <td className="px-3 py-2">{apd.ukuran || "-"}</td>
                                                        <td className="px-3 py-2">{apd.standar || "-"}</td>
                                                        <td className="px-3 py-2">{apd.masa_penggunaan || "-"}</td>

                                                        <td className="px-3 py-2 text-right sticky right-0 bg-white dark:bg-gray-800">
                                                            <div className="flex flex-col items-end gap-1">
                                                                <Link
                                                                    href={route("apd.edit", apd.id)}
                                                                    className="text-blue-600 hover:underline text-xs"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteApd(apd)}
                                                                    className="text-red-600 hover:underline text-xs"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11" className="py-4 text-center text-gray-400">
                                                        Tidak ada data ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* TABEL MOBILE */}
                            <div className="md:hidden">
                                {apds.data.length > 0 ? (
                                    apds.data.map((apd) => (
                                        <div key={apd.id} className="border-b py-3">
                                            <div className="flex gap-3 items-start">

                                                {/* Thumbnail */}
                                                <div>
                                                    {apd.gambar ? (
                                                        <img
                                                            src={apd.gambar}
                                                            className="w-14 h-14 object-cover rounded"
                                                            alt={apd.nama_apd}
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-700">
                                                            -
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <Link
                                                        href={route("apd.show", apd.id)}
                                                        className="font-semibold text-gray-800 dark:text-gray-100 hover:underline block"
                                                    >
                                                        {apd.nama_apd}
                                                    </Link>

                                                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                        <div>Kode: {apd.kode_apd}</div>
                                                        <div>Jenis: {apd.jenis_apd || "-"}</div>
                                                        <div>Bahan: {apd.bahan || "-"}</div>
                                                        <div>Warna: {apd.warna || "-"}</div>
                                                        <div>Ukuran: {apd.ukuran || "-"}</div>
                                                        <div>Standar: {apd.standar || "-"}</div>
                                                        <div>Masa Pakai: {apd.masa_penggunaan || "-"}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-1">
                                                    <Link
                                                        href={route("apd.edit", apd.id)}
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteApd(apd)}
                                                        className="text-xs text-red-600 hover:underline"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 py-4">Tidak ada data ditemukan.</p>
                                )}
                            </div>

                            <Pagination links={apds.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}