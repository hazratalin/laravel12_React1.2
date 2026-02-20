import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { type BreadcrumbItem } from '@/types';
import { ArrowBigLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Edit',
        href: '/projects/edit',
    },
];
interface Project {
    id: number;
    name: string;
    description: string;
    status: 'Pending' | 'In_Progress' | 'Completed';
    due_date: string;
    image_path: string;
}

interface Flash {
    success?: string;
    danger?: string;
}

export default function Edit({ project }: { project: Project }) {
    const [imagePreview, setImagePreview] = useState<string | null>(project.image_path);

    const { data, setData, put, processing, errors } = useForm({
        name: project.name ?? '',
        description: project.description ?? '',
        status: project.status ?? '',
        due_date: project.due_date ?? '',
        image: null as File | null,
        image_path: project.image_path ?? '',
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

        put(route('projects.update', project.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Project ${project.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link
                        href={route('projects.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                </div>

                <section className="mx-auto w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-sm dark:bg-gray-900">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        {/* Image */}
                        <div className="grid gap-2">
                            <Label htmlFor="image">Project Image</Label>
                            <Input id="image" type="file" onChange={handleFileChange} />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 rounded-md object-cover" />}
                            <InputError message={errors.image_path} />
                        </div>

                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
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
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In_Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>

                        {/* Due Date */}
                        <div className="grid gap-2">
                            <Label>Due Date</Label>
                            <Input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                            <InputError message={errors.due_date} />
                        </div>

                        {/* Submit */}
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Update Project
                        </Button>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
