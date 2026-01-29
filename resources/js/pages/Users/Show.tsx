
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowBigLeft } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  // password is omitted from display intentionally
}

export default function Show({ user }: { user: User }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Users',
      href: '/users',
    },
    {
      title: user.name,
      href: '#',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Details" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Back Button */}
        <div className="flex justify-end">
          <Link
            href={route('users.index')}
            className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
          >
            <ArrowBigLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>

        {/* User Info Card */}
        <div className="mt-4 border p-6 rounded shadow bg-white max-w-md space-y-4">
          <h2 className="text-lg font-semibold">User Information</h2>
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-gray-700">ID</dt>
              <dd className="text-gray-900">{user.id}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Name</dt>
              <dd className="text-gray-900">{user.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Email</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
          </dl>
        </div>
      </div>
    </AppLayout>
  );
}
