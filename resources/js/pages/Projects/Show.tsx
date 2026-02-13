import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { type Project } from '@/types';
import { Head, Link } from '@inertiajs/react';
import TasksTable from '../Task/TasksTable';
export default function Show({ tasks, queryParams, project }: { project: Project }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Projects', href: '/projects' },
                { title: project.name, href: '#' },
            ]}
        >
            <Head title={project.name} />

            <div className="flex justify-center p-6">
                <div className="w-full max-w-5xl overflow-hidden rounded-xl border bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
                    {/* 🔹 Cover Image */}
                    <div className="h-64 w-full overflow-hidden">
                        <img
                            src={project.image_url}
                            onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* 🔹 Content */}
                    <div className="space-y-6 p-6">
                        {/* Project Name */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{project.name}</h1>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    <span className={`rounded-md px-2 py-0.5 ${PROJECT_STATUS_CLASS_MAP[project.status]}`}>
                                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{project.created_by?.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(project.created_at).toLocaleDateString()}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(project.due_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Description */}
                        {project.description && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                                <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">{project.description}</p>
                            </div>
                        )}
                    </div>

                    {/* 🔹 Footer */}
                    <div className="flex justify-end gap-3 border-t bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <Link
                            href="/projects"
                            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Back
                        </Link>

                        {/* <Link
                            href={route('projects.edit', project.id)}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            Edit
                        </Link> */}
                    </div>
                </div>
            </div>
            <div className="flex justify-center p-12">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <TasksTable tasks={tasks} queryParams={queryParams} hideProjectColumn={true} />
                </div>
            </div>
        </AppLayout>
    );
}

// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem, type Project } from '@/types';
// import { Head } from '@inertiajs/react';

// /* ----------------------------------
//    Breadcrumbs
// -----------------------------------*/
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Projects',
//         href: '/projects',
//     },
// ];

// export default function Show({ project }: { project: Project }) {
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={project?.name ? `${project.name} — Project` : 'Project'} />

//             <header className="rounded-xl p-4">
//                 <h1 className="text-2xl font-bold">{project?.name ?? 'Project'}</h1>
//             </header>

//             <main className="relative flex-1 overflow-hidden rounded-xl border">
//                 <div>
//                     <img
//                         src={project?.image_path || '/images/fallback.jpg'}
//                         alt={project?.name ?? 'Project image'}
//                         onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
//                         className="h-64 w-full object-cover"
//                     />
//                 </div>

//                 <section className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
//                     <div>
//                         <dl>
//                             <div>
//                                 <dt className="text-lg font-bold">Project ID</dt>
//                                 <dd className="mt-1">{project.id}</dd>
//                             </div>
//                         </dl>
//                     </div>
//                 </section>
//             </main>
//         </AppLayout>
//     );
// }
