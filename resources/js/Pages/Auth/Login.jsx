import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',        // ← diganti dari 'email' ke 'login' (support username & email)
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Title Section */}
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Login Akun</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Silakan login untuk mengakses akun Anda
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="space-y-4">
                    {/* Input Username / Email */}
                    <div>
                        <TextInput
                            id="login"
                            type="text"
                            name="login"
                            value={data.login}
                            className="mt-1 block w-full rounded-lg border-gray-300 bg-white p-3 focus:border-cyan-600 focus:ring-cyan-600 placeholder:text-gray-400"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('login', e.target.value)}
                            placeholder="Username atau Email"
                        />
                        <InputError message={errors.login} className="mt-2" />
                        {/* Hint untuk user */}
                        <p className="mt-1 text-xs text-gray-400">
                            Pemeriksa gunakan username · Admin gunakan email
                        </p>
                    </div>

                    {/* Input Password with Toggle */}
                    <div>
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-lg border-gray-300 bg-white p-3 pr-12 focus:border-cyan-600 focus:ring-cyan-600 placeholder:text-gray-400"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Kata Sandi"
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
                </div>

                {/* Remember Me dan Forgot Password */}
                <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Ingat saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-cyan-600 underline hover:text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
                        >
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>

                {/* Tombol LOGIN */}
                <div className="mt-6">
                    <PrimaryButton
                        className="w-full justify-center bg-gradient-to-r from-cyan-700 to-cyan-800 p-3 text-lg font-semibold hover:from-cyan-800 hover:to-cyan-900 focus:ring-cyan-700"
                        disabled={processing}
                    >
                        LOGIN
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
