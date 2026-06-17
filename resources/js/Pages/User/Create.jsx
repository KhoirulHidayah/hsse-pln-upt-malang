import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Plus, X, Save, Users } from "lucide-react";

export default function Create({ auth, garduList }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "pemeriksa",
        gardu_induk_id: "",
    });

    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("user.store"), {
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Plus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Tambah User</h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Tambah akun admin atau pemeriksa</p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah User" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Nama Lengkap" className={labelStyle} />
                                        <TextInput id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} className={inputStyle} isFocused placeholder="Contoh: Admin PLN" />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="username" value="Username" className={labelStyle} />
                                        <TextInput id="username" value={data.username} onChange={(e) => setData("username", e.target.value)} className={inputStyle} placeholder="Contoh: adminpln" />
                                        <InputError message={errors.username} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email" className={labelStyle} />
                                        <TextInput id="email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} className={inputStyle} placeholder="contoh@email.com" />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="role" value="Role" className={labelStyle} />
                                        <select id="role" value={data.role} onChange={(e) => setData({ ...data, role: e.target.value, gardu_induk_id: e.target.value === "admin" ? "" : data.gardu_induk_id })} className={inputStyle}>
                                            <option value="admin">Admin</option>
                                            <option value="pemeriksa">Pemeriksa</option>
                                        </select>
                                        <InputError message={errors.role} className="mt-1" />
                                    </div>

                                    {data.role === "pemeriksa" && (
                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="gardu_induk_id" value="Gardu Induk Pemeriksa" className={labelStyle} />
                                            <select id="gardu_induk_id" value={data.gardu_induk_id} onChange={(e) => setData("gardu_induk_id", e.target.value)} className={inputStyle}>
                                                <option value="">Pilih Gardu Induk</option>
                                                {garduList.map((gardu) => (
                                                    <option key={gardu.gardu_induk_id} value={gardu.gardu_induk_id}>{gardu.nama_gardu_induk}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.gardu_induk_id} className="mt-1" />
                                        </div>
                                    )}

                                    <div>
                                        <InputLabel htmlFor="password" value="Password" className={labelStyle} />
                                        <TextInput id="password" type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} className={inputStyle} placeholder="Minimal 8 karakter" />
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className={labelStyle} />
                                        <TextInput id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} className={inputStyle} placeholder="Ulangi password" />
                                        <InputError message={errors.password_confirmation} className="mt-1" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link href={route("user.index")} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
                                        <X className="h-4 w-4" /> Batal
                                    </Link>
                                    <button type="submit" disabled={processing} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all disabled:opacity-50">
                                        <Save className="h-4 w-4" /> Simpan
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
