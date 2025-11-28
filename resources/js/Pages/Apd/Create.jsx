import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function Create({ auth, jenisApds }) {
    const { data, setData, post, errors, reset } = useForm({
        jenis_id: "",
        nama_apd: "",
        kode_apd: "",
        deskripsi: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("apd.store"), {
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
                        Tambah Data APD
                    </h2>
                </div>
            }
        >
            <Head title="Tambah APD" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                            >
                                {/* Jenis APD */}
                                <div className="mb-4">
                                    <InputLabel htmlFor="jenis_id" value="Jenis APD" />
                                    <select
                                        id="jenis_id"
                                        name="jenis_id"
                                        value={data.jenis_id}
                                        onChange={(e) => setData("jenis_id", e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Jenis APD --</option>
                                        {jenisApds.map((jenis) => (
                                            <option key={jenis.id} value={jenis.id}>
                                                {jenis.nama_jenis}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.jenis_id} className="mt-2" />
                                </div>

                                {/* Nama APD */}
                                <div>
                                    <InputLabel htmlFor="nama_apd" value="Nama APD" />
                                    <TextInput
                                        id="nama_apd"
                                        type="text"
                                        name="nama_apd"
                                        value={data.nama_apd}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData("nama_apd", e.target.value)}
                                    />
                                    <InputError message={errors.nama_apd} className="mt-2" />
                                </div>

                                {/* Kode APD */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="kode_apd" value="Kode APD" />
                                    <TextInput
                                        id="kode_apd"
                                        type="text"
                                        name="kode_apd"
                                        value={data.kode_apd}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("kode_apd", e.target.value)}
                                    />
                                    <InputError message={errors.kode_apd} className="mt-2" />
                                </div>

                                {/* Deskripsi */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="deskripsi" value="Deskripsi" />
                                    <TextAreaInput
                                        id="deskripsi"
                                        name="deskripsi"
                                        value={data.deskripsi}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("deskripsi", e.target.value)}
                                    />
                                    <InputError message={errors.deskripsi} className="mt-2" />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="mt-6 flex justify-end space-x-2">
                                    <Link
                                        href={route("apd.index")}
                                        className="min-w-[100px] py-2 px-4 text-center bg-gray-100 text-gray-800 rounded shadow transition-all hover:bg-gray-200 text-sm"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        className="min-w-[100px] py-2 px-4 bg-blue-600 text-white rounded shadow transition-all hover:bg-blue-700 text-sm"
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
