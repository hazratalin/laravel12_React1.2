import Pagination from '@/components/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

// Define a type for a single post to ensure type-safety.
export type Post = {
    id: number;
    title: string;
    content: string;
    image: string;
    created_at: string;
    updated_at: string;
};

// Define a type for the pagination links to ensure type-safety.
export type LinkItem = {
    url: string | null;
    label: string;
    active: boolean;
};

// Define a type for the posts prop, which includes pagination data.
export type PostsPaginated = {
    data: Post[];
    links: LinkItem[];
};

interface Flash {
    success?: string;
    danger?: string;
}

export default function PostIndex({ posts, filters }: { posts: PostsPaginated; filters: { search?: string } }) {
    const { processing, data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('posts.index'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleDelete = (id: number, title: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `This post id - ${id} will be permanently deleted!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('posts.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Deleted!', `The post "${title}" has been deleted.`, 'success');
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />

            <style>
                {`
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animated-gradient {
          border: 1px solid rgba(0, 255, 255, 0.6);
            // background: linear-gradient(45deg, magenta, blue, violet);
            background: linear-gradient(45deg, magenta, blue, violet);
            // background: linear-gradient(90deg, #00eaff, #00cfff);
            background-size: 300% 300%;
            animation: gradientAnimation 3s ease infinite;
            transition: background 0.3s ease;
          }
        `}
            </style>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    {/* 🔍 Filter Form */}
                    <form onSubmit={handleFilter} className="mr-4 flex items-center gap-2">
                        <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="rounded border px-3 py-1 text-sm"
                            />

                            {/* ❌ Clear button — only shown when there's input */}
                            {data.search && (
                                <button
                                    type="button"
                                    onClick={() => setData('search', '')}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="animated-gradient inline-flex items-center gap-1 rounded px-3 py-1 text-sm text-white transition-all duration-200 hover:brightness-110"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button>
                        {/* <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button> */}
                    </form>

                    <Link
                        href={route('posts.create')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Create Post
                    </Link>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table>
                        {/* <TableCaption>A list of your recent posts.</TableCaption> */}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.data.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.id}</TableCell>
                                    <TableCell>{post.title}</TableCell>
                                    <TableCell>
                                        <img
                                            src={post.image}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/fallback.jpg'; // put a fallback image in public/images/
                                            }}
                                            alt={post.title}
                                            className="h-10 w-10 rounded-full object-cover transition-transform duration-500 ease-in-out hover:scale-150"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            href={route('posts.edit', post.id)}
                                            className="mr-4 inline-flex items-center text-indigo-500 hover:text-indigo-600"
                                        >
                                            <Pencil className="mr-1 h-4 w-4" />
                                            Edit
                                        </Link>

                                        <button
                                            disabled={processing}
                                            onClick={() => handleDelete(post.id, post.title)}
                                            className="inline-flex cursor-pointer items-center text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <span>
                    {/* Pagination component can be placed here */}
                    <Pagination links={posts.links} />
                </span>
                {/* <div className="px-4 py-12">
                    {posts.links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                // className={`p-1 mx-1 ${link.active ? 'text-blue-500 font-bold' : ''}`}
                                className={`mx-1 inline-block rounded-full px-4 py-2 text-sm ${link.active ? 'border-gray-300 bg-indigo-600 font-semibold text-white hover:bg-gray-700 hover:text-gray-100' : 'text-gray-500 hover:bg-gray-100'} ${!link.url && 'cursor-not-allowed opacity-50'}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Link>
                        ) : (
                            <span key={link.label} className="mx-1 p-1 text-slate-300" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        ),
                    )}
                </div> */}
            </div>
        </AppLayout>
    );
}
