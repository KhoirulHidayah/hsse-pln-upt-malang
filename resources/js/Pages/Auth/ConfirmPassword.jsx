import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    // Styling input field yang konsisten
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 bg-white p-3 focus:border-cyan-600 focus:ring-cyan-600 placeholder:text-gray-400";

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi" />

            {/* Title Section */}
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Konfirmasi Kata Sandi</h2>
            </div>

            {/* Deskripsi Instruksi */}
            <div className="mb-6 text-sm text-gray-600 leading-relaxed">
                Ini adalah area aman dari aplikasi. Harap konfirmasi kata sandi Anda sebelum melanjutkan.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Kata Sandi" />

                    <div className="relative">
                        <TextInput
                            id="password"
                            // Tambahkan toggle type
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            // Terapkan styling dan padding untuk tombol toggle
                            className={`${inputStyle} pr-12`} 
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Kata Sandi Anda"
                        />
                        
                        {/* Tombol Toggle Show/Hide Password */}
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

                {/* Tombol Konfirmasi */}
                <div className="mt-6">
                    <PrimaryButton 
                        // Terapkan styling tombol full width dan gradien cyan
                        className="w-full justify-center bg-gradient-to-r from-cyan-700 to-cyan-800 p-3 text-lg font-semibold hover:from-cyan-800 hover:to-cyan-900 focus:ring-cyan-700" 
                        disabled={processing}
                    >
                        KONFIRMASI
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}