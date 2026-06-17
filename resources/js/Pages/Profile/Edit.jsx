import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, userRole }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Profil ({userRole === 'admin' ? 'Admin' : 'Pemeriksa'})
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Kelola pengaturan dan preferensi akun Anda.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Profil" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-2 lg:px-2">
                    
                    <div className="bg-white p-3 sm:p-5 shadow sm:rounded-lg dark:bg-gray-800">
                        {/* Meneruskan properti userRole ke form informasi */}
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            userRole={userRole} 
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-3 sm:p-5 shadow sm:rounded-lg dark:bg-gray-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* OPSIONAL: Sembunyikan form hapus akun jika yang masuk adalah Pemeriksa */}
                    {userRole === 'admin' && (
                        <div className="bg-white p-3 sm:p-5 shadow sm:rounded-lg dark:bg-gray-800">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}