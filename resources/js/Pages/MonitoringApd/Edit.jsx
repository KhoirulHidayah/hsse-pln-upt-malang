import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Eye, X, Save, CalendarDays, Info, Clock } from "lucide-react"; 
import { useState, useEffect } from "react";

export default function Edit({ auth, monitoring, apds, lokasiList, garduList }) {
    const { data, setData, put, errors, processing } = useForm({
        apd_id: monitoring.apd_id || "",
        lokasi_id: monitoring.lokasi_id || "",
        gardu_induk_id: monitoring.gardu_induk_id || "",
        stok: monitoring.stok || "",
        tanggal_distribusi: monitoring.tanggal_distribusi || "",
        tanggal_pemeriksaan: monitoring.tanggal_pemeriksaan || "",
        tanggal_berakhir: monitoring.tanggal_berakhir || "",
        kondisi: monitoring.kondisi || "",
        catatan: monitoring.catatan || "",
    });

    // 🔹 State untuk daftar gardu induk yang difilter berdasarkan lokasi
    const [filteredGardu, setFilteredGardu] = useState([]);
    
    // 🔹 State untuk menyimpan APD yang dipilih
    const [selectedApd, setSelectedApd] = useState(null);
    
    // 🔹 State untuk mode input tanggal berakhir (auto/manual)
    const [autoCalculate, setAutoCalculate] = useState(false); // Default false untuk edit

    // 🔹 Update daftar gardu induk ketika lokasi berubah
    useEffect(() => {
        if (data.lokasi_id) {
            const filtered = garduList.filter(
                (g) => String(g.lokasi_id) === String(data.lokasi_id)
            );
            setFilteredGardu(filtered);
        } else {
            setFilteredGardu([]);
        }
    }, [data.lokasi_id]);

    // 🔹 Update selected APD ketika apd_id berubah
    useEffect(() => {
        if (data.apd_id) {
            const apd = apds.find((a) => String(a.id) === String(data.apd_id));
            setSelectedApd(apd || null);
        } else {
            setSelectedApd(null);
        }
    }, [data.apd_id]);

    // 🔹 Auto calculate tanggal berakhir berdasarkan tanggal distribusi dan masa pakai
    useEffect(() => {
        if (autoCalculate && data.tanggal_distribusi && selectedApd?.masa_penggunaan) {
            const tanggalBerakhir = calculateExpiredDate(
                data.tanggal_distribusi, 
                selectedApd.masa_penggunaan
            );
            setData("tanggal_berakhir", tanggalBerakhir);
        }
    }, [data.tanggal_distribusi, selectedApd, autoCalculate]);

    // 🔹 Fungsi untuk menghitung tanggal berakhir
    const calculateExpiredDate = (startDate, masaPenggunaan) => {
        if (!startDate || !masaPenggunaan) return "";

        const date = new Date(startDate);
        
        // Parse masa penggunaan (contoh: "24 bulan", "5 tahun", "6 bulan")
        const match = masaPenggunaan.match(/(\d+)\s*(bulan|tahun|hari)/i);
        
        if (!match) return "";

        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        switch (unit) {
            case "bulan":
                date.setMonth(date.getMonth() + value);
                break;
            case "tahun":
                date.setFullYear(date.getFullYear() + value);
                break;
            case "hari":
                date.setDate(date.getDate() + value);
                break;
            default:
                return "";
        }

        // Format ke YYYY-MM-DD
        return date.toISOString().split("T")[0];
    };

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("monitoring-apd.update", { monitoring_apd: monitoring.monitoring_id }));
    };

    // Style konsisten untuk input, select, dan date
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const textareaStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 min-h-[100px] text-sm";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Edit Monitoring APD
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Perbarui data monitoring Alat Pelindung Diri
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Monitoring APD" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit} className="space-y-4">
                                
                                {/* Dropdown APD dengan Info Masa Pakai */}
                                <div>
                                    <InputLabel htmlFor="apd_id" value="Nama APD" className={labelStyle} />
                                    <select
                                        id="apd_id"
                                        name="apd_id"
                                        value={data.apd_id}
                                        onChange={(e) => setData("apd_id", e.target.value)}
                                        className={inputStyle}
                                    >
                                        <option value="">-- Pilih APD --</option>
                                        {apds.map((apd) => (
                                            <option key={apd.id} value={apd.id}>
                                                {apd.nama_apd} {apd.masa_penggunaan ? `(${apd.masa_penggunaan})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.apd_id} className="mt-1" />
                                    
                                    {/* Info Masa Pakai APD yang Dipilih */}
                                    {selectedApd && (
                                        <div className="mt-2 flex items-start gap-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
                                            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                                            <div className="text-xs text-cyan-700 dark:text-cyan-300">
                                                <p className="font-semibold">Masa Pakai: {selectedApd.masa_penggunaan || '-'}</p>
                                                {selectedApd.standar && (
                                                    <p className="text-cyan-600 dark:text-cyan-400">Standar: {selectedApd.standar}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Lokasi & Gardu Induk */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="lokasi_id" value="Lokasi" className={labelStyle} />
                                        <select
                                            id="lokasi_id"
                                            name="lokasi_id"
                                            value={data.lokasi_id}
                                            onChange={(e) => setData("lokasi_id", e.target.value)}
                                            className={inputStyle}
                                        >
                                            <option value="">-- Pilih Lokasi --</option>
                                            {lokasiList.map((lok) => (
                                                <option key={lok.lokasi_id} value={lok.lokasi_id}>
                                                    {lok.nama_lokasi}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.lokasi_id} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="gardu_induk_id" value="Gardu Induk" className={labelStyle} />
                                        <select
                                            id="gardu_induk_id"
                                            name="gardu_induk_id"
                                            value={data.gardu_induk_id}
                                            onChange={(e) => setData("gardu_induk_id", e.target.value)}
                                            className={inputStyle}
                                            disabled={!data.lokasi_id}
                                        >
                                            <option value="">
                                                {data.lokasi_id
                                                    ? "-- Pilih Gardu Induk --"
                                                    : "Pilih lokasi terlebih dahulu"}
                                            </option>
                                            {filteredGardu.map((gardu) => (
                                                <option key={gardu.gardu_induk_id} value={gardu.gardu_induk_id}>
                                                    {gardu.nama_gardu_induk}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.gardu_induk_id} className="mt-1" />
                                    </div>
                                </div>

                                {/* Stok */}
                                <div>
                                    <InputLabel htmlFor="stok" value="Jumlah Stok" className={labelStyle} />
                                    <TextInput
                                        id="stok"
                                        type="number"
                                        name="stok"
                                        value={data.stok}
                                        onChange={(e) => setData("stok", e.target.value)}
                                        className={inputStyle}
                                    />
                                    <InputError message={errors.stok} className="mt-1" />
                                </div>

                                {/* Tanggal dengan Auto Calculate */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel 
                                            htmlFor="tanggal_distribusi" 
                                            value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Distribusi</span>} 
                                            className={labelStyle} 
                                        />
                                        <TextInput
                                            id="tanggal_distribusi"
                                            type="date"
                                            name="tanggal_distribusi"
                                            value={data.tanggal_distribusi}
                                            onChange={(e) => setData("tanggal_distribusi", e.target.value)}
                                            className={inputStyle}
                                        />
                                        <InputError message={errors.tanggal_distribusi} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel 
                                            htmlFor="tanggal_pemeriksaan" 
                                            value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Pemeriksaan</span>} 
                                            className={labelStyle} 
                                        />
                                        <TextInput
                                            id="tanggal_pemeriksaan"
                                            type="date"
                                            name="tanggal_pemeriksaan"
                                            value={data.tanggal_pemeriksaan}
                                            onChange={(e) => setData("tanggal_pemeriksaan", e.target.value)}
                                            className={inputStyle}
                                        />
                                        <InputError message={errors.tanggal_pemeriksaan} className="mt-1" />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <InputLabel 
                                                htmlFor="tanggal_berakhir" 
                                                value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Berakhir</span>} 
                                                className={labelStyle} 
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setAutoCalculate(!autoCalculate)}
                                                className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                                            >
                                                {autoCalculate ? '🤖 Otomatis' : '✏️ Manual'}
                                            </button>
                                        </div>
                                        <TextInput
                                            id="tanggal_berakhir"
                                            type="date"
                                            name="tanggal_berakhir"
                                            value={data.tanggal_berakhir}
                                            onChange={(e) => {
                                                setData("tanggal_berakhir", e.target.value);
                                                setAutoCalculate(false); // Switch ke manual jika user edit
                                            }}
                                            className={`${inputStyle} ${autoCalculate ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                            disabled={autoCalculate && (!data.tanggal_distribusi || !selectedApd?.masa_penggunaan)}
                                        />
                                        <InputError message={errors.tanggal_berakhir} className="mt-1" />
                                        
                                        {/* Info Auto Calculate */}
                                        {autoCalculate && (
                                            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    {!data.tanggal_distribusi 
                                                        ? "Pilih tanggal distribusi terlebih dahulu"
                                                        : !selectedApd?.masa_penggunaan
                                                        ? "APD tidak memiliki data masa pakai"
                                                        : `Dihitung otomatis: ${data.tanggal_distribusi} + ${selectedApd.masa_penggunaan}`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info Box untuk Auto Calculate */}
                                {autoCalculate && data.tanggal_distribusi && selectedApd?.masa_penggunaan && data.tanggal_berakhir && (
                                    <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <Info className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-green-700 dark:text-green-300">
                                            <p className="font-semibold">✓ Tanggal berakhir telah dihitung otomatis</p>
                                            <p className="text-xs mt-1">
                                                Distribusi: {new Date(data.tanggal_distribusi).toLocaleDateString('id-ID')} + 
                                                Masa Pakai: {selectedApd.masa_penggunaan} = 
                                                Berakhir: {new Date(data.tanggal_berakhir).toLocaleDateString('id-ID')}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                💡 Klik "✏️ Manual" untuk mengubah tanggal secara manual
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Kondisi */}
                                <div>
                                    <InputLabel htmlFor="kondisi" value="Kondisi" className={labelStyle} />
                                    <select
                                        id="kondisi"
                                        name="kondisi"
                                        value={data.kondisi}
                                        onChange={(e) => setData("kondisi", e.target.value)}
                                        className={inputStyle}
                                    >
                                        <option value="">-- Pilih Kondisi --</option>
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak">Rusak</option>
                                        <option value="Perlu Diganti">Perlu Diganti</option>
                                    </select>
                                    <InputError message={errors.kondisi} className="mt-1" />
                                </div>

                                {/* Catatan */}
                                <div>
                                    <InputLabel htmlFor="catatan" value="Catatan" className={labelStyle} />
                                    <TextAreaInput
                                        id="catatan"
                                        name="catatan"
                                        value={data.catatan}
                                        onChange={(e) => setData("catatan", e.target.value)}
                                        className={textareaStyle}
                                    />
                                    <InputError message={errors.catatan} className="mt-1" />
                                </div>

                                {/* Tombol Simpan / Batal */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("monitoring-apd.index")}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        Perbarui
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}