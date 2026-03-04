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
                            Add new
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
