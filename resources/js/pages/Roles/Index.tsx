import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { can } from '@/lib/can';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Flash {
    success?: string;
    danger?: string;
}

export default function Index({ roles }: { roles: Role[] }) {
    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This role will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('roles.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Deleted!', 'The role has been deleted.', 'success');
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    {can('roles.create') && (
                        <Link
                            href={route('roles.create')}
                            className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Create Role
                        </Link>
                    )}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table>
                        <TableCaption>A list of all roles.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.id}</TableCell>
                                    <TableCell>{role.name}</TableCell>

                                    <TableCell className="flex flex-wrap gap-1">
                                        {role.permissions.map((permission, index) => {
                                            const bgColors = [
                                                'bg-blue-500',
                                                'bg-green-500',
                                                'bg-yellow-500',
                                                'bg-red-500',
                                                'bg-purple-500',
                                                'bg-pink-500',
                                                'bg-indigo-500',
                                                'bg-emerald-500',
                                            ];
                                            const bgColor = bgColors[index % bgColors.length];

                                            return (
                                                <span key={permission.id} className={`rounded px-2 py-0.5 text-xs font-medium text-white ${bgColor}`}>
                                                    {permission.name}
                                                </span>
                                            );
                                        })}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {can('roles.view') && (
                                            <Link
                                                href={route('roles.show', role.id)}
                                                className="mr-4 inline-flex items-center text-gray-500 hover:text-purple-600"
                                            >
                                                <Eye className="mr-1 h-4 w-4" />
                                                Show
                                            </Link>
                                        )}

                                        {can('roles.edit') && (
                                            <Link
                                                href={route('roles.edit', role.id)}
                                                className="mr-4 inline-flex items-center text-indigo-500 hover:text-indigo-600"
                                            >
                                                <Pencil className="mr-1 h-4 w-4" />
                                                Edit
                                            </Link>
                                        )}
                                        {can('roles.delete') && (
                                            <button
                                                onClick={() => handleDelete(role.id)}
                                                className="inline-flex cursor-pointer items-center text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Delete
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
