import Pagination from '@/components/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { BsArrowDown, BsArrowsExpand, BsArrowUp } from 'react-icons/bs';
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

interface Project {
    id: number;
    name: string;
    image_path: string;
    status: keyof typeof PROJECT_STATUS_TEXT_MAP;
    created_at: string;
    due_date: string;
    created_by: {
        name: string;
    };
}

interface PaginatedProjects {
    data: Project[];
    meta: {
        links: any[];
    };
}

type Props = {
    projects: PaginatedProjects;
    queryParams?: Record<string, any>;
};

/* ----------------------------------
   Component
-----------------------------------*/
export default function Index({ projects, queryParams = {} }: Props) {
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
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableCaption>A list of all Projects.</TableCaption>

                            {/* ---------- Headers ---------- */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px] cursor-pointer" onClick={() => sortChanged('id')}>
                                        ID
                                    </TableHead>
                                    <TableHead>Image</TableHead>

                                    {/* <TableHead className="w-[250px] cursor-pointer" onClick={() => sortChanged('name')}>
                                        Name
                                    </TableHead> */}

                                    {/* <TableHead className="cursor-pointer" onClick={() => sortChanged('status')}>
                                        Status
                                    </TableHead> */}

                                    <TableHead onClick={() => sortChanged('name')} className="flex cursor-pointer items-center gap-1 text-left">
                                        Name
                                        {queryParams.sort_field === 'name' ? (
                                            queryParams.sort_direction === 'asc' ? (
                                                <BsArrowUp className="h-3 w-3 text-indigo-600" />
                                            ) : (
                                                <BsArrowDown className="h-3 w-3 text-indigo-600" />
                                            )
                                        ) : (
                                            <BsArrowsExpand className="h-3 w-3 text-gray-400" />
                                        )}
                                    </TableHead>

                                    <TableHead
                                        onClick={() => sortChanged('status')}
                                        className="cursor-pointer text-center text-sm font-medium select-none hover:text-indigo-600"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Status
                                            <span className="text-xs text-gray-400">
                                                {queryParams.sort_field === 'status' ? (queryParams.sort_direction === 'asc' ? '▲' : '▼') : '↕'}
                                            </span>
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => sortChanged('created_at')}>
                                        Created
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => sortChanged('due_date')}>
                                        Due
                                    </TableHead>
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
                                                    src={project.image_path}
                                                    onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            </TableCell>

                                            <TableCell>{project.name}</TableCell>

                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
                                                >
                                                    {PROJECT_STATUS_TEXT_MAP[project.status]}
                                                </span>
                                            </TableCell>

                                            <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>

                                            <TableCell>{new Date(project.due_date).toLocaleDateString()}</TableCell>

                                            <TableCell>{project.created_by.name}</TableCell>

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

// import Pagination from '@/components/pagination';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from '@/constants';
// import AppLayout from '@/layouts/app-layout';
// import { can } from '@/lib/can';
// import { type BreadcrumbItem } from '@/types';
// import { Head, Link, router, usePage } from '@inertiajs/react';
// import { Pencil, Plus, Trash2 } from 'lucide-react';
// import { useEffect } from 'react';
// import { toast } from 'sonner';
// import Swal from 'sweetalert2';
// // Breadcrumbs
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Projects',
//         href: '/projects',
//     },
// ];

// // Flash message interface
// interface Flash {
//     success?: string;
//     danger?: string;
// }

// // Project interface
// interface Project {
//     id: number;
//     name: string;
//     image_path: string;
//     status: string;
//     created_at: string;
//     due_date: string;
//     created_by: {
//         name: string;
//     };
// }

// // Projects prop interface
// interface PaginatedProjects {
//     data: Project[];
//     meta: {
//         links: any[]; // You can type this more strictly if needed
//     };
// }

// // Component
// export default function Index({ projects, queryParams = null }: { projects: PaginatedProjects }) {
//     queryParams = queryParams || {};
//     const searchFieldChange = (name: string, value: string) => {
//         if (value) {
//             queryParams[name] = value;
//         } else {
//             delete queryParams[name];
//         }

//         router.get(route('projects.index'), queryParams);
//     };

//     const onKeyDownHandler = (name: string, e) => {
//         if (e.key !== 'Enter') return;

//         searchFieldChange(name, e.target.value);
//     };

//     const sortChanged = (name?: string) => {
//         if (name === queryParams.sort_Field) {
//             queryParams.sort_Direction = queryParams.sort_Direction === 'asc' ? 'desc' : 'asc';
//         } else if (name) {
//             queryParams.sort_Field = name;
//             queryParams.sort_Direction = 'asc';
//         }

//         router.get(route('projects.index'), queryParams);
//     };

//     const { flash } = usePage<{ flash: Flash }>().props;

//     // Handle flash messages
//     useEffect(() => {
//         if (flash.success) {
//             toast.success(flash.success);
//         } else if (flash.danger) {
//             toast.error(flash.danger);
//         }
//     }, [flash]);

//     // Delete handler
//     const handleDelete = (id: number) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'This project will be permanently deleted!',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Yes, delete it!',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 router.delete(route('projects.destroy', id), {
//                     onSuccess: () => {
//                         Swal.fire('Deleted!', 'The project has been deleted.', 'success');
//                     },
//                 });
//             }
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Projects" />

//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="flex justify-end">
//                     {can('user-create') && (
//                         <Link
//                             href={route('users.create')}
//                             className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
//                         >
//                             <Plus className="h-3.5 w-3.5" />
//                             Create Project
//                         </Link>
//                     )}
//                 </div>

//                 <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
//                     <div className="overflow-x-auto">
//                         <Table>
//                             <TableCaption>A list of all Projects.</TableCaption>

//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead onClick={(e) => sortChanged('id')} className="w-[50px]">
//                                         ID
//                                     </TableHead>
//                                     <TableHead className="px-3 py-2">Image</TableHead>
//                                     <TableHead onClick={(e) => sortChanged('name')} className="px-3 py-2">
//                                         Name
//                                     </TableHead>
//                                     <TableHead onClick={(e) => sortChanged('status')} className="px-3 py-2">
//                                         Status
//                                     </TableHead>
//                                     <TableHead onClick={(e) => sortChanged('created_at')} className="px-3 py-2">
//                                         Created Date
//                                     </TableHead>
//                                     <TableHead onClick={(e) => sortChanged('due_date')} className="px-3 py-2">
//                                         Due Date
//                                     </TableHead>
//                                     <TableHead className="px-3 py-2">Created By</TableHead>
//                                     <TableHead onClick={(e) => sortChanged()} className="text-right">
//                                         Actions
//                                     </TableHead>
//                                 </TableRow>
//                             </TableHeader>

//                             <TableHeader className="border-b-2 border-gray-500 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
//                                 <TableRow className="text-nowrap">
//                                     <TableHead className="w-[50px]"> </TableHead>
//                                     <TableHead className="px-3 py-2"></TableHead>
//                                     <TableHead className="px-3 py-2">
//                                         <Input
//                                             className="bg-accent w-full"
//                                             defaultValue={queryParams.name}
//                                             placeholder="Project Name"
//                                             onBlur={(e) => searchFiledChanged('name', e.target.value)}
//                                             onKeyDown={(e) => onKeyDownHandler('name', e)}
//                                         />
//                                     </TableHead>

//                                     <TableHead className="px-3 py-2">
//                                         <Select
//                                             defaultValue={queryParams.status || 'all'}
//                                             onValueChange={(value) => searchFieldChange('status', value === 'all' ? '' : value)}
//                                         >
//                                             <SelectTrigger className="w-full">
//                                                 <SelectValue placeholder="Select Status" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="all">Select Status</SelectItem>
//                                                 <SelectItem value="Pending">Pending</SelectItem>
//                                                 <SelectItem value="In_Progress">In Progress</SelectItem>
//                                                 <SelectItem value="Completed">Completed</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </TableHead>
//                                     {/* <TableHead className="px-3 py-2">
//   <select
//     className="w-full border rounded px-2 py-2 focus:outline-none focus:ring focus:ring-blue-300 bg-accent"
//     defaultValue={queryParams.status}
//     onChange={e => searchFieldChange('status', e.target.value)}

//   >
//     <option value="">Select Status</option>
//     <option value="Pending">Pending</option>
//     <option value="In_Progress">In Progress</option>
//     <option value="Completed">Completed</option>
//   </select>

// </TableHead> */}

//                                     <TableHead className="px-3 py-2"> </TableHead>
//                                     <TableHead className="px-3 py-2"></TableHead>
//                                     <TableHead className="px-3 py-2"></TableHead>
//                                     <TableHead className="text-right"></TableHead>
//                                 </TableRow>
//                             </TableHeader>

//                             <TableBody>
//                                 {projects.data.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={8} className="py-4 text-center text-gray-500">
//                                             No projects found.
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     projects.data.map((project) => (
//                                         <TableRow
//                                             key={project.id}
//                                             className="border-b bg-white transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
//                                         >
//                                             <TableCell className="font-medium">{project.id}</TableCell>

//                                             <TableCell>
//                                                 <img
//                                                     src={project.image_path}
//                                                     onError={(e) => {
//                                                         e.currentTarget.src = '/images/fallback.jpg';
//                                                     }}
//                                                     alt={`Image for ${project.name}`}
//                                                     title={project.name}
//                                                     className="h-10 w-10 rounded-full object-cover transition-transform duration-500 ease-in-out hover:scale-150"
//                                                 />
//                                             </TableCell>

//                                             <TableCell>{project.name}</TableCell>
//                                             <TableCell>
//                                                 <span
//                                                     className={`rounded px-2 py-1 text-sm font-semibold text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
//                                                 >
//                                                     {PROJECT_STATUS_TEXT_MAP[project.status]}
//                                                 </span>
//                                             </TableCell>
//                                             <TableCell className="text-nowrap">{new Date(project.created_at).toLocaleDateString()}</TableCell>
//                                             <TableCell className="text-nowrap">{new Date(project.due_date).toLocaleDateString()}</TableCell>
//                                             <TableCell>{project.created_by.name}</TableCell>

//                                             <TableCell className="text-right whitespace-nowrap">
//                                                 <Link
//                                                     href={route('projects.edit', project.id)}
//                                                     className="mr-4 inline-flex items-center text-indigo-500 hover:text-indigo-600"
//                                                 >
//                                                     <Pencil className="mr-1 h-4 w-4" />
//                                                     Edit
//                                                 </Link>

//                                                 <button
//                                                     onClick={() => handleDelete(project.id)}
//                                                     className="inline-flex cursor-pointer items-center text-red-500 hover:text-red-600"
//                                                 >
//                                                     <Trash2 className="mr-1 h-4 w-4" />
//                                                     Delete
//                                                 </button>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </div>
//                     <div className="p-4">
//                         <Pagination links={projects.meta.links} />
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
