import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Building2, ClipboardCheck, AlertTriangle, ChevronRight, ShieldCheck } from "lucide-react";

export default function PemeriksaanIndex({ auth, garduList, isAdmin }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Pemeriksaan APD
                </h2>
            }
        >
            <Head title="Pemeriksaan APD" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-xl bg-cyan-600 flex items-center justify-center">
                            <ClipboardCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pemeriksaan Kondisi APD</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pilih gardu induk untuk mulai pemeriksaan</p>
                        </div>
                    </div>
                </div>

                {/* Grid gardu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {garduList.map((gardu) => (
                        <Link
                            key={gardu.gardu_induk_id}
                            href={route("pemeriksaan-apd.show", gardu.gardu_induk_id)}
                            className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-cyan-400 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-11 w-11 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-cyan-600" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-cyan-500 transition-colors" />
                            </div>

                            <h2 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                                {gardu.nama_gardu_induk}
                            </h2>
                            <p className="text-xs text-gray-400 mb-4">Pemeriksa: {gardu.pemeriksa}</p>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    <span>{gardu.total_apd} APD</span>
                                </div>
                                {gardu.tidak_layak > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                                        <AlertTriangle className="h-3 w-3" />
                                        <span>{gardu.tidak_layak} perlu perhatian</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}

                    {garduList.length === 0 && (
                        <div className="col-span-3 text-center py-16 text-gray-400">
                            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>Belum ada gardu induk yang terdaftar.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}