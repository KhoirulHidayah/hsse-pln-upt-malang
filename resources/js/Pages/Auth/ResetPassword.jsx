import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Styling input field yang konsisten
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 bg-white p-3 focus:border-cyan-600 focus:ring-cyan-600 placeholder:text-gray-400";

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            {/* Title Section */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Atur Ulang Kata Sandi</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Silakan masukkan kata sandi baru untuk akun Anda.
                </p>
            </div>

            <form onSubmit={submit} className='space-y-4'>
                
                {/* Input Email (Read-only/Disabled for consistency) */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={`${inputStyle} text-gray-500 bg-gray-100 cursor-not-allowed`}
                        autoComplete="username"
                        readOnly // Tandai sebagai read-only
                        disabled // Tandai sebagai disabled agar tampilan berbeda
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Input Password Baru */}
                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" />
                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className={`${inputStyle} pr-12`}
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Input Konfirmasi Password Baru */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi Baru"
                    />
                    <div className="relative">
                        <TextInput
                            type={showConfirmPassword ? "text" : "password"}
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={`${inputStyle} pr-12`}
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            placeholder="Ulangi kata sandi baru"
                        />
                         <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Tombol Reset Password */}
                <div className="mt-6">
                    <PrimaryButton 
                        className="w-full justify-center bg-gradient-to-r from-cyan-700 to-cyan-800 p-3 text-lg font-semibold hover:from-cyan-800 hover:to-cyan-900 focus:ring-cyan-700" 
                        disabled={processing}
                    >
                        ATUR ULANG KATA SANDI
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}