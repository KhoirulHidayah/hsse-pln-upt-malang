import { useState } from 'react';
import { X, Shield, ClipboardCheck, BarChart3, Users, Bell, Database, FileCheck } from 'lucide-react';

export default function GuestLayout({ children, welcomeContent }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
                {/* Bagian Kiri: Welcome/Hero */}
                <div className="hidden w-1/2 flex-col justify-center bg-cyan-700 p-10 text-white md:flex" style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 100% 0, rgba(255, 255, 255, 0.1) 0%, transparent 40%)',
                    backgroundSize: 'cover, 400px 400px',
                    backgroundRepeat: 'no-repeat, repeat',
                    backgroundPosition: 'center, 100% 0'
                }}>
                    
<a href="/" className="mb-10 group block">
                        <div className="flex items-center justify-center relative">
                            {/* Gradient ring luar untuk depth */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-lime-300/25 to-cyan-200/15 transition-all duration-500 group-hover:from-lime-300/35 group-hover:to-cyan-200/25 group-hover:scale-110"></div>
                            </div>
                            
                            {/* White circle background - lebih kecil dan proporsional */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-24 w-24 rounded-full bg-white shadow-md transition-all duration-500 group-hover:shadow-lg group-hover:scale-105"></div>
                            </div>
                            
                            {/* Logo HSSE PLN - ukuran disesuaikan */}
                            <img 
                                src="/img/hsse.png" 
                                alt="HSSE PLN Logo" 
                                className="h-16 w-auto relative z-10 transition-all duration-300 group-hover:scale-105"
                                style={{
                                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
                                }}
                            />
                        </div>
                    </a>
                    
                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold leading-tight">
                            Selamat Datang
                        </h1>
                        
                        <h2 className="text-2xl font-semibold text-lime-300">
                            HSSE PLN UPT Malang
                        </h2>
                    </div>
                    
                    <div className="mt-6 space-y-1">
                        <p className="text-lg font-medium text-white">
                            Sistem Monitoring APD
                        </p>
                        <p className="text-sm text-gray-200 leading-relaxed">
                            Platform digital untuk pemantauan dan pengelolaan Alat Pelindung Diri secara real-time
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-8 w-max rounded-full border border-white bg-white/10 px-6 py-2 text-sm font-semibold hover:bg-lime-500 hover:border-lime-500 hover:text-white transition duration-300"
                    >
                        View more
                    </button>
                </div>

                {/* Bagian Kanan: Form Konten */}
                <div className="w-full p-8 md:w-1/2 md:p-12">
                    {children}
                </div>
            </div>

            {/* Modal Informatif */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
                        {/* Header Modal */}
                        <div className="sticky top-0 bg-gradient-to-r from-cyan-700 to-cyan-600 p-6 text-white">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/20 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <h2 className="text-2xl font-bold">Sistem Informasi Manajemen APD</h2>
                            <p className="mt-2 text-cyan-100">HSSE PLN UPT Malang - Berbasis SPLN U2.006:2023</p>
                        </div>

                        {/* Konten Modal */}
                        <div className="p-6 space-y-6">
                            {/* Deskripsi */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tentang Sistem</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Sistem Informasi Manajemen APD adalah platform terintegrasi untuk mendukung pengelolaan Alat Pelindung Diri di lingkungan PLN UPT Malang. Sistem ini bertujuan memastikan setiap APD yang digunakan memenuhi standar keselamatan kerja sesuai SPLN U2.006:2023, mulai dari pendataan, monitoring kondisi, hingga pengingat kelayakan pakai. Dengan sistem ini, pengelolaan APD menjadi lebih terstruktur, terdokumentasi dengan baik, dan dapat diaudit secara digital untuk mendukung keselamatan pekerja di lingkungan PLN.
                                </p>
                            </div>

                            {/* Modul Utama */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Modul Utama Sistem</h3>
                                <div className="grid gap-4">
                                    {/* Master Data */}
                                    <div className="flex gap-3 p-4 bg-cyan-50 rounded-lg border border-cyan-100">
                                        <div className="flex-shrink-0">
                                            <Database className="h-6 w-6 text-cyan-700" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">Master Data APD</h4>
                                            <p className="text-sm text-gray-600 mt-1 mb-2">
                                                Pengelolaan data dasar sistem mencakup struktur dan relasi utama
                                            </p>
                                            <ul className="text-xs text-gray-500 space-y-1 ml-4">
                                                <li>• Jenis APD sesuai klasifikasi SPLN</li>
                                                <li>• Master APD dengan spesifikasi lengkap</li>
                                                <li>• Data Lokasi dan Gardu Induk</li>
                                                <li>• Fitur CRUD untuk setiap entitas</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Monitoring APD */}
                                    <div className="flex gap-3 p-4 bg-lime-50 rounded-lg border border-lime-100">
                                        <div className="flex-shrink-0">
                                            <Shield className="h-6 w-6 text-lime-700" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">Monitoring APD</h4>
                                            <p className="text-sm text-gray-600 mt-1 mb-2">
                                                Pengawasan kondisi APD secara real-time sesuai standar SPLN
                                            </p>
                                            <ul className="text-xs text-gray-500 space-y-1 ml-4">
                                                <li>• Pencatatan masa pakai dan masa produksi</li>
                                                <li>• Tracking sertifikasi dan kedaluwarsa</li>
                                                <li>• Import data untuk pemutakhiran cepat</li>
                                                <li>• Dokumentasi kondisi kelayakan APD</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Notifikasi APD */}
                                    <div className="flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                        <div className="flex-shrink-0">
                                            <Bell className="h-6 w-6 text-amber-700" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">Notifikasi APD</h4>
                                            <p className="text-sm text-gray-600 mt-1 mb-2">
                                                Sistem pengingat otomatis untuk kelayakan APD
                                            </p>
                                            <ul className="text-xs text-gray-500 space-y-1 ml-4">
                                                <li>• Alert APD mendekati batas masa pakai</li>
                                                <li>• Notifikasi APD melewati standar kelayakan</li>
                                                <li>• Pengingat pemeriksaan berkala</li>
                                                <li>• Laporan status APD tidak layak pakai</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kepatuhan Standar SPLN */}
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                <div className="flex gap-3">
                                    <FileCheck className="h-6 w-6 text-blue-700 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Kepatuhan SPLN U2.006:2023</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Sistem ini mengacu pada ketentuan standar SPLN U2.006:2023 (PT PLN (Persero), 2023) yang mengatur tentang klasifikasi, kelayakan, dan persyaratan penggunaan APD. Setiap fitur dirancang untuk memastikan kesesuaian dengan regulasi keselamatan kerja PLN dan mendukung audit compliance secara digital.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Manfaat */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Manfaat Implementasi</h3>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-cyan-700 font-bold mt-1 flex-shrink-0">✓</span>
                                        <span className="text-gray-600">Pengelolaan APD efektif dan terdokumentasi sesuai standar SPLN U2.006:2023</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-cyan-700 font-bold mt-1 flex-shrink-0">✓</span>
                                        <span className="text-gray-600">Monitoring proaktif masa pakai dan kelayakan APD untuk mencegah penggunaan APD kadaluarsa</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-cyan-700 font-bold mt-1 flex-shrink-0">✓</span>
                                        <span className="text-gray-600">Notifikasi otomatis untuk pemeliharaan dan penggantian APD tepat waktu</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-cyan-700 font-bold mt-1 flex-shrink-0">✓</span>
                                        <span className="text-gray-600">Dokumentasi digital untuk audit keselamatan kerja dan compliance regulasi PLN</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-cyan-700 font-bold mt-1 flex-shrink-0">✓</span>
                                        <span className="text-gray-600">Efisiensi operasional melalui import data dan pemutakhiran informasi secara cepat</span>
                                    </div>
                                </div>
                            </div>

                            {/* Teknologi */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Teknologi yang Digunakan</h3>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Laravel</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">React JS</span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Inertia.js</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">MySQL</span>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Tailwind CSS</span>
                                </div>
                            </div>

                            {/* Kontak */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Butuh Bantuan?</h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    Hubungi Bagian HSSE untuk informasi lebih lanjut atau bantuan teknis sistem
                                </p>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="border-t bg-gray-50 p-4 text-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg bg-cyan-700 px-8 py-2.5 text-white font-medium hover:bg-cyan-800 transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}