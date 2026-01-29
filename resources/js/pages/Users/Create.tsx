import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link, usePage, router } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';


import { ArrowBigLeft } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Create',
        href: '/users',
    },
];

type UserForm = {
    name: string;
    email: string;
    password: string;
    image: File | null;
    roles: string[];


};


interface Flash {
    success?: string;
    danger?: string;
}

interface CreateProps {
    roles: string[];
}

export default function Create({ roles }: CreateProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { data, setData, post, processing, errors } = useForm<Required<UserForm>>({
        name: '',
        email: '',
        password: '',
        image: null,
        roles: [],

    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file)); // 👈 generate preview URL
        }
    };


    function handleCheckboxChange(roleName: string, checked: boolean) {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData(
                'roles',
                data.roles.filter((name) => name !== roleName),
            );
        }
    }

    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Create" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <div className="flex justify-end">
                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" />
                        back
                    </Link>
                </div>

                {/* <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min"> */}




                <section className="mx-auto max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-900">

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter Name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter Email"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                <Input id="image" type="file" onChange={handleFileChange} />
                                {imagePreview && <img src={imagePreview} alt="Image Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />}
                                <InputError message={errors.image} />
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
                                                value={role}
                                                type="checkbox"
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

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Store
                            </Button>
                        </div>
                    </form>
                </section>

                {/* </div> */}


            </div>
        </AppLayout>
    );
}
