import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

export default function Create({ auth, apds, apdDetails, lokasiList, garduList }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        apd_id: "",
        apd_detail_id: "",
        lokasi_id: "",
        gardu_induk_id: "",
        stok: "",
        tanggal_distribusi: "",
        tanggal_pemeriksaan: "",
        tanggal_berakhir: "",
        kondisi: "",
        catatan: "",
    });

    // 🔹 State untuk daftar gardu induk yang difilter berdasarkan lokasi
    const [filteredGardu, setFilteredGardu] = useState([]);

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
        // reset gardu_induk_id saat lokasi berubah
        setData("gardu_induk_id", "");
    }, [data.lokasi_id]);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("monitoring-apd.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <PlusCircleIcon className="w-6 h-6 text-blue-600" />
                        Tambah Monitoring APD
                    </h2>
                </div>
            }
        >
            <Head title="Tambah Monitoring APD" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg space-y-6"
                            >
                                {/* Dropdown APD */}
                                <div>
                                    <InputLabel htmlFor="apd_id" value="Nama APD" />
                                    <select
                                        id="apd_id"
                                        name="apd_id"
                                        value={data.apd_id}
                                        onChange={(e) => setData("apd_id", e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                                            dark:bg-gray-900 dark:text-gray-300 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                                    >
                                        <option value="">-- Pilih APD --</option>
                                        {apds.map((apd) => (
                                            <option key={apd.id} value={apd.id}>
                                                {apd.nama_apd}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.apd_id} className="mt-2" />
                                </div>

                                {/* Dropdown APD Detail */}
                                <div>
                                    <InputLabel htmlFor="apd_detail_id" value="Detail APD" />
                                    <select
                                        id="apd_detail_id"
                                        name="apd_detail_id"
                                        value={data.apd_detail_id}
                                        onChange={(e) => setData("apd_detail_id", e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                                            dark:bg-gray-900 dark:text-gray-300 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Detail APD --</option>
                                        {apdDetails.map((detail) => (
                                            <option key={detail.id} value={detail.id}>
                                                {detail.nama_detail}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.apd_detail_id} className="mt-2" />
                                </div>

                                {/* Lokasi & Gardu Induk */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="lokasi_id" value="Lokasi" />
                                        <select
                                            id="lokasi_id"
                                            name="lokasi_id"
                                            value={data.lokasi_id}
                                            onChange={(e) => setData("lokasi_id", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                                                dark:bg-gray-900 dark:text-gray-300 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                                        >
                                            <option value="">-- Pilih Lokasi --</option>
                                            {lokasiList.map((lok) => (
                                                <option key={lok.lokasi_id} value={lok.lokasi_id}>
                                                    {lok.nama_lokasi}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.lokasi_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="gardu_induk_id" value="Gardu Induk" />
                                        <select
                                            id="gardu_induk_id"
                                            name="gardu_induk_id"
                                            value={data.gardu_induk_id}
                                            onChange={(e) => setData("gardu_induk_id", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                                                dark:bg-gray-900 dark:text-gray-300 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
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
                                        <InputError message={errors.gardu_induk_id} className="mt-2" />
                                    </div>
                                </div>

                                {/* Stok */}
                                <div>
                                    <InputLabel htmlFor="stok" value="Jumlah Stok" />
                                    <TextInput
                                        id="stok"
                                        type="number"
                                        name="stok"
                                        value={data.stok}
                                        onChange={(e) => setData("stok", e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.stok} className="mt-2" />
                                </div>

                                {/* Tanggal */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel htmlFor="tanggal_distribusi" value="Tanggal Distribusi" />
                                        <TextInput
                                            id="tanggal_distribusi"
                                            type="date"
                                            name="tanggal_distribusi"
                                            value={data.tanggal_distribusi}
                                            onChange={(e) => setData("tanggal_distribusi", e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.tanggal_distribusi} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tanggal_pemeriksaan" value="Tanggal Pemeriksaan" />
                                        <TextInput
                                            id="tanggal_pemeriksaan"
                                            type="date"
                                            name="tanggal_pemeriksaan"
                                            value={data.tanggal_pemeriksaan}
                                            onChange={(e) => setData("tanggal_pemeriksaan", e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.tanggal_pemeriksaan} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tanggal_berakhir" value="Tanggal Berakhir" />
                                        <TextInput
                                            id="tanggal_berakhir"
                                            type="date"
                                            name="tanggal_berakhir"
                                            value={data.tanggal_berakhir}
                                            onChange={(e) => setData("tanggal_berakhir", e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.tanggal_berakhir} className="mt-2" />
                                    </div>
                                </div>

                                {/* Kondisi */}
                                <div>
                                    <InputLabel htmlFor="kondisi" value="Kondisi" />
                                    <select
                                        id="kondisi"
                                        name="kondisi"
                                        value={data.kondisi}
                                        onChange={(e) => setData("kondisi", e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                                            dark:bg-gray-900 dark:text-gray-300 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Kondisi --</option>
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak">Rusak</option>
                                        <option value="Perlu Diganti">Perlu Diganti</option>
                                    </select>
                                    <InputError message={errors.kondisi} className="mt-2" />
                                </div>

                                {/* Catatan */}
                                <div>
                                    <InputLabel htmlFor="catatan" value="Catatan" />
                                    <TextAreaInput
                                        id="catatan"
                                        name="catatan"
                                        value={data.catatan}
                                        onChange={(e) => setData("catatan", e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.catatan} className="mt-2" />
                                </div>

                                {/* Tombol Simpan / Batal */}
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={route("monitoring-apd.index")}
                                        className="min-w-[100px] py-2 px-4 text-center bg-gray-100 text-gray-800 rounded shadow hover:bg-gray-200 text-sm"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[100px] py-2 px-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm disabled:opacity-50"
                                    >
                                        Simpan
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
