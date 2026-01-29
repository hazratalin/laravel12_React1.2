import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Head, Link, usePage, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Eye } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    image_url?: string;
    roles: { id: number; name: string }[];
}

interface Flash {
    success?: string;
    danger?: string;
}

export default function Index({ users }: { users: User[] }) {
    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleDelete = (userId: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This user will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', userId), {
                    onSuccess: () => {
                        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error', 'Failed to delete the user.', 'error');
                    },
                });
            }
        });
    };

    const bgColors = useMemo(
        () => [
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-emerald-500',
        ],
        []
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    {can('user-create') && (
                        <Link
                            href={route('users.create')}
                            className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Create User
                        </Link>
                    )}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableCaption>A list of all users.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.id}</TableCell>
                                        <TableCell>
                                            <img
    src={user.image_url || '/images/fallback.jpg'}
    onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = '/images/fallback.jpg';
    }}
    alt={`Profile picture of ${user.name}`}
    className="h-10 w-10 rounded-full object-cover transition-transform duration-500 ease-in-out hover:scale-150"
/>


                                            {/* <img
                                                src={user.image}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src = '/images/fallback.jpg';
                                                }}
                                                alt={`Profile picture of ${user.name}`}
                                                className="h-10 w-10 rounded-full object-cover transition-transform duration-500 ease-in-out hover:scale-150"
                                            /> */}
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="flex flex-wrap gap-1">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role, index) => {
                                                    const bgColor =
                                                        bgColors[index % bgColors.length];
                                                    return (
                                                        <span
                                                            key={role.id}
                                                            className={`rounded px-2 py-0.5 text-xs font-medium text-white ${bgColor}`}
                                                        >
                                                            {role.name}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-sm text-gray-400">No roles</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {can('user-view') && (
                                                <Link
                                                    href={route('users.show', user.id)}
                                                    className="mr-4 inline-flex items-center text-gray-500 hover:text-purple-600"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    Show
                                                </Link>
                                            )}
                                            {can('user-edit') && (
                                                <Link
                                                    href={route('users.edit', user.id)}
                                                    className="mr-4 inline-flex items-center text-indigo-500 hover:text-indigo-600"
                                                >
                                                    <Pencil className="mr-1 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            )}
                                            {can('user-delete') && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
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
            </div>
        </AppLayout>
    );
}
