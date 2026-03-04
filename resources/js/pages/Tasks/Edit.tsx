import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowBigLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Edit({ task }: any) {
    // Initialize form with task data
    const { data, setData, processing, errors } = useForm({
        name: task.name ?? '',
        description: task.description ?? '',
        status: task.status ?? '',
        due_date: task.due_date ?? '',
        image_path: null as File | null,
    });

    // Image preview (existing or new)
    const [imagePreview, setImagePreview] = useState<string | null>(task.image_path);

    // Handle image file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image_path', file);
        setImagePreview(file ? URL.createObjectURL(file) : task.image_path);
    };

    // Handle form submit
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'put'); // required for Inertia PUT
        formData.append('name', data.name);
        formData.append('description', data.description ?? '');
        formData.append('status', data.status);
        formData.append('due_date', data.due_date ?? '');
        if (data.image_path) formData.append('image_path', data.image_path);

        router.post(route('tasks.update', task.id), formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Handle flash messages
    const { flash } = usePage<{ flash: any }>().props;
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.danger) toast.error(flash.danger);
    }, [flash.success, flash.danger]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tasks', href: '/tasks' },
                { title: 'Edit', href: `/tasks/edit/${task.id}` }, // or just '#' if no link
            ]}
        >
            <Head title={`Edit Task ${task.name}`} />

            <div className="flex flex-col gap-4">
                {/* Back Button */}
                <div className="flex justify-end">
                    <Link
                        href={route('tasks.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" /> Back
                    </Link>
                </div>

                {/* Form */}
                <section className="mx-auto w-full max-w-md rounded-lg bg-gray-100 p-6 dark:bg-gray-900">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        {/* Image */}
                        <div>
                            <Label htmlFor="image_path">Task Image</Label>
                            <Input id="image_path" type="file" onChange={handleFileChange} />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 rounded-md object-cover" />}
                            {errors.image_path && <p className="text-sm text-red-500">{errors.image_path}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <Label htmlFor="name">Task Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <Label>Description</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <Label>Status</Label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded border p-2">
                                <option value="Pending">Pending</option>
                                <option value="In_Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>

                        {/* Due Date */}
                        <div>
                            <Label>Due Date</Label>
                            <Input type="date" value={data.due_date ?? ''} onChange={(e) => setData('due_date', e.target.value)} />
                            {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                        </div>

                        {/* Submit */}
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Update Task
                        </Button>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
// import AppLayout from '@/layouts/app-layout';
// import { Head, Link, useForm, usePage } from '@inertiajs/react';

// import InputError from '@/components/input-error';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// import { type BreadcrumbItem } from '@/types';
// import { ArrowBigLeft, LoaderCircle } from 'lucide-react';
// import { FormEventHandler, useEffect, useState } from 'react';
// import { toast } from 'sonner';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Tasks',
//         href: '/tasks',
//     },
//     {
//         title: 'Edit',
//         href: '/tasks/edit',
//     },
// ];
// interface Task {
//     id: number;
//     name: string;
//     description: string;
//     status: 'Pending' | 'In_Progress' | 'Completed';
//     due_date: string;
//     image_path: string;
// }

// interface Flash {
//     success?: string;
//     danger?: string;
// }

// export default function Edit({ task }: { task: Task }) {
//     const [imagePreview, setImagePreview] = useState<string | null>(task.image_path);

//     const { data, setData, put, processing, errors } = useForm({
//         name: task.name ?? '',
//         description: task.description ?? '',
//         status: task.status ?? '',
//         due_date: task.due_date ?? '',
//         image: null as File | null,
//         image_path: task.image_path ?? '',
//     });

//     const { flash } = usePage<{ flash: Flash }>().props;

//     useEffect(() => {
//         if (flash.success) toast.success(flash.success);
//         if (flash.danger) toast.error(flash.danger);
//     }, [flash.success, flash.danger]);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] ?? null;
//         setData('image_path', file);

//         if (file) {
//             setImagePreview(URL.createObjectURL(file));
//         } else {
//             setImagePreview(null);
//         }
//     };

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();

//         put(route('tasks.update', task.id), {
//             forceFormData: true,
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={`Edit Task ${task.name}`} />

//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="flex justify-end">
//                     <Link
//                         href={route('tasks.index')}
//                         className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
//                     >
//                         <ArrowBigLeft className="h-3.5 w-3.5" />
//                         Back
//                     </Link>
//                 </div>

//                 <section className="mx-auto w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-sm dark:bg-gray-900">
//                     <form className="flex flex-col gap-6" onSubmit={submit}>
//                         {/* Image */}
//                         <div className="grid gap-2">
//                             <Label htmlFor="image">Task Image</Label>
//                             <Input id="image" type="file" onChange={handleFileChange} />
//                             {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 rounded-md object-cover" />}
//                             <InputError message={errors.image_path} />
//                         </div>

//                         {/* Name */}
//                         <div className="grid gap-2">
//                             <Label htmlFor="name">Task Name</Label>
//                             <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
//                             <InputError message={errors.name} />
//                         </div>

//                         {/* Description */}
//                         <div className="grid gap-2">
//                             <Label>Description</Label>
//                             <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
//                             <InputError message={errors.description} />
//                         </div>

//                         {/* Status */}
//                         <div className="grid gap-2">
//                             <Label>Status</Label>
//                             <Select value={data.status} onValueChange={(value) => setData('status', value)}>
//                                 <SelectTrigger>
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Pending">Pending</SelectItem>
//                                     <SelectItem value="In_Progress">In Progress</SelectItem>
//                                     <SelectItem value="Completed">Completed</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             <InputError message={errors.status} />
//                         </div>

//                         {/* Due Date */}
//                         <div className="grid gap-2">
//                             <Label>Due Date</Label>
//                             <Input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
//                             <InputError message={errors.due_date} />
//                         </div>

//                         {/* Submit */}
//                         <Button type="submit" disabled={processing}>
//                             {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                             Update Task
//                         </Button>
//                     </form>
//                 </section>
//             </div>
//         </AppLayout>
//     );
// }
