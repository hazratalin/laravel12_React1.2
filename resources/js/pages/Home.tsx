import BackToTop from '@/components/BackToTop';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
export default function Home({ posts: initialPosts }) {
    const [posts, setPosts] = useState(initialPosts.data || []);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialPosts.next_page_url !== null);
    const loader = useRef(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/posts-home?page=${page}`, {
                headers: { Accept: 'application/json' },
            });

            const newPosts = response.data.data;

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
                setHasMore(response.data.next_page_url !== null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 },
        );

        if (loader.current) observer.observe(loader.current);

        return () => observer.disconnect();
    }, [hasMore]);

    useEffect(() => {
        if (page === 1) return;
        fetchPosts();
    }, [page]);

    return (
        <div className="mx-auto max-w-6xl bg-white px-4 py-8 text-black transition-colors duration-300 dark:bg-black dark:text-white">
            <h1 className="mb-10 text-center text-4xl font-bold">Latest Posts</h1>

            {/* Posts Container */}
            <div className="mx-auto max-w-5xl space-y-6">
                {posts.map((post) => (
                    <div key={post.id} className="rounded-xl border p-6">
                        <div className="flex items-start justify-between gap-6">
                            {/* Left Content */}
                            <div className="flex-1">
                                <h2 className="mb-4 text-lg font-semibold">{post.title}</h2>

                                <p className="mb-3 text-sm text-gray-400 dark:text-gray-500">
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>

                                <p className="line-clamp-3 text-gray-700 dark:text-gray-300">{post.content}</p>
                            </div>

                            {/* Right Image */}
                            {post.image && (
                                <div className="flex-shrink-0">
                                    <img src={post.image} alt={post.title} className="h-28 w-44 rounded-lg object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
                <div ref={loader} className="flex justify-center py-10">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white"></div>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="py-8 text-center font-medium text-gray-500 dark:text-gray-400">No more posts to show.</div>
            )}

            {posts.length === 0 && <div className="py-8 text-center font-medium text-gray-500 dark:text-gray-400">No posts available.</div>}

            <BackToTop />
        </div>
    );
}

// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';
// import BackToTop from '@/components/BackToTop';
// import axios from 'axios';
// import { useEffect, useRef, useState } from 'react';

// export default function Home({ posts: initialPosts }: { posts: any }) {
//     const { auth } = usePage<SharedData>().props;
//     const [posts, setPosts] = useState(initialPosts.data || []);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(initialPosts.next_page_url !== null);
//     const loader = useRef<HTMLDivElement | null>(null);

//     const fetchPosts = async () => {
//         try {
//             const response = await axios.get(`/posts-home?page=${page}`, {
//                 headers: { Accept: 'application/json' },
//             });

//             const newPosts = response.data.data;

//             if (newPosts.length === 0) {
//                 setHasMore(false);
//             } else {
//                 setPosts((prev) => [...prev, ...newPosts]);
//                 setHasMore(response.data.next_page_url !== null);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 if (entries[0].isIntersecting && hasMore) {
//                     setPage((prev) => prev + 1);
//                 }
//             },
//             { threshold: 1 },
//         );

//         if (loader.current) observer.observe(loader.current);

//         return () => observer.disconnect();
//     }, [hasMore]);

//     useEffect(() => {
//         if (page === 1) return;
//         fetchPosts();
//     }, [page]);

//     return (
//         <>
//             {/* Welcome Section */}
//             <Head title="Welcome">
//                 <link rel="preconnect" href="https://fonts.bunny.net" />
//                 <link
//                     href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
//                     rel="stylesheet"
//                 />
//             </Head>

//             <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
//                 <header className="mb-2 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
//                     <nav className="flex items-center justify-end gap-4">
//                         {auth.user ? (
//                             <Link
//                                 href={route('dashboard')}
//                                 className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                             >
//                                 Dashboard
//                             </Link>
//                         ) : (
//                             <>
//                                 <Link
//                                     href={route('login')}
//                                     className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
//                                 >
//                                     Log in
//                                 </Link>
//                                 <Link
//                                     href={route('register')}
//                                     className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                                 >
//                                     Register
//                                 </Link>
//                             </>
//                         )}
//                     </nav>
//                 </header>

//                 <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
//                     <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
//                         <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
//                             <h1 className="mb-1 font-medium">Let's get started</h1>
//                             <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
//                                 Laravel has an incredibly rich ecosystem.
//                                 <br />
//                                 We suggest starting with the following.
//                             </p>
//                             <ul className="mb-4 flex flex-col lg:mb-6">
//                                 <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
//                                     <span className="relative bg-white py-1 dark:bg-[#161615]">
//                                         <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
//                                             <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
//                                         </span>
//                                     </span>
//                                     <span>
//                                         Read the
//                                         <a
//                                             href="https://laravel.com/docs"
//                                             target="_blank"
//                                             className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
//                                         >
//                                             <span>Documentation</span>
//                                             <svg
//                                                 width={10}
//                                                 height={11}
//                                                 viewBox="0 0 10 11"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-2.5 w-2.5"
//                                             >
//                                                 <path
//                                                     d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
//                                                     stroke="currentColor"
//                                                     strokeLinecap="square"
//                                                 />
//                                             </svg>
//                                         </a>
//                                     </span>
//                                 </li>
//                                 <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
//                                     <span className="relative bg-white py-1 dark:bg-[#161615]">
//                                         <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
//                                             <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
//                                         </span>
//                                     </span>
//                                     <span>
//                                         Watch video tutorials at
//                                         <a
//                                             href="https://laracasts.com"
//                                             target="_blank"
//                                             className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
//                                         >
//                                             <span>Laracasts</span>
//                                             <svg
//                                                 width={10}
//                                                 height={11}
//                                                 viewBox="0 0 10 11"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-2.5 w-2.5"
//                                             >
//                                                 <path
//                                                     d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
//                                                     stroke="currentColor"
//                                                     strokeLinecap="square"
//                                                 />
//                                             </svg>
//                                         </a>
//                                     </span>
//                                 </li>
//                             </ul>
//                             <ul className="flex gap-3 text-sm leading-normal">
//                                 <li>
//                                     <a
//                                         href="https://cloud.laravel.com"
//                                         target="_blank"
//                                         className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
//                                     >
//                                         Deploy now
//                                     </a>
//                                 </li>
//                             </ul>
//                         </div>

//                         <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
//                             {/* SVG Graphic */}
//                         </div>
//                     </main>
//                 </div>
//                 <div className="hidden h-14.5 lg:block"></div>
//             </div>

//             {/* Posts Section */}
//             <div className="mx-auto max-w-6xl bg-white px-4 py-8 text-black transition-colors duration-300 dark:bg-black dark:text-white">
//                 <h1 className="mb-10 text-center text-4xl font-bold">Latest Posts</h1>

//                 <div className="mx-auto max-w-5xl space-y-6">
//                     {posts.map((post) => (
//                         <div key={post.id} className="rounded-xl border p-6">
//                             <div className="flex items-start justify-between gap-6">
//                                 <div className="flex-1">
//                                     <h2 className="mb-4 text-lg font-semibold">{post.title}</h2>
//                                     <p className="mb-3 text-sm text-gray-400 dark:text-gray-500">
//                                         {new Date(post.created_at).toLocaleDateString('en-US', {
//                                             month: 'short',
//                                             day: 'numeric',
//                                             year: 'numeric',
//                                         })}
//                                     </p>
//                                     <p className="line-clamp-3 text-gray-700 dark:text-gray-300">{post.content}</p>
//                                 </div>
//                                 {post.image && (
//                                     <div className="flex-shrink-0">
//                                         <img src={post.image} alt={post.title} className="h-28 w-44 rounded-lg object-cover" />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {hasMore && (
//                     <div ref={loader} className="flex justify-center py-10">
//                         <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white"></div>
//                     </div>
//                 )}

//                 {!hasMore && posts.length > 0 && (
//                     <div className="py-8 text-center font-medium text-gray-500 dark:text-gray-400">
//                         No more posts to show.
//                     </div>
//                 )}

//                 {posts.length === 0 && (
//                     <div className="py-8 text-center font-medium text-gray-500 dark:text-gray-400">
//                         No posts available.
//                     </div>
//                 )}

//                 <BackToTop />
//             </div>
//         </>
//     );
// }
