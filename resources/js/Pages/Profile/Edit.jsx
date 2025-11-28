import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                            <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Profile
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage your account settings and preferences.
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}