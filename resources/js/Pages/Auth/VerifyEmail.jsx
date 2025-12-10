import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            {/* Title Section */}
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Verifikasi Alamat Email Anda</h2>
            </div>

            {/* Deskripsi Instruksi */}
            <div className="mb-6 text-sm text-gray-600 leading-relaxed">
                Terima kasih telah mendaftar! Sebelum memulai, harap verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan kepada Anda. Jika Anda tidak menerima email, kami akan dengan senang hati mengirimkannya kembali.
            </div>

            {/* Status Notifikasi */}
            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton 
                        // Styling tombol cyan gradient konsisten
                        className="bg-gradient-to-r from-cyan-700 to-cyan-800 px-6 py-2.5 text-sm font-semibold hover:from-cyan-800 hover:to-cyan-900 focus:ring-cyan-700" 
                        disabled={processing}
                    >
                        KIRIM ULANG EMAIL VERIFIKASI
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        // Styling link konsisten dengan tema cyan
                        className="rounded-md text-sm text-cyan-600 underline hover:text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
                    >
                        Keluar (Log Out)
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}