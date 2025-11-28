import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function Edit({ auth, lokasi }) {
    const { data, setData, put, errors, processing } = useForm({
        nama_lokasi: lokasi.nama_lokasi || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("lokasi.update", lokasi.lokasi_id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                        Edit Lokasi
                    </h2>
                </div>
            }
        >
            <Head title="Edit Lokasi" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                            >
                                {/* Nama Lokasi */}
                                <div className="mb-4">
                                    <InputLabel htmlFor="nama_lokasi" value="Nama Lokasi" />
                                    <TextInput
                                        id="nama_lokasi"
                                        type="text"
                                        name="nama_lokasi"
                                        value={data.nama_lokasi}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData("nama_lokasi", e.target.value)}
                                    />
                                    <InputError message={errors.nama_lokasi} className="mt-2" />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="mt-6 flex justify-end space-x-2">
                                    <Link
                                        href={route("lokasi.index")}
                                        className="min-w-[100px] py-2 px-4 text-center bg-gray-100 text-gray-800 rounded shadow transition-all hover:bg-gray-200 text-sm"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[100px] py-2 px-4 bg-blue-600 text-white rounded shadow transition-all hover:bg-blue-700 text-sm disabled:opacity-50"
                                    >
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
