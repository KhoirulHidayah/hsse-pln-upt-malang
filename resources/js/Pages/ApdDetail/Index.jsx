import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { ClipboardList } from "lucide-react";

export default function Index({ auth, details, apds, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [apdFilter, setApdFilter] = useState(filters.apd_id || "");
    const { flash } = usePage().props;

    // 🔁 SORTING
    const sortChanged = (field) => {
        router.get(
            route("detail.index"),
            {
                search,
                apd_id: apdFilter,
                sortField: field,
                sortDirection:
                    filters.sortField === field && filters.sortDirection === "asc"
                        ? "desc"
                        : "asc",
            },
            { preserveState: true, replace: true }
        );
    };

    // 🔍 Pencarian otomatis
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                route("detail.index"),
                { search, apd_id: apdFilter, sortField: filters.sortField, sortDirection: filters.sortDirection },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, apdFilter]);

    // 🔽 Header sortable
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

    // 🗑️ Hapus data
    const deleteDetail = (detail) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus Detail "${detail.nama_detail}"?`)) return;
        router.delete(route("detail.destroy", detail.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-gray-700">
                            <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Detail APD
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Daftar spesifikasi & komponen APD.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route("detail.create")}
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tambah Detail
                    </Link>
                </div>
            }
        >
            <Head title="Detail APD" />

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
                                    placeholder="Cari nama atau kode detail..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Select
                                    className="w-full"
                                    value={apdFilter}
                                    onChange={(e) => setApdFilter(e.target.value)}
                                    placeholder="Semua APD"
                                    options={apds.map((a) => ({
                                        value: a.id,
                                        label: a.nama_apd,
                                    }))}
                                />
                            </div>

                            {/* ========= TABEL DESKTOP (BARU, seperti Monitoring APD) ========= */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-500 dark:text-gray-300">
                                            <tr>
                                                <th className="px-3 py-2 sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">No</th>
                                                <th className="px-3 py-2">Gambar</th>
                                                <SortableHeader field="nama_detail" label="Nama Detail" />
                                                <SortableHeader field="kode_detail" label="Kode Detail" />
                                                <th className="px-3 py-2 whitespace-nowrap">APD</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Bahan</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Warna</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Ukuran</th>
                                                <th className="px-3 py-2 whitespace-nowrap">Masa Penggunaan</th>
                                                <SortableHeader field="created_at" label="Tanggal Buat" />
                                                <th className="px-3 py-2 text-right sticky right-0 bg-gray-50 dark:bg-gray-700 z-10">Aksi</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {details.data.length > 0 ? (
                                                details.data.map((detail, index) => (
                                                    <tr
                                                        key={detail.id}
                                                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/40"
                                                    >
                                                        <td className="px-3 py-2 sticky left-0 bg-white dark:bg-gray-800">
                                                            {(details.current_page - 1) * details.per_page + index + 1}
                                                        </td>

                                                        {/* GAMBAR */}
                                                        <td className="px-3 py-2">
                                                            <div className="w-16 h-16 overflow-hidden rounded-md border flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                                {detail.image_path ? (
                                                                    <img
                                                                        src={detail.image_path}
                                                                        alt={detail.nama_detail}
                                                                        className="object-contain w-full h-full"
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">-</span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* NAMA DETAIL */}
                                                        <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-100 min-w-[180px]">
                                                            <Link
                                                                href={route("detail.show", detail.id)}
                                                                className="hover:underline"
                                                            >
                                                                {detail.nama_detail}
                                                            </Link>
                                                        </td>

                                                        {/* KODE */}
                                                        <td className="px-3 py-2">{detail.kode_detail || "-"}</td>

                                                        {/* APD */}
                                                        <td className="px-3 py-2">{detail.apd_nama || "-"}</td>

                                                        {/* BAHAN */}
                                                        <td className="px-3 py-2">{detail.bahan || "-"}</td>

                                                        {/* WARNA */}
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-medium">
                                                                {detail.warna || "-"}
                                                            </span>
                                                        </td>

                                                        {/* UKURAN */}
                                                        <td className="px-3 py-2">
                                                            {detail.ukuran || "-"}
                                                        </td>

                                                        {/* MASA PENGGUNAAN */}
                                                        <td className="px-3 py-2">{detail.masa_penggunaan || "-"}</td>

                                                        {/* CREATED AT */}
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            {detail.created_at}
                                                        </td>

                                                        {/* AKSI */}
                                                        <td className="px-3 py-2 text-right sticky right-0 bg-white dark:bg-gray-800">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={route("detail.edit", detail.id)}
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteDetail(detail)}
                                                                    className="text-red-600 hover:underline"
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

                            {/* ========= MOBILE VIEW ========= */}
                            <div className="md:hidden">
                                {details.data.length > 0 ? (
                                    details.data.map((detail) => (
                                        <div key={detail.id} className="border-b py-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                                                        {detail.nama_detail}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        Kode: {detail.kode_detail || "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-2 text-xs text-gray-500">
                                                <div>APD: {detail.apd_nama || "-"}</div>
                                                <div>Bahan: {detail.bahan || "-"}</div>
                                                <div>Warna: {detail.warna || "-"}</div>
                                            </div>

                                            <div className="mt-2 flex gap-4 text-xs">
                                                <Link
                                                    href={route("detail.edit", detail.id)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteDetail(detail)}
                                                    className="text-red-600 hover:underline"
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

                            <Pagination links={details.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
