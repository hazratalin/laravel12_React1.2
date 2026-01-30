import AppLayout from '@/layouts/app-layout';
import { Post, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ArrowBigLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts Update',
        href: '/posts',
    },
];

type PostForm = {
    title: string;
    content: string;
    image: File | null;
};

export default function PostEdit({ currentPost }: { currentPost: Post }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, put, processing, errors } = useForm<PostForm>({
        title: currentPost.title,
        content: currentPost.content,
        image: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // cleanup preview URL (important)
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('posts.update', currentPost.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Post Update" />

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
                            {/* Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                <InputError message={errors.title} />
                            </div>

                            {/* Image */}
                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                <Input id="image" type="file" onChange={handleFileChange} />

                                <div className="flex gap-2">
                                    {/* current image */}
                                    <img
                                        src={currentPost.image}
                                        alt={currentPost.title}
                                        className={`mt-2 h-20 w-20 rounded-full object-cover ${imagePreview ? 'opacity-30' : ''}`}
                                    />

                                    {/* new preview */}
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Image Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />
                                    )}
                                </div>

                                <InputError message={errors.image} />
                            </div>

                            {/* Content */}
                            <div className="grid gap-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" value={data.content} onChange={(e) => setData('content', e.target.value)} />
                                <InputError message={errors.content} />
                            </div>

                            {/* Submit */}
                            <Button type="submit" className="mt-4 w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Update
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}

// import AppLayout from '@/layouts/app-layout';
// import { Post, type BreadcrumbItem } from '@/types';
// import { Head, Link, router, usePage } from '@inertiajs/react';

// import InputError from '@/components/input-error';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// import { Textarea } from '@/components/ui/textarea';
// import { ArrowBigLeft } from 'lucide-react';
// import { FormEventHandler, useState } from 'react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Posts Update',
//         href: '/posts',
//     },
// ];

// export default function PostEdit({ currentPost }: { currentPost: Post }) {
//     const [title, setTitle] = useState<string>(currentPost.title);
//     const [content, setContent] = useState<string>(currentPost.content);
//     const [image, setImage] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const { errors } = usePage().props;

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setImage(file);
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();
//         router.post(route('posts.update', currentPost.id), {
//             _method: 'PUT',
//             title,
//             content,
//             image,
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Post Update" />
//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="flex justify-end">
//                     <Link
//                         href={route('posts.index')}
//                         className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
//                     >
//                         <ArrowBigLeft className="h-3.5 w-3.5" />
//                         back
//                     </Link>
//                 </div>

//                 <section className="mx-auto max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
//                     <form className="flex flex-col gap-6" onSubmit={submit}>
//                         <div className="grid gap-6">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="title">Title</Label>
//                                 <Input id="title" type="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="First post" />
//                                 <InputError message={errors.title} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="image">Image</Label>
//                                 <Input id="image" type="file" onChange={handleFileChange} />
//                                 <div className="flex gap-2">
//                                     <img
//                                         src={currentPost.image}
//                                         alt={currentPost.title}
//                                         className={'mt-2 h-20 w-20 rounded-full object-cover' + (imagePreview ? ' opacity-30' : '')}
//                                     />
//                                     {imagePreview && (
//                                         <img src={imagePreview} alt="Image Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />
//                                     )}
//                                 </div>
//                                 <InputError message={errors.image} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="content">Content</Label>
//                                 <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
//                                 <InputError message={errors.content} />
//                             </div>

//                             <Button type="submit" className="mt-4 w-full" tabIndex={4}>
//                                 Update
//                             </Button>
//                         </div>
//                     </form>
//                 </section>
//             </div>
//         </AppLayout>
//     );
// }
