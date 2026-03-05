import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { ArrowBigLeft, LoaderCircle, RefreshCw } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

type TaskForm = {
    name: string;
    description: string;
    status: 'Pending' | 'In_Progress' | 'Completed' | '';
    priority: 'Low' | 'Medium' | 'High' | '';
    assigned_user_id: string;
    project_id: string;
    due_date: string;
    image_path: File | null;
    _method?: string;
};

interface Flash {
    success?: string;
    danger?: string;
}

interface Task {
    id: number;
    name: string;
    description: string;
    status: string;
    priority: string;
    assigned_user_id: number;
    project_id: number;
    due_date: string;
    image_path?: string;
}
interface EditProps {
    task: Task;
    projects: { id: number; name: string }[];
    users: { id: number; name: string }[];
}

export default function Edit({ task, projects, users }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tasks', href: '/tasks' },
        { title: 'Edit', href: `/tasks/${task.id}/edit` },
    ];

    // const [imagePreview, setImagePreview] = useState<string | null>(task.image_path ?? null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<TaskForm>({
        name: task.name ?? '',
        description: task.description ?? '',
        status: (task.status as TaskForm['status']) ?? '',
        priority: (task.priority as TaskForm['priority']) ?? '',
        assigned_user_id: String(task.assigned_user_id ?? ''),
        project_id: String(task.project_id ?? ''),
        due_date: task.due_date ?? '',
        image_path: null,
        _method: 'put',
    });

    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.danger) toast.error(flash.danger);
    }, [flash.success, flash.danger]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image_path', file);

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('tasks.update', task.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link
                        href={route('tasks.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                </div>

                <section className="mx-auto w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-sm dark:bg-gray-900">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            {/* Image Upload */}

                            <div className="grid gap-2">
                                <Label htmlFor="image">Task Image</Label>

                                <Input id="image" type="file" onChange={handleFileChange} />

                                <div className="mt-2 flex items-center gap-3">
                                    {task.image_path && (
                                        <img
                                            src={task.image_path}
                                            alt={task.name}
                                            className={`h-20 w-20 rounded-full border object-cover ${imagePreview ? 'opacity-30' : ''}`}
                                        />
                                    )}

                                    {imagePreview && <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-full border object-cover" />}
                                </div>

                                <InputError message={errors.image_path} />
                            </div>
                            {/* Project */}
                            <div className="grid gap-2">
                                <Label>Project</Label>
                                <Select value={data.project_id} onValueChange={(value) => setData('project_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={String(project.id)}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.project_id} />
                            </div>

                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Task Name</Label>
                                <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>

                            {/* Status */}
                            <div className="grid gap-2">
                                <Label>Status</Label>

                                <Select value={data.status} onValueChange={(value) => setData('status', value as TaskForm['status'])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In_Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.status} />
                            </div>

                            {/* Priority */}
                            <div className="grid gap-2">
                                <Label>Priority</Label>

                                <Select value={data.priority} onValueChange={(value) => setData('priority', value as TaskForm['priority'])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.priority} />
                            </div>

                            {/* Assigned User */}
                            <div className="grid gap-2">
                                <Label>Assigned User</Label>

                                <Select value={data.assigned_user_id} onValueChange={(value) => setData('assigned_user_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.assigned_user_id} />
                            </div>

                            {/* Due Date */}
                            <div className="grid gap-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input id="due_date" type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />

                                <InputError message={errors.due_date} />
                            </div>

                            {/* Buttons */}
                            <div className="mt-4 flex gap-3">
                                <Button type="submit" className="flex w-full items-center justify-center gap-2" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4" />
                                            Update Task
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
