import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    userRole, // Tangkap prop role di sini
    className = '',
}) {
    const user = usePage().props.auth.user;
    
    // Deteksi role
    const isAdmin = userRole === 'admin';

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email || '',
            username: user.username || '', // Siapkan state untuk username pemeriksa
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Informasi Profil ({isAdmin ? 'Admin' : 'Pemeriksa'})
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Perbarui informasi identitas akun login Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Field Nama */}
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* KONDISIONAL FORM BERDASARKAN ROLE */}
                {isAdmin ? (
                    /* JIKA ADMIN: Tampilkan Input Email */
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                ) : (
                    /* JIKA PEMERIKSA: Tampilkan Input Username (Read-Only / Disabled agar aman) */
                    <div>
                        <InputLabel htmlFor="username" value="Username Lapangan" />
                        <TextInput
                            id="username"
                            type="text"
                            className="mt-1 block w-full bg-gray-100 cursor-not-allowed dark:bg-gray-700"
                            value={data.username}
                            disabled={true} // Di-disable agar user pemeriksa tidak merubah kredensial seenaknya
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-400">
                            Username diverifikasi oleh sistem pusat PLN dan tidak dapat diubah secara mandiri.
                        </p>
                        <InputError className="mt-2" message={errors.username} />
                    </div>
                )}

                {/* Bagian Verifikasi Email Hanya untuk Admin */}
                {isAdmin && mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}