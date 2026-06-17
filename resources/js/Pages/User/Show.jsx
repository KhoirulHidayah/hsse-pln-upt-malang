import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    User,
    Mail,
    Shield,
    Building2,
    Calendar,
    ArrowLeft
} from "lucide-react";

export default function Show({ auth, user }) {

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const roleColor = (role) => {
        if (role === "admin") {
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
        }

        if (role === "pemeriksa") {
            return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300";
        }

        return "bg-gray-100 text-gray-700";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <User className="h-5 w-5 text-white"/>
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Detail User
                        </h2>

                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Informasi lengkap user
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Detail User"/>

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">

                        <div className="p-4">

                            <div className="grid md:grid-cols-2 gap-10">

                                {/* kiri */}

                                <div>

                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Nama
                                        </label>

                                        <div className="mt-1 flex items-center gap-2">
                                            <User className="w-4 h-4 text-cyan-600"/>

                                            <p className="text-sm">
                                                {user.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Email
                                        </label>

                                        <div className="mt-1 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-cyan-600"/>

                                            <p className="text-sm">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Username
                                        </label>

                                        <p className="text-sm mt-1">
                                            {user.username}
                                        </p>
                                    </div>

                                </div>


                                {/* kanan */}

                                <div>

                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Role
                                        </label>

                                        <div className="mt-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor(user.role)}`}>
                                                <Shield className="w-3 h-3 inline mr-1"/>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Gardu Induk
                                        </label>

                                        <div className="mt-1 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-cyan-600"/>

                                            <p className="text-sm">
                                                {user.gardu_induk?.nama_gardu_induk ?? "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Dibuat
                                        </label>

                                        <div className="mt-1 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-cyan-600"/>

                                            <p className="text-sm">
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">

                                <Link
                                    href={route("user.index")}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4"/>

                                    Kembali
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </AuthenticatedLayout>
    );
}