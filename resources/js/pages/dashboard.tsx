import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import CountUp from 'react-countup';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardProps = {
    pendingTasksCount: number;
    completedTasksCount: number;
    inProgressTasksCount: number;
    myInProgressTasksCount: number;
    myCompletedTasksCount: number;
    myPendingTasksCount: number;

    activeTasks: {
        id: number;
        name: string;
        status: string;
        due_date: string;
        project?: {
            name: string;
        };
    }[];
};

export default function Dashboard({
    pendingTasksCount,
    completedTasksCount,
    inProgressTasksCount,
    myInProgressTasksCount,
    myCompletedTasksCount,
    myPendingTasksCount,
    activeTasks,
}: DashboardProps) {
    // ✅ Safe default array for tasks
    const tasks = activeTasks ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Pending Tasks */}
                    {/* <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[150px] overflow-hidden rounded-xl border"> */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[150px] translate-y-0 overflow-hidden rounded-xl border opacity-100 transition-all duration-700 hover:scale-[1.02] hover:shadow-lg starting:translate-y-6 starting:opacity-0">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />

                        <div className="relative z-10 flex h-full flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Pending Tasks</h2>

                            <p className="text-4xl font-bold text-yellow-500">
                                <CountUp end={myPendingTasksCount} duration={2} delay={0.4} separator="," />
                                {' / '}
                                <CountUp end={pendingTasksCount} duration={2} delay={0.4} separator="," />
                            </p>

                            {/* Progress Bar */}
                            <div className="mt-3 h-2 w-32 rounded-full bg-gray-200 dark:bg-neutral-700">
                                <div
                                    className="h-2 rounded-full bg-yellow-500 transition-all duration-1000"
                                    style={{
                                        width: pendingTasksCount ? `${(myPendingTasksCount / pendingTasksCount) * 100}%` : '0%',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[150px] translate-y-0 overflow-hidden rounded-xl border opacity-100 transition-all delay-150 duration-700 hover:scale-[1.02] hover:shadow-lg starting:translate-y-6 starting:opacity-0">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />

                        <div className="relative z-10 flex h-full flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Completed Tasks</h2>

                            <p className="text-4xl font-bold text-green-500">
                                <CountUp end={myCompletedTasksCount} duration={2} delay={0.55} separator="," />
                                {' / '}
                                <CountUp end={completedTasksCount} duration={2} delay={0.55} separator="," />
                            </p>
                        </div>
                    </div>

                    {/* In Progress Tasks */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[150px] translate-y-0 overflow-hidden rounded-xl border opacity-100 transition-all delay-300 duration-700 hover:scale-[1.02] hover:shadow-lg starting:translate-y-6 starting:opacity-0">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />

                        <div className="relative z-10 flex h-full flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">In Progress Tasks</h2>

                            <p className="text-4xl font-bold text-blue-500">
                                <CountUp end={myInProgressTasksCount} duration={2} delay={0.7} separator="," />
                                {' / '}
                                <CountUp end={inProgressTasksCount} duration={2} delay={0.7} separator="," />
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-6">
                    <h2 className="mb-2 text-lg font-semibold">My Active Tasks</h2>
                    <div className="text-gray-500">
                        <div className="overflow-x-auto">
                            {/* <div className="rounded bg-gray-100 p-4">
                                <pre>{JSON.stringify(activeTasks, null, 2)}</pre></div> */}

                            <Table>
                                <TableCaption>A list of all Tasks.</TableCaption>

                                {/* ---------- Headers ---------- */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Project Name</TableHead>
                                        <TableHead> Task Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                    </TableRow>
                                </TableHeader>

                                {/* ---------- Body ---------- */}
                                <TableBody>
                                    {tasks.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-4 text-center text-gray-500">
                                                No tasks found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        tasks.map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell>{task.id}</TableCell>

                                                {/* <TableCell>{task.project?.name}</TableCell> */}
                                                <TableCell className="hover:underline">
                                                    <Link href={route('projects.show', task.project?.id)}>{task.project?.name}</Link>
                                                </TableCell>
                                                <TableCell className="hover:underline">
                                                    <Link href={route('tasks.show', task.id)}>{task.name}</Link>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-nowrap text-white ${TASK_STATUS_CLASS_MAP[task.status]}`}
                                                    >
                                                        {TASK_STATUS_TEXT_MAP[task.status]}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="text-nowrap">
                                                    {new Date(task.due_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: '2-digit',
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-6">
                    <h2 className="mb-2 text-lg font-semibold">Active Task</h2>
                    <p className="text-gray-500">Here you can show recent tasks or charts later.</p>
                </div>
            </div>
        </AppLayout>
    );
}
