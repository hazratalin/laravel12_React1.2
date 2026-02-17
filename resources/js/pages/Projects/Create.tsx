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
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Create',
        href: '/projects/create',
    },
];

type ProjectForm = {
    name: string;
    description: string;
    status: 'Pending' | 'In_Progress' | 'Completed' | '';
    due_date: string;
    image_path: File | null;
};

interface Flash {
    success?: string;
    danger?: string;
}

export default function Create() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm<ProjectForm>({
        image_path: null,
        name: '',
        status: '',
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

        post(route('projects.store'), {
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
            <Head title="Create Project" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Back Button */}
                <div className="flex justify-end">
                    <Link
                        href={route('projects.index')}
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
                                <Label htmlFor="image">Project Image</Label>
                                <Input id="image" type="file" onChange={handleFileChange} />
                                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 rounded-md object-cover" />}
                                <InputError message={errors.image_path} />
                            </div>

                            {/* Project Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter project name"
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
                                    placeholder="Enter project description"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Status */}
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value as ProjectForm['status'])}>
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

                            {/* Due Date */}
                            <div className="grid gap-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input id="due_date" type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                                <InputError message={errors.due_date} />
                            </div>

                            {/* Submit Button */}
                            {/* <Button type="submit" className="mt-4 w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Store Project
                            </Button> */}
                            <div className="mt-4 flex gap-3">
                                <Button type="button" variant="outline" className="w-[30%]" onClick={handleReset} disabled={processing}>
                                    Reset
                                </Button>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Store Project
                                </Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
