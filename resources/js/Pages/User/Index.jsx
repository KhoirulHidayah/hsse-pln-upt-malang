import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Users, Plus, Pencil, Trash2, Eye, ShieldCheck, UserCheck } from "lucide-react";

export default function Index({ auth, users, garduList, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "");
    const [garduFilter, setGarduFilter] = useState(filters.gardu_induk_id || "");
    const { flash } = usePage().props;
    const isFirstRender = useRef(true);

    const activeSortField = filters.sortField || "created_at";
    const activeSortDirection = filters.sortDirection || "desc";

    const reloadData = (extra = {}) => {
        router.get(
            route("user.index"),
            {
                search,
                role: roleFilter,
                gardu_induk_id: garduFilter,
                sortField: activeSortField,
                sortDirection: activeSortDirection,
                ...extra,
            },
            { preserveState: true, replace: true }
        );
    };

    const sortChanged = (field) => {
        reloadData({
            sortField: field,
            sortDirection:
                activeSortField === field && activeSortDirection === "asc"
                    ? "desc"
                    : "asc",
        });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounce = setTimeout(() => {
            reloadData();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, roleFilter, garduFilter]);

    const SortableHeader = ({ field, label, className }) => (
        <th onClick={() => sortChanged(field)} className={`px-2 py-1.5 cursor-pointer whitespace-nowrap ${className ?? ""}`}>
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon className={`w-3 h-3 ${activeSortField === field && activeSortDirection === "asc" ? "text-cyan-600" : ""}`} />
                    <ChevronDownIcon className={`w-3 h-3 -mt-1 ${activeSortField === field && activeSortDirection === "desc" ? "text-cyan-600" : ""}`} />
                </div>
            </div>
        </th>
    );

    const deleteUser = (item) => {
        if (!window.confirm(`Apakah kamu yakin ingin menghapus user "${item.name}"?`)) return;
        router.delete(route("user.destroy", item.id), { preserveScroll: true });
    };

    const roleBadge = (role) => {
        if (role === "admin") {
            return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
        }
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Data User</h2>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Kelola akun admin dan pemeriksa</p>
                        </div>
                    </div>

                    <Link
                        href={route("user.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah User
                    </Link>
                </div>
            }
        >
            <Head title="Data User" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    {flash.success && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 py-2 px-3 text-white rounded-lg mb-2 shadow-md text-sm">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="bg-red-500 py-2 px-3 text-white rounded-lg mb-2 shadow-md text-sm">
                            {flash.error}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <div className="mb-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                                <TextInput
                                    className="w-full md:col-span-2 text-sm h-9"
                                    placeholder="Cari nama, username, email, atau gardu..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm h-9 focus:border-cyan-500 focus:ring-cyan-500"
                                >
                                    <option value="">Semua Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="pemeriksa">Pemeriksa</option>
                                </select>

                                <select
                                    value={garduFilter}
                                    onChange={(e) => setGarduFilter(e.target.value)}
                                    className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm h-9 focus:border-cyan-500 focus:ring-cyan-500"
                                >
                                    <option value="">Semua Gardu</option>
                                    {garduList.map((gardu) => (
                                        <option key={gardu.gardu_induk_id} value={gardu.gardu_induk_id}>
                                            {gardu.nama_gardu_induk}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(search || roleFilter || garduFilter) && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setRoleFilter("");
                                        setGarduFilter("");
                                    }}
                                    className="mb-2 text-xs font-semibold text-red-600 hover:text-red-700"
                                >
                                    Reset Filter
                                </button>
                            )}

                            <div className="hidden md:block">
                                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                        <thead className="text-[11px] font-semibold uppercase bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-b-2 border-cyan-200 dark:border-gray-600">
                                            <tr>
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-10">No</th>
                                                <SortableHeader field="name" label="Nama" />
                                                <SortableHeader field="username" label="Username" />
                                                <SortableHeader field="email" label="Email" />
                                                <SortableHeader field="role" label="Role" />
                                                <th className="px-2 py-1.5 whitespace-nowrap">Gardu Induk</th>
                                                <SortableHeader field="created_at" label="Dibuat" />
                                                <th className="px-2 py-1.5 text-center whitespace-nowrap w-28">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {users.data.length > 0 ? (
                                                users.data.map((item, index) => (
                                                    <tr key={item.id} className="hover:bg-cyan-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-2 py-1.5 text-center text-gray-600 dark:text-gray-400 font-medium text-sm">
                                                            {(users.current_page - 1) * users.per_page + index + 1}
                                                        </td>
                                                        <td className="px-2 py-1.5 font-semibold text-gray-800 dark:text-gray-100">
                                                            <Link href={route("user.show", item.id)} className="hover:text-cyan-600 dark:hover:text-cyan-400">
                                                                {item.name}
                                                            </Link>
                                                        </td>
                                                        <td className="px-2 py-1.5">{item.username}</td>
                                                        <td className="px-2 py-1.5">{item.email}</td>
                                                        <td className="px-2 py-1.5">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${roleBadge(item.role)}`}>
                                                                {item.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                                                                {item.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-1.5">{item.gardu_induk_nama}</td>
                                                        <td className="px-2 py-1.5 text-xs text-gray-500">{item.created_at}</td>
                                                        <td className="px-2 py-1.5 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <Link href={route("user.show", item.id)} className="inline-flex items-center justify-center p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" title="Detail User">
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                                <Link href={route("user.edit", item.id)} className="inline-flex items-center justify-center p-1.5 rounded-md text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20" title="Edit User">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                                {auth.user.id !== item.id && (
                                                                    <button onClick={() => deleteUser(item)} className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Hapus User">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                                                        <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                                        <p>Tidak ada data ditemukan</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden space-y-2">
                                {users.data.length > 0 ? users.data.map((item, index) => (
                                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                                        <div className="text-xs text-gray-400 mb-1">No. {(users.current_page - 1) * users.per_page + index + 1}</div>
                                        <Link href={route("user.show", item.id)} className="font-semibold text-gray-800 dark:text-gray-100 hover:text-cyan-600">
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-1">{item.username} • {item.email}</p>
                                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${roleBadge(item.role)}`}>{item.role}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">{item.gardu_induk_nama}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                            <Link href={route("user.show", item.id)} className="text-xs font-medium text-emerald-600">Detail</Link>
                                            <span className="text-gray-300 text-xs">|</span>
                                            <Link href={route("user.edit", item.id)} className="text-xs font-medium text-cyan-600">Edit</Link>
                                            {auth.user.id !== item.id && <>
                                                <span className="text-gray-300 text-xs">|</span>
                                                <button onClick={() => deleteUser(item)} className="text-xs font-medium text-red-600">Hapus</button>
                                            </>}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                        <p>Tidak ada data ditemukan</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Pagination links={users.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
