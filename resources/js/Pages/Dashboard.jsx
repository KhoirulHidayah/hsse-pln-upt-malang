import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                            <LayoutDashboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Dashboard
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Halaman ini menampilkan ringkasan data dan aktivitas terbaru dalam sistem.
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Kamu sudah login!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}