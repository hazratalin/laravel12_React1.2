import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { ArrowBigLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
    {
        title: 'Create',
        href: '/tasks/create',
    },
];

type TaskForm = {
    name: string;
    description: string;
    status: 'Pending' | 'In_Progress' | 'Completed' | '';
    priority: 'Low' | 'Medium' | 'High' | '';
    assigned_user_id: string;
    project_id: string;
    due_date: string;
    image_path: File | null;
};

interface Flash {
    success?: string;
    danger?: string;
}

interface CreateProps {
    projects: {
        id: string;
        name: string;
    }[];
    users: {
        id: string;
        name: string;
    }[];
}

export default function Create({ projects, users }: CreateProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm<TaskForm>({
        image_path: null,
        name: '',
        status: '',
        priority: '',
        assigned_user_id: '',
        project_id: '',
        description: '',
        due_date: '',
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
        } else {
            setImagePreview(null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('tasks.store'), {
            forceFormData: true, // important for file upload
        });
    };

    const handleReset = () => {
        reset(); // resets all form fields to initial values
        setImagePreview(null); // clear image preview

        // Optional: clear file input manually
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />

            {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Back Button */}
                <div className="flex justify-end">
                    <Link
                        href={route('tasks.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                </div>

                {/* Form Card */}
                <section className="mx-auto w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-sm dark:bg-gray-900">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            {/* Image Upload */}
                            <div className="grid gap-2">
                                <Label htmlFor="image">Task Image</Label>
                                <Input id="image" type="file" onChange={handleFileChange} />
                                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 rounded-md object-cover" />}
                                <InputError message={errors.image_path} />
                            </div>

                            {/* project_id */}
                            <div className="grid gap-2">
                                <Label>Project</Label>
                                <Select value={data.project_id || undefined} onValueChange={(value) => setData('project_id', value)}>
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

                            {/* Task Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Task Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter task name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter task description"
                                />
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
                            {/* assigned_user_id */}
                            <div className="grid gap-2">
                                <Label>Assigned User</Label>
                                <Select value={data.assigned_user_id || undefined} onValueChange={(value) => setData('assigned_user_id', value)}>
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

                            {/* Submit Button */}

                            <div className="mt-4 flex gap-3">
                                <Button type="button" variant="outline" className="w-[30%]" onClick={handleReset} disabled={processing}>
                                    Reset
                                </Button>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Store Task
                                </Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
