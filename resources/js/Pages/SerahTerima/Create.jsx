import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function Create({ auth, configs }) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, errors, processing } = useForm({
        // Field Baru
        no_seri: configs.no_seri_suggestion || "",
        no_dokumen: configs.no_dokumen_default || "",
        status_dokumen: null,
        copy_no: "",
        nomor_revisi: configs.nomor_revisi_default || "",
        nomor_edisi: configs.nomor_edisi_default || "",
        tanggal_efektif: configs.tanggal_efektif_default || today,
        lokasi: "Malang",

        // Field Lama
        tanggal: today,
        nama_penerima: "",
        jabatan_pengirim: "",
        nama_pengirim: "",
        
        // Detail Item
        items: [
            { item_nama: "", item_merk: "", jumlah: "", keadaan: "", cek: true },
        ],
    });

    // Fungsi untuk handle perubahan status dokumen
    const handleStatusChange = (status) => {
        // Jika status yang diklik sama dengan yang sudah dipilih, uncheck (set null)
        // Jika berbeda, set status baru
        setData("status_dokumen", data.status_dokumen === status ? null : status);
    };

    const addItem = () => {
        setData("items", [
            ...data.items,
            { item_nama: "", item_merk: "", jumlah: "", keadaan: "", cek: true },
        ]);
    };

    const removeItem = (index) => {
        const rows = [...data.items];
        rows.splice(index, 1);
        setData("items", rows);
    };

    const updateItem = (index, field, value) => {
        const updated = [...data.items];
        updated[index][field] = field === 'cek' ? Boolean(value) : value;
        setData("items", updated);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("serah-terima.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <PlusCircleIcon className="w-6 h-6 text-teal-600" />
                    Tambah Serah Terima Barang
                </h2>
            }
        >
            <Head title="Tambah Serah Terima" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <form onSubmit={onSubmit} className="space-y-6">

                                {/* INFORMASI DOKUMEN & UMUM */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Informasi Dokumen & Umum</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        {/* No Seri */}
                                        <div>
                                            <InputLabel htmlFor="no_seri" value="No. Seri (Wajib)" />
                                            <TextInput
                                                id="no_seri"
                                                type="text"
                                                value={data.no_seri}
                                                onChange={(e) => setData("no_seri", e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.no_seri} className="mt-2" />
                                        </div>

                                        {/* No Dokumen */}
                                        <div>
                                            <InputLabel htmlFor="no_dokumen" value="No. Dokumen" />
                                            <TextInput
                                                id="no_dokumen"
                                                type="text"
                                                value={data.no_dokumen}
                                                onChange={(e) => setData("no_dokumen", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.no_dokumen} className="mt-2" />
                                        </div>

                                        {/* Tanggal */}
                                        <div>
                                            <InputLabel htmlFor="tanggal" value="Tanggal Transaksi" />
                                            <TextInput
                                                id="tanggal"
                                                type="date"
                                                value={data.tanggal}
                                                onChange={(e) => setData("tanggal", e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.tanggal} className="mt-2" />
                                        </div>
                                        
                                        {/* Status Dokumen - Checkbox */}
                                        <div className="md:col-span-3">
                                            <InputLabel value="Status Dokumen" className="mb-2" />
                                            <div className="flex gap-6">
                                                {/* Checkbox MASTER */}
                                                <div className="flex items-center">
                                                    <input
                                                        id="status_master"
                                                        type="checkbox"
                                                        value="MASTER"
                                                        checked={data.status_dokumen === 'MASTER'}
                                                        onChange={() => handleStatusChange('MASTER')}
                                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <InputLabel htmlFor="status_master" value="MASTER" className="ml-2 !text-sm !font-normal" />
                                                </div>

                                                {/* Checkbox COPY */}
                                                <div className="flex items-center">
                                                    <input
                                                        id="status_copy"
                                                        type="checkbox"
                                                        value="COPY"
                                                        checked={data.status_dokumen === 'COPY'}
                                                        onChange={() => handleStatusChange('COPY')}
                                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <InputLabel htmlFor="status_copy" value="COPY" className="ml-2 !text-sm !font-normal" />
                                                </div>
                                            </div>
                                            <InputError message={errors.status_dokumen} className="mt-2" />
                                        </div>
                                        
                                        {/* Copy No */}
                                        <div>
                                            <InputLabel htmlFor="copy_no" value="Copy No." />
                                            <TextInput
                                                id="copy_no"
                                                type="text"
                                                value={data.copy_no}
                                                onChange={(e) => setData("copy_no", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.copy_no} className="mt-2" />
                                        </div>

                                        {/* Nomor Revisi */}
                                        <div>
                                            <InputLabel htmlFor="nomor_revisi" value="No. Revisi" />
                                            <TextInput
                                                id="nomor_revisi"
                                                type="text"
                                                value={data.nomor_revisi}
                                                onChange={(e) => setData("nomor_revisi", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.nomor_revisi} className="mt-2" />
                                        </div>

                                        {/* Nomor Edisi */}
                                        <div>
                                            <InputLabel htmlFor="nomor_edisi" value="No. Edisi" />
                                            <TextInput
                                                id="nomor_edisi"
                                                type="text"
                                                value={data.nomor_edisi}
                                                onChange={(e) => setData("nomor_edisi", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.nomor_edisi} className="mt-2" />
                                        </div>

                                        {/* Tanggal Efektif */}
                                        <div>
                                            <InputLabel htmlFor="tanggal_efektif" value="Tanggal Efektif" />
                                            <TextInput
                                                id="tanggal_efektif"
                                                type="date"
                                                value={data.tanggal_efektif}
                                                onChange={(e) => setData("tanggal_efektif", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.tanggal_efektif} className="mt-2" />
                                        </div>

                                        {/* Lokasi */}
                                        <div>
                                            <InputLabel htmlFor="lokasi" value="Lokasi" />
                                            <TextInput
                                                id="lokasi"
                                                type="text"
                                                value={data.lokasi}
                                                onChange={(e) => setData("lokasi", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.lokasi} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* INFORMASI PIHAK */}
                                    <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">Pihak yang Bersangkutan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Nama Penerima */}
                                        <div>
                                            <InputLabel htmlFor="nama_penerima" value="Nama Penerima" />
                                            <TextInput
                                                id="nama_penerima"
                                                type="text"
                                                value={data.nama_penerima}
                                                onChange={(e) => setData("nama_penerima", e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.nama_penerima} className="mt-2" />
                                        </div>

                                        {/* Jabatan */}
                                        <div>
                                            <InputLabel htmlFor="jabatan_pengirim" value="Jabatan Pengirim" />
                                            <TextInput
                                                id="jabatan_pengirim"
                                                type="text"
                                                value={data.jabatan_pengirim}
                                                onChange={(e) => setData("jabatan_pengirim", e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.jabatan_pengirim} className="mt-2" />
                                        </div>

                                        {/* Nama Pengirim */}
                                        <div>
                                            <InputLabel htmlFor="nama_pengirim" value="Nama Pengirim" />
                                            <TextInput
                                                id="nama_pengirim"
                                                type="text"
                                                value={data.nama_pengirim}
                                                onChange={(e) => setData("nama_pengirim", e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.nama_pengirim} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* ITEM DETAIL */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-4">Daftar Barang</h3>

                                    <div className="space-y-4">

                                        {data.items.map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-6 gap-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                                            >
                                                {/* Nama Item */}
                                                <div className="md:col-span-2">
                                                    <InputLabel value="Nama Barang" />
                                                    <TextInput
                                                        value={row.item_nama}
                                                        onChange={(e) => updateItem(index, "item_nama", e.target.value)}
                                                        className="mt-1 block w-full"
                                                        required
                                                    />
                                                    <InputError message={errors[`items.${index}.item_nama`]} />
                                                </div>

                                                {/* Merk */}
                                                <div>
                                                    <InputLabel value="Merk" />
                                                    <TextInput
                                                        value={row.item_merk}
                                                        onChange={(e) => updateItem(index, "item_merk", e.target.value)}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>

                                                {/* Jumlah */}
                                                <div>
                                                    <InputLabel value="Jumlah" />
                                                    <TextInput
                                                        value={row.jumlah}
                                                        onChange={(e) => updateItem(index, "jumlah", e.target.value)}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>

                                                {/* Keadaan */}
                                                <div>
                                                    <InputLabel value="Keadaan" />
                                                    <TextInput
                                                        value={row.keadaan}
                                                        onChange={(e) => updateItem(index, "keadaan", e.target.value)}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>
                                                
                                                {/* Cek - Checkbox */}
                                                <div className="flex items-center justify-start pt-6">
                                                    <input
                                                        id={`cek-${index}`}
                                                        type="checkbox"
                                                        checked={row.cek}
                                                        onChange={(e) => updateItem(index, "cek", e.target.checked)}
                                                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <InputLabel htmlFor={`cek-${index}`} value="Sudah Cek" className="ml-2 !text-sm !font-normal" />
                                                </div>

                                                {/* Hapus Row */}
                                                <div className="md:col-span-6 flex justify-end">
                                                    {data.items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                            Hapus Baris
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Tambah Row */}
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm"
                                        >
                                            <PlusCircleIcon className="w-5 h-5" />
                                            Tambah Barang
                                        </button>
                                    </div>
                                </div>

                                {/* TOMBOL */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Link
                                        href={route("serah-terima.index")}
                                        className="py-2 px-4 bg-gray-100 text-gray-800 rounded shadow hover:bg-gray-200 text-sm"
                                    >
                                        Batal
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="py-2 px-4 bg-teal-600 text-white rounded shadow hover:bg-teal-700 text-sm disabled:opacity-50"
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