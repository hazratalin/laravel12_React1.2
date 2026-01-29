import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { ArrowBigLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts Create',
        href: '/posts/create',
    },
];

type PostForm = {
    title: string;
    content: string;
    image: File | null;
};

export default function PostCreate() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { data, setData, post, processing, errors } = useForm<Required<PostForm>>({
        title: '',
        content: '',
        image: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file)); // 👈 generate preview URL
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('posts.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Post Create" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link
                        href={route('posts.index')}
                        className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                    >
                        <ArrowBigLeft className="h-3.5 w-3.5" />
                        back
                    </Link>
                </div>

                <section className="mx-auto max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Post Title"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                <Input id="image" type="file" onChange={handleFileChange} />
                                {imagePreview && <img src={imagePreview} alt="Image Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />}
                                <InputError message={errors.image} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Description"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                />
                                <InputError message={errors.content} />
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Store
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
