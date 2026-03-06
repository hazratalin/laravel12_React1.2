import { TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP, TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { type Task } from '@/types';
import { Head, Link } from '@inertiajs/react';

/* ---------------- Helpers ---------------- */

const formatDate = (date?: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const fallback = (value?: string | null, alt = '—') => value || alt;

/* ---------------- Component ---------------- */

export default function Show({ task }: { task: Task }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tasks', href: '/tasks' },
                { title: task.name, href: '#' },
            ]}
        >
            <Head title={task.name} />

            <div className="flex justify-center p-6">
                <div className="w-full max-w-5xl overflow-hidden rounded-xl border bg-white shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    {/* Cover Image */}
                    <div className="h-64 w-full overflow-hidden">
                        <img
                            src={task.image_path || '/images/fallback.jpg'}
                            alt={task.name}
                            onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-6 p-6">
                        {/* Task Title */}
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{task.name}</h1>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Detail label="ID" value={task.id} />

                            <Detail
                                label="Status"
                                value={
                                    <span
                                        className={`inline-block rounded-md px-2 py-0.5 ${TASK_STATUS_CLASS_MAP[task.status as keyof typeof TASK_STATUS_CLASS_MAP]}`}
                                    >
                                        {TASK_STATUS_TEXT_MAP[task.status as keyof typeof TASK_STATUS_TEXT_MAP]}
                                    </span>
                                }
                            />

                            <Detail
                                label="Priority"
                                value={
                                    <span className={`inline-block rounded-md px-2 py-0.5 ${TASK_PRIORITY_CLASS_MAP[task.priority]}`}>
                                        {TASK_PRIORITY_TEXT_MAP[task.priority]}
                                    </span>
                                }
                            />

                            <Detail label="Created By" value={fallback(task.created_by?.name)} />

                            <Detail label="Updated By" value={fallback(task.updated_by?.name)} />

                            <Detail label="Project" value={fallback(task.project?.name)} />

                            <Detail label="Assigned User" value={fallback(task.assignedUser?.name, 'Unassigned')} />

                            <Detail label="Created At" value={formatDate(task.created_at)} />

                            <Detail label="Due Date" value={formatDate(task.due_date)} />
                        </div>

                        {/* Description */}
                        {task.description && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                                <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">{task.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <Link
                            href="/tasks"
                            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Back
                        </Link>

                        <Link href={`/tasks/${task.id}/edit`} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                            Edit Task
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ---------------- Reusable Detail Component ---------------- */

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    );
}

// import { TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP, TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from '@/constants';
// import AppLayout from '@/layouts/app-layout';
// import { type Task } from '@/types';
// import { Head, Link } from '@inertiajs/react';
// export default function Show({ task }: { task: Task }) {
//     return (
//         <AppLayout
//             breadcrumbs={[
//                 { title: 'Tasks', href: '/tasks' },
//                 { title: task.name, href: '#' },
//             ]}
//         >
//             <Head title={task.name} />

//             <div className="flex justify-center p-6">
//                 <div className="w-full max-w-5xl overflow-hidden rounded-xl border bg-white shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
//                     {/* 🔹 Cover Image */}
//                     <div className="h-64 w-full overflow-hidden">
//                         <img
//                             src={task.image_path || '/images/fallback.jpg'}
//                             alt={task.name}
//                             onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
//                             className="h-full w-full object-cover"
//                         />
//                     </div>

//                     {/* 🔹 Content */}
//                     <div className="space-y-6 p-6">
//                         {/* Task Name */}
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{task.name}</h1>
//                         </div>

//                         {/* Details */}
//                         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">{task.id}</p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">
//                                     <span className={`inline-block rounded-md px-2 py-0.5 ${TASK_STATUS_CLASS_MAP[task.status]}`}>
//                                         {TASK_STATUS_TEXT_MAP[task.status]}
//                                     </span>
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">
//                                     <span className={`inline-block rounded-md px-2 py-0.5 ${TASK_PRIORITY_CLASS_MAP[task.priority]}`}>
//                                         {TASK_PRIORITY_TEXT_MAP[task.priority]}
//                                     </span>
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">{task.created_by?.name || '—'}</p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Updated By</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">{task.updated_by?.name || '—'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">{task.project?.name || '—'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Assigned User</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">{task.assignedUser?.name || '—'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">
//                                     {task.created_at
//                                         ? new Date(task.created_at).toLocaleDateString('en-US', {
//                                               year: 'numeric',
//                                               month: 'short',
//                                               day: 'numeric',
//                                           })
//                                         : '-'}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">
//                                     {task.due_date
//                                         ? new Date(task.due_date).toLocaleDateString('en-US', {
//                                               year: 'numeric',
//                                               month: 'short',
//                                               day: 'numeric',
//                                           })
//                                         : 'No due date'}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Description */}
//                         {task.description && (
//                             <div>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
//                                 <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">{task.description}</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* 🔹 Footer */}
//                     <div className="flex justify-end gap-3 border-t bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
//                         <Link
//                             href="/tasks"
//                             className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
//                         >
//                             Back
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
