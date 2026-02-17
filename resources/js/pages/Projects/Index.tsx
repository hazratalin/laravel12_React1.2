import Pagination from '@/components/pagination';
import TableHeading from '@/components/TableHeading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem, type Project } from '@/types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
/* ----------------------------------
   Breadcrumbs
-----------------------------------*/
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

/* ----------------------------------
   Interfaces
-----------------------------------*/
interface Flash {
    success?: string;
    danger?: string;
}

interface PaginatedProjects {
    data: Project[];
    meta: {
        links: any[];
    };
}

/* ----------------------------------
   Component
-----------------------------------*/
// export default function Index({ projects, queryParams = {} }: Props) {
export default function Index({ projects, queryParams }: { projects: PaginatedProjects; queryParams?: Record<string, any> }) {
    // Ensure it's always an object
    queryParams = queryParams || {};

    const { flash } = usePage<{ flash: Flash }>().props;

    /* ----------------------------------
       Helpers
    -----------------------------------*/
    const searchFieldChange = (name: string, value: string) => {
        const params = { ...queryParams };

        if (value) {
            params[name] = value;
        } else {
            delete params[name];
        }

        router.get(route('projects.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const onKeyDownHandler = (name: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchFieldChange(name, e.currentTarget.value);
        }
    };

    const sortChanged = (name?: string) => {
        const params = { ...queryParams };

        if (!name) return;

        if (params.sort_field === name) {
            params.sort_direction = params.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            params.sort_field = name;
            params.sort_direction = 'asc';
        }

        router.get(route('projects.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    /* ----------------------------------
       Flash Messages
    -----------------------------------*/
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.danger) {
            toast.error(flash.danger);
        }
    }, [flash]);

    /* ----------------------------------
       Delete
    -----------------------------------*/
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This project will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('projects.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Deleted!', 'The project has been deleted.', 'success');
                    },
                });
            }
        });
    };

    const formatDate = (date?: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    /* ----------------------------------
       Render
    -----------------------------------*/
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    {can('user-create') && (
                        <Link
                            href={route('projects.create')}
                            className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Create Project
                        </Link>
                    )}

                    <Link
                        href={route('projects.create')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add New
                    </Link>
                </div>

                {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableCaption>A list of all Projects.</TableCaption>

                            {/* ---------- Headers ---------- */}
                            <TableHeader>
                                <TableRow>
                                    {/* npm install @heroicons/react -s */}
                                    <TableHead onClick={() => sortChanged('id')}>
                                        <div className="flex cursor-pointer items-center justify-between gap-1 px-3 py-3">
                                            ID
                                            <div>
                                                <ChevronUpIcon className="w-4" />
                                                <ChevronDownIcon className="-mt-2 w-4" />
                                            </div>
                                        </div>
                                    </TableHead>

                                    <TableHead>Image</TableHead>

                                    <TableHeading
                                        name="name"
                                        sort_field={queryParams.sort_field}
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}
                                    >
                                        Name
                                    </TableHeading>
                                    <TableHeading
                                        name="status"
                                        sort_field={queryParams.sort_field}
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}
                                    >
                                        Status
                                    </TableHeading>

                                    <TableHeading
                                        name="created_at"
                                        sort_field={queryParams.sort_field}
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}
                                    >
                                        Created At
                                    </TableHeading>
                                    <TableHeading
                                        name="due_date"
                                        sort_field={queryParams.sort_field}
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}
                                    >
                                        Due Date
                                    </TableHeading>

                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>

                                {/* ---------- Filters ---------- */}
                                <TableRow>
                                    <TableHead />
                                    <TableHead />
                                    <TableHead>
                                        <Input
                                            className="bg-accent w-full"
                                            defaultValue={queryParams.name ?? ''}
                                            placeholder="Project Name"
                                            onBlur={(e) => searchFieldChange('name', e.target.value)}
                                            onKeyDown={(e) => onKeyDownHandler('name', e)}
                                        />
                                    </TableHead>

                                    <TableHead>
                                        <Select
                                            defaultValue={queryParams.status ?? 'all'}
                                            onValueChange={(value) => searchFieldChange('status', value === 'all' ? '' : value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="In_Progress">In Progress</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableHead>

                                    <TableHead />
                                    <TableHead />
                                    <TableHead />
                                    <TableHead />
                                </TableRow>
                            </TableHeader>

                            {/* ---------- Body ---------- */}
                            <TableBody>
                                {projects.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-4 text-center text-gray-500">
                                            No projects found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    projects.data.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>{project.id}</TableCell>

                                            <TableCell>
                                                <img
                                                    src={project.image_path || '/images/fallback.jpg'}
                                                    onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            </TableCell>

                                            <TableCell className="hover:underline">
                                                <Link href={route('projects.show', project.id)}>{project.name}</Link>
                                            </TableCell>

                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
                                                >
                                                    {PROJECT_STATUS_TEXT_MAP[project.status]}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-nowrap">{formatDate(project.created_at)}</TableCell>
                                            <TableCell className="text-nowrap">{formatDate(project.due_date)}</TableCell>

                                            <TableCell>{project.created_by?.name ?? '—'}</TableCell>

                                            <TableCell className="space-x-4 text-right">
                                                <Link
                                                    href={route('projects.edit', project.id)}
                                                    className="inline-flex items-center text-indigo-500 hover:text-indigo-600"
                                                >
                                                    <Pencil className="mr-1 h-4 w-4" />
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="inline-flex cursor-pointer items-center text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                    Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4">
                        <Pagination links={projects.meta.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
