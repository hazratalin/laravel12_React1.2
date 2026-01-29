import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function Categories() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
          <div className="container ms-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2x1 font-bold">Categories</h1>

                <Link
  href={route('posts.create')}
  className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
>
  <Plus className="w-3.5 h-3.5" />
  Create Post
</Link>

              </div>
        <div className="overflow-x-auto">
            <table className="table-auto w-full shadow-lg bg-white dark:bg-neutral-800 rounded-lg">
                <thead> 
                    <tr className="bg-neutral-50 dark:bg-neutral-700">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Category Name</th>
                        <th className="px-4 py-2">Created At</th>
                        <th className="px-4 py-2">Updated At</th>                     
                        <th className="px-4 py-2">Action</th>                     
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                       
                        <td className="px-4 py-2">
                            <button className="text-blue-500 hover:underline">Edit</button>
                            <button className="text-red-500 hover:underline ml-2">Delete</button>
                        </td>
                    </tr>       
                    </tbody>
                </table>
        </div>
          </div>
        </AppLayout>
    );
}
