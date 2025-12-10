import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    // Styling input field yang konsisten
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 bg-white p-3 focus:border-cyan-600 focus:ring-cyan-600 placeholder:text-gray-400";

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            {/* Title Section */}
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Lupa Kata Sandi?</h2>
            </div>
            
            {/* Deskripsi Instruksi */}
            <div className="mb-6 text-sm text-gray-600 leading-relaxed">
                Lupa kata sandi Anda? Tidak masalah. Cukup berikan alamat email Anda, dan kami akan mengirimkan tautan atur ulang kata sandi melalui email yang memungkinkan Anda memilih kata sandi baru.
            </div>

            {/* Status Notifikasi */}
            {status && (
                <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                {/* Input Email */}
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={inputStyle}
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Alamat Email"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>
                
                {/* Tombol Kirim Tautan Reset */}
                <div className="mt-6">
                    <PrimaryButton 
                        className="w-full justify-center bg-gradient-to-r from-cyan-700 to-cyan-800 p-3 text-lg font-semibold hover:from-cyan-800 hover:to-cyan-900 focus:ring-cyan-700" 
                        disabled={processing}
                    >
                        KIRIM TAUTAN ATUR ULANG
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}