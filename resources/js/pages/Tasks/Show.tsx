import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { type Task } from '@/types';
import { Head, Link } from '@inertiajs/react';
import TasksTable from './TasksTable';
export default function Show({ tasks, queryParams, task }: { task: Task }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tasks', href: '/tasks' },
                { title: task.name, href: '#' },
            ]}
        >
            <Head title={task.name} />

            <div className="flex justify-center p-6">
                <div className="w-full max-w-5xl overflow-hidden rounded-xl border bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
                    {/* 🔹 Cover Image */}
                    <div className="h-64 w-full overflow-hidden">
                        <img
                            src={task.image_path || '/images/fallback.jpg'}
                            onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* 🔹 Content */}
                    <div className="space-y-6 p-6">
                        {/* Task Name */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{task.name}</h1>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    <span className={`rounded-md px-2 py-0.5 ${TASK_STATUS_CLASS_MAP[task.status]}`}>
                                        {TASK_STATUS_TEXT_MAP[task.status]}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{task.created_by?.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(task.created_at).toLocaleDateString()}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(task.due_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Description */}
                        {task.description && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                                <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">{task.description}</p>
                            </div>
                        )}
                    </div>

                    {/* 🔹 Footer */}
                    <div className="flex justify-end gap-3 border-t bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <Link
                            href="/tasks"
                            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Back
                        </Link>

                        {/* <Link
                            href={route('tasks.edit', task.id)}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            Edit
                        </Link> */}
                    </div>
                </div>
            </div>
            <div className="flex justify-center p-12">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <TasksTable tasks={tasks} queryParams={queryParams} hideTaskColumn={true} />
                </div>
            </div>
        </AppLayout>
    );
}

// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem, type Task } from '@/types';
// import { Head } from '@inertiajs/react';

// /* ----------------------------------
//    Breadcrumbs
// -----------------------------------*/
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Tasks',
//         href: '/tasks',
//     },
// ];

// export default function Show({ task }: { task: Task }) {
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={task?.name ? `${task.name} — Task` : 'Task'} />

//             <header className="rounded-xl p-4">
//                 <h1 className="text-2xl font-bold">{task?.name ?? 'Task'}</h1>
//             </header>

//             <main className="relative flex-1 overflow-hidden rounded-xl border">
//                 <div>
//                     <img
//                         src={task?.image_path || '/images/fallback.jpg'}
//                         alt={task?.name ?? 'Task image'}
//                         onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
//                         className="h-64 w-full object-cover"
//                     />
//                 </div>

//                 <section className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
//                     <div>
//                         <dl>
//                             <div>
//                                 <dt className="text-lg font-bold">Task ID</dt>
//                                 <dd className="mt-1">{task.id}</dd>
//                             </div>
//                         </dl>
//                     </div>
//                 </section>
//             </main>
//         </AppLayout>
//     );
// }
