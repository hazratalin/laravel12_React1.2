import { TASK_STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import TasksTable from './TasksTable';
/* ----------------------------------
   Breadcrumbs
-----------------------------------*/
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

/* ----------------------------------
   Interfaces
-----------------------------------*/

interface Task {
    id: number;
    name: string;
    image_path: string;
    status: keyof typeof TASK_STATUS_TEXT_MAP;
    created_at: string;
    due_date: string;
    created_by: {
        name: string;
    };
}

interface PaginatedTasks {
    data: Task[];
    meta: {
        links: any[];
    };
}

/* ----------------------------------
   Component
-----------------------------------*/
// export default function Index({ tasks, queryParams = {} }: Props) {
export default function Index({ tasks, queryParams }: { tasks: PaginatedTasks; queryParams?: Record<string, any> }) {
    /* ----------------------------------
       Render
    -----------------------------------*/
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    {can('users.create') && (
                        <Link
                            href={route('tasks.create')}
                            className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Create Task
                        </Link>
                    )}
                </div>

                {/* <pre>{JSON.stringify(tasks, null, 2)}</pre> */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <TasksTable tasks={tasks} queryParams={queryParams} />
                </div>
            </div>
        </AppLayout>
    );
}

// import Pagination from '@/components/pagination';
// import TableHeading from '@/components/TableHeading';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from '@/constants';
// import AppLayout from '@/layouts/app-layout';
// import { can } from '@/lib/can';
// import { type BreadcrumbItem } from '@/types';
// import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
// import { Head, Link, router, usePage } from '@inertiajs/react';
// import { Pencil, Plus, Trash2 } from 'lucide-react';
// import { useEffect } from 'react';
// import { toast } from 'sonner';
// import Swal from 'sweetalert2';
// /* ----------------------------------
//    Breadcrumbs
// -----------------------------------*/
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Tasks',
//         href: '/tasks',
//     },
// ];

// /* ----------------------------------
//    Interfaces
// -----------------------------------*/
// interface Flash {
//     success?: string;
//     danger?: string;
// }

// interface Task {
//     id: number;
//     name: string;
//     image_path: string;
//     status: keyof typeof TASK_STATUS_TEXT_MAP;
//     created_at: string;
//     due_date: string;
//     created_by: {
//         name: string;
//     };
// }

// interface PaginatedTasks {
//     data: Task[];
//     meta: {
//         links: any[];
//     };
// }

// /* ----------------------------------
//    Component
// -----------------------------------*/
// // export default function Index({ tasks, queryParams = {} }: Props) {
// export default function Index({ tasks, queryParams }: { tasks: PaginatedTasks; queryParams?: Record<string, any> }) {
//     // Ensure it's always an object
//     queryParams = queryParams || {};

//     const { flash } = usePage<{ flash: Flash }>().props;

//     /* ----------------------------------
//        Helpers
//     -----------------------------------*/
//     const searchFieldChange = (name: string, value: string) => {
//         const params = { ...queryParams };

//         if (value) {
//             params[name] = value;
//         } else {
//             delete params[name];
//         }

//         router.get(route('tasks.index'), params, {
//             preserveState: true,
//             replace: true,
//         });
//     };

//     const onKeyDownHandler = (name: string, e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             searchFieldChange(name, e.currentTarget.value);
//         }
//     };

//     const sortChanged = (name?: string) => {
//         const params = { ...queryParams };

//         if (!name) return;

//         if (params.sort_field === name) {
//             params.sort_direction = params.sort_direction === 'asc' ? 'desc' : 'asc';
//         } else {
//             params.sort_field = name;
//             params.sort_direction = 'asc';
//         }

//         router.get(route('tasks.index'), params, {
//             preserveState: true,
//             replace: true,
//         });
//     };

//     /* ----------------------------------
//        Flash Messages
//     -----------------------------------*/
//     useEffect(() => {
//         if (flash?.success) {
//             toast.success(flash.success);
//         }
//         if (flash?.danger) {
//             toast.error(flash.danger);
//         }
//     }, [flash]);

//     /* ----------------------------------
//        Delete
//     -----------------------------------*/
//     const handleDelete = (id: number) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'This task will be permanently deleted!',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Yes, delete it!',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 router.delete(route('tasks.destroy', id), {
//                     onSuccess: () => {
//                         Swal.fire('Deleted!', 'The task has been deleted.', 'success');
//                     },
//                 });
//             }
//         });
//     };

//     /* ----------------------------------
//        Render
//     -----------------------------------*/
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Tasks" />

//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="flex justify-end">
//                     {can('user-create') && (
//                         <Link
//                             href={route('tasks.create')}
//                             className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
//                         >
//                             <Plus className="h-3.5 w-3.5" />
//                             Create Task
//                         </Link>
//                     )}
//                 </div>

//                 {/* <pre>{JSON.stringify(tasks, null, 2)}</pre> */}
//                 <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
//                     <div className="overflow-x-auto">
//                         <Table>
//                             <TableCaption>A list of all Tasks.</TableCaption>

//                             {/* ---------- Headers ---------- */}
//                             <TableHeader>
//                                 <TableRow>
//                                     {/* npm install @heroicons/react -s */}
//                                     <TableHead onClick={() => sortChanged('id')}>
//                                         <div className="flex cursor-pointer items-center justify-between gap-1 px-3 py-3">
//                                             ID
//                                             <div>
//                                                 <ChevronUpIcon className="w-4" />
//                                                 <ChevronDownIcon className="-mt-2 w-4" />
//                                             </div>
//                                         </div>
//                                     </TableHead>

//                                     <TableHead>Image</TableHead>

//                                     <TableHeading
//                                         name="name"
//                                         sort_field={queryParams.sort_field}
//                                         sort_direction={queryParams.sort_direction}
//                                         sortChanged={sortChanged}
//                                     >
//                                         Name
//                                     </TableHeading>
//                                     <TableHeading
//                                         name="status"
//                                         sort_field={queryParams.sort_field}
//                                         sort_direction={queryParams.sort_direction}
//                                         sortChanged={sortChanged}
//                                     >
//                                         Status
//                                     </TableHeading>

//                                     <TableHeading
//                                         name="created_at"
//                                         sort_field={queryParams.sort_field}
//                                         sort_direction={queryParams.sort_direction}
//                                         sortChanged={sortChanged}
//                                     >
//                                         Created At
//                                     </TableHeading>
//                                     <TableHeading
//                                         name="due_date"
//                                         sort_field={queryParams.sort_field}
//                                         sort_direction={queryParams.sort_direction}
//                                         sortChanged={sortChanged}
//                                     >
//                                         Due Date
//                                     </TableHeading>

//                                     <TableHead>Created By</TableHead>
//                                     <TableHead className="text-right">Actions</TableHead>
//                                 </TableRow>

//                                 {/* ---------- Filters ---------- */}
//                                 <TableRow>
//                                     <TableHead />
//                                     <TableHead />
//                                     <TableHead>
//                                         <Input
//                                             className="bg-accent w-full"
//                                             defaultValue={queryParams.name ?? ''}
//                                             placeholder="Task Name"
//                                             onBlur={(e) => searchFieldChange('name', e.target.value)}
//                                             onKeyDown={(e) => onKeyDownHandler('name', e)}
//                                         />
//                                     </TableHead>

//                                     <TableHead>
//                                         <Select
//                                             defaultValue={queryParams.status ?? 'all'}
//                                             onValueChange={(value) => searchFieldChange('status', value === 'all' ? '' : value)}
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Status" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="all">All</SelectItem>
//                                                 <SelectItem value="Pending">Pending</SelectItem>
//                                                 <SelectItem value="In_Progress">In Progress</SelectItem>
//                                                 <SelectItem value="Completed">Completed</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </TableHead>

//                                     <TableHead />
//                                     <TableHead />
//                                     <TableHead />
//                                     <TableHead />
//                                 </TableRow>
//                             </TableHeader>

//                             {/* ---------- Body ---------- */}
//                             <TableBody>
//                                 {tasks.data.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={8} className="py-4 text-center text-gray-500">
//                                             No tasks found.
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     tasks.data.map((task) => (
//                                         <TableRow key={task.id}>
//                                             <TableCell>{task.id}</TableCell>

//                                             <TableCell>
//                                                 <img
//                                                     src={task.image_path || '/images/fallback.jpg'}
//                                                     onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
//                                                     className="h-10 w-10 rounded-full object-cover"
//                                                 />
//                                             </TableCell>

//                                             <TableCell>{task.name}</TableCell>

//                                             <TableCell>
//                                                 <span
//                                                     className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-white ${TASK_STATUS_CLASS_MAP[task.status]}`}
//                                                 >
//                                                     {TASK_STATUS_TEXT_MAP[task.status]}
//                                                 </span>
//                                             </TableCell>

//                                             {/* <TableCell className="text-nowrap">{new Date(task.created_at).toLocaleDateString()}</TableCell> */}
//                                             <TableCell className="text-nowrap">
//                                                 {new Date(task.created_at).toLocaleDateString('en-US', {
//                                                     year: 'numeric',
//                                                     month: 'short',
//                                                     day: '2-digit',
//                                                 })}
//                                             </TableCell>

//                                             <TableCell className="text-nowrap">
//                                                 {new Date(task.due_date).toLocaleDateString('en-US', {
//                                                     year: 'numeric',
//                                                     month: 'short',
//                                                     day: '2-digit',
//                                                 })}
//                                             </TableCell>

//                                             <TableCell>{task.created_by.name}</TableCell>

//                                             <TableCell className="space-x-4 text-right">
//                                                 <Link
//                                                     href={route('tasks.edit', task.id)}
//                                                     className="inline-flex items-center text-indigo-500 hover:text-indigo-600"
//                                                 >
//                                                     <Pencil className="mr-1 h-4 w-4" />
//                                                     Edit
//                                                 </Link>

//                                                 <button
//                                                     onClick={() => handleDelete(task.id)}
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
//                         <Pagination links={tasks.meta.links} />
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
