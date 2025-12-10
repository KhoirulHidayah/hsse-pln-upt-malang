import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                // 📦 HEADER - GAYA GRADIENT CYAN/TEAL
                <div className="flex items-center gap-2">
                    {/* Wrapper Icon Gradient */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        {/* Menggunakan SVG yang ada, tetapi di-styling dengan warna putih dan ukuran yang lebih kecil */}
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        {/* Menyesuaikan ukuran dan warna teks header */}
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Profil
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Kelola pengaturan dan preferensi akun Anda.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Profil" />

            {/* PERUBAHAN: Mengubah py-12 menjadi py-2 */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah padding dan spacing */}
                <div className="mx-auto max-w-7xl space-y-4 sm:px-2 lg:px-2">
                    
                    {/* PERUBAHAN: Mengubah p-4/sm:p-8 menjadi p-3/sm:p-5 */}
                    <div className="bg-white p-3 sm:p-5 shadow sm:rounded-lg dark:bg-gray-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-3 sm:p-5 shadow sm:rounded-lg dark:bg-gray-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-3 sm:p-5 shadow sm:rounded-lg dark:bg-gray-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}