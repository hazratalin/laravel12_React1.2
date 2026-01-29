import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowBigLeft } from 'lucide-react';

interface ShowProps {
    role: {
        id: number;
        name: string;
    };
    permissions: string[];
}

export default function Show({ role, permissions }: ShowProps) {
    return (
        <AppLayout>
            <Head title={`View Role - ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Role Details</h1>
                    <Link
                        href={route('roles.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                </div>

                <section className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Role Name</h2>
                        <p className="text-gray-700 dark:text-gray-300">{role.name}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Permissions</h2>
                        {permissions.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                {permissions.map((perm) => (
                                    <li key={perm}>{perm.replaceAll('_', ' ')}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No permissions assigned.</p>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
