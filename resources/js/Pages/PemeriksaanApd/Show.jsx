import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft, Building2, ClipboardCheck, CheckCircle,
    AlertTriangle, XCircle, ChevronDown, Save, Clock
} from "lucide-react";

const KONDISI_OPTIONS = ["Baik", "Perlu Diganti", "Rusak"];

const kondisiStyle = (kondisi) => {
    if (kondisi === "Baik")         return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    if (kondisi === "Perlu Diganti") return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    if (kondisi === "Rusak")         return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    return "bg-gray-100 text-gray-500";
};

const KondisiIcon = ({ kondisi }) => {
    if (kondisi === "Baik")          return <CheckCircle className="h-4 w-4" />;
    if (kondisi === "Perlu Diganti") return <AlertTriangle className="h-4 w-4" />;
    if (kondisi === "Rusak")         return <XCircle className="h-4 w-4" />;
    return null;
};

const statusNotifStyle = (status) => {
    if (status === "Active")  return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
    if (status === "Warning") return "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
    if (status === "Expired") return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    return "";
};

export default function PemeriksaanShow({ auth, gardu, apds, filters = {}, isAdmin }) {
    const { flash } = usePage().props;

    // State lokal: simpan kondisi yang belum di-submit per item
    const [drafts, setDrafts] = useState({});
    const [loadingId, setLoadingId] = useState(null);

    // State filter
    const [search, setSearch] = useState(filters.search || "");
    const [kondisiFilter, setKondisiFilter] = useState(filters.kondisi || "");
    const [statusFilter, setStatusFilter] = useState(filters.status_notifikasi || "");
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            router.get(
                route("pemeriksaan-apd.show", gardu.gardu_induk_id),
                {
                    search,
                    kondisi: kondisiFilter,
                    status_notifikasi: statusFilter,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 300);

        return () => clearTimeout(delay);
    }, [search, kondisiFilter, statusFilter]);

    const setDraft = (id, nilai) => {
        setDrafts(prev => ({ ...prev, [id]: nilai }));
    };

    const submitKondisi = (monitoringId) => {
        const kondisi = drafts[monitoringId];
        if (!kondisi) return;

        setLoadingId(monitoringId);
        router.patch(
            route("pemeriksaan-apd.update-kondisi", monitoringId),
            { kondisi },
            {
                preserveScroll: true,
                onFinish: () => {
                    setLoadingId(null);
                    setDrafts(prev => {
                        const next = { ...prev };
                        delete next[monitoringId];
                        return next;
                    });
                },
            }
        );
    };

    const totalBaik      = apds.filter(a => a.kondisi === "Baik").length;
    const totalPerlu     = apds.filter(a => a.kondisi === "Perlu Diganti").length;
    const totalRusak     = apds.filter(a => a.kondisi === "Rusak").length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Detail Pemeriksaan – {gardu.nama_gardu_induk}
                </h2>
            }
        >
            <Head title={`Pemeriksaan – ${gardu.nama_gardu_induk}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    {isAdmin && (
                        <Link
                            href={route("pemeriksaan-apd.index")}
                            className="h-9 w-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </Link>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-cyan-600 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {gardu.nama_gardu_induk}
                            </h1>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <ClipboardCheck className="h-3 w-3" />
                                Pemeriksaan Kondisi Fisik APD
                            </p>
                        </div>
                    </div>
                </div>

                {/* Flash message */}
                {flash?.success && (
                    <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Ringkasan */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: "Baik",         nilai: totalBaik,  icon: <CheckCircle className="h-4 w-4 text-green-600" />,  bg: "bg-green-50 dark:bg-green-900/20" },
                        { label: "Perlu Diganti",nilai: totalPerlu, icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,bg: "bg-yellow-50 dark:bg-yellow-900/20" },
                        { label: "Rusak",        nilai: totalRusak, icon: <XCircle className="h-4 w-4 text-red-600" />,        bg: "bg-red-50 dark:bg-red-900/20" },
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                            <div className="flex justify-center mb-1">{s.icon}</div>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.nilai}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama / kode APD..."
                            className="md:col-span-2 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:border-cyan-500 focus:ring-cyan-500"
                        />

                        <select
                            value={kondisiFilter}
                            onChange={(e) => setKondisiFilter(e.target.value)}
                            className="rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:border-cyan-500 focus:ring-cyan-500"
                        >
                            <option value="">Semua Kondisi</option>
                            <option value="Baik">Baik</option>
                            <option value="Perlu Diganti">Perlu Diganti</option>
                            <option value="Rusak">Rusak</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:border-cyan-500 focus:ring-cyan-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="Active">Active</option>
                            <option value="Warning">Warning</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>

                    {(search || kondisiFilter || statusFilter) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setKondisiFilter("");
                                setStatusFilter("");
                            }}
                            className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {/* Tabel APD */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {apds.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            <ClipboardCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p>Belum ada APD di gardu ini.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">APD</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Stok</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Tanggal Distribusi</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Masa Berlaku</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Kondisi Saat Ini</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Periksa Terakhir</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Update Kondisi</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {apds.map((apd) => {
                                        const draftKondisi = drafts[apd.monitoring_id];
                                        const isDirty     = !!draftKondisi && draftKondisi !== apd.kondisi;
                                        const isLoading   = loadingId === apd.monitoring_id;

                                        return (
                                            <tr key={apd.monitoring_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                {/* Nama APD */}
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900 dark:text-white">{apd.nama_apd}</p>
                                                    <p className="text-xs text-gray-400">{apd.kode_apd}</p>
                                                </td>

                                                {/* Stok */}
                                                <td className="px-4 py-3 text-center">
                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{apd.stok}</span>
                                                </td>

                                                {/* Tanggal distribusi*/}
                                                <td className="px-4 py-3 text-center">
                                                    <p className="text-gray-700 dark:text-gray-300 text-xs">{apd.tanggal_distribusi ?? '-'}</p>
                                                </td>

                                                {/* Masa berlaku + status */}
                                                <td className="px-4 py-3 text-center">
                                                    <p className="text-gray-700 dark:text-gray-300 text-xs">{apd.tanggal_berakhir ?? '-'}</p>
                                                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusNotifStyle(apd.status_notifikasi)}`}>
                                                        {apd.status_notifikasi}
                                                    </span>
                                                </td>

                                                {/* Kondisi saat ini */}
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${kondisiStyle(apd.kondisi)}`}>
                                                        <KondisiIcon kondisi={apd.kondisi} />
                                                        {apd.kondisi}
                                                    </span>
                                                </td>

                                                {/* Periksa terakhir */}
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {apd.tanggal_pemeriksaan ?? 'Belum diperiksa'}
                                                    </span>
                                                </td>

                                                {/* Dropdown pilih kondisi baru */}
                                                <td className="px-4 py-3 text-center">
                                                    <div className="relative inline-block">
                                                        <select
                                                            value={draftKondisi ?? apd.kondisi}
                                                            onChange={e => setDraft(apd.monitoring_id, e.target.value)}
                                                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors
                                                                ${isDirty
                                                                    ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300"
                                                                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                                }`}
                                                        >
                                                            {KONDISI_OPTIONS.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                                    </div>
                                                </td>

                                                {/* Tombol simpan */}
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => submitKondisi(apd.monitoring_id)}
                                                        disabled={!isDirty || isLoading}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                                            ${isDirty && !isLoading
                                                                ? "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm"
                                                                : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        <Save className="h-3 w-3" />
                                                        {isLoading ? "Menyimpan..." : "Simpan"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}