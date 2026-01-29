import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link, usePage, router } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { LoaderCircle, ArrowBigLeft } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Edit',
        href: '/users',
    },
];

type UserForm = {
    name: string;
    email: string;
    password: string;
    roles: string[];
};

interface User {
    id: number;
    name: string;
    email: string;
    image_url?: string;
}

interface Flash {
    success?: string;
    danger?: string;
}

export default function Edit({
    user,
    roles,
    userRoles,
}: {
    user: User;
    roles: string[];
    userRoles: string[];
}) {
    const { data, setData, processing, errors } = useForm<UserForm>({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        roles: userRoles ?? [],
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCheckboxChange = (roleName: string, checked: boolean) => {
        setData(
            'roles',
            checked
                ? [...data.roles, roleName]
                : data.roles.filter((name) => name !== roleName),
        );
    };

    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.danger) {
            toast.error(flash.danger);
        }
    }, [flash.success, flash.danger]);

const submit: FormEventHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'put'); // ← ✅ Add this inside the formData
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    if (image) {
        formData.append('image', image);
    }

    data.roles.forEach((role, index) => {
        formData.append(`roles[${index}]`, role);
    });

    router.post(route('users.update', user.id), formData, {
        forceFormData: true,
        preserveScroll: true,
    });
};


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-4 w-4" />
                        Back
                    </Link>
                </div>

                <section className="mx-auto max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter email"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Leave blank to keep current password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <Label htmlFor="image">Image</Label>
                            <Input id="image" type="file" onChange={handleFileChange} />
                            <div className="mt-2 flex gap-3 items-center">
                                {/* Old Image */}
                                {user.image_url && (
                                    <img
                                        src={user.image_url}
                                        alt={user.name}
                                        className={`h-20 w-20 rounded-full object-cover border ${
                                            imagePreview ? 'opacity-30' : ''
                                        }`}
                                    />
                                )}

                                {/* New Preview */}
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Image Preview"
                                        className="h-20 w-20 rounded-full object-cover border"
                                    />
                                )}
                            </div>
                            {/* <InputError message={errors.image_url} /> */}
                        </div>

                        {/* Roles */}
                        <div>
                            <Label className="mb-2 block text-sm font-medium">Assign Roles</Label>
                            <div className="grid max-h-60 grid-cols-1 gap-3 overflow-y-auto rounded-md border bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-3 dark:bg-gray-800">
                                {roles.map((role) => (
                                    <label
                                        key={role}
                                        htmlFor={role}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        <Input
                                            id={role}
                                            type="checkbox"
                                            value={role}
                                            checked={data.roles.includes(role)}
                                            onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        <span className="capitalize">{role.replaceAll('_', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.roles} />
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Update User
                        </Button>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
