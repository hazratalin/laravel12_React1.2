import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ArrowBigLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import { toast } from 'sonner';

// Type definitions
interface Role {
    id: number;
    name: string;
}

interface Flash {
    success?: string;
    danger?: string;
}

interface EditProps {
    role: Role;
    rolePermissions: string[];
    Permissions: string[];
}

type UserForm = {
    name: string;
    permissions: string[];
};

export default function Edit({ role, rolePermissions, Permissions }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<UserForm>({
        name: role.name || '',
        permissions: rolePermissions || [],
    });

    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.danger) toast.error(flash.danger);
    }, [flash.success, flash.danger]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (processing) return;
        put(route('roles.update', role.id));
    };

    function handleCheckboxChange(permissionName: string, checked: boolean) {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((name) => name !== permissionName),
            );
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Roles', href: '/roles' },
        { title: `Edit: ${role.name}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role - ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link
                        href={route('roles.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                </div>

                <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
                    <form className="space-y-6" onSubmit={submit}>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            Edit Role - {role.name}
                        </h2>

                        {/* Role Name Input */}
                        <div>
                            <Label htmlFor="name" className="mb-1 block text-sm font-medium">
                                Role Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter Role Name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Permissions */}
                        <div>
                            <Label className="mb-2 block text-sm font-medium">Assign Permissions</Label>

                            <div className="grid max-h-60 grid-cols-1 gap-3 overflow-y-auto rounded-md border bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-3 dark:bg-gray-800">
                                {Permissions.map((permission) => {
                                    const id = `permission-${permission}`;
                                    return (
                                        <label
                                            key={permission}
                                            htmlFor={id}
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <Input
                                                id={id}
                                                value={permission}
                                                type="checkbox"
                                                checked={data.permissions.includes(permission)}
                                                onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                                className="h-4 w-4"
                                            />
                                            <span className="capitalize">{permission.replaceAll('_', ' ')}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            <InputError message={errors.permissions} />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Update Role
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
