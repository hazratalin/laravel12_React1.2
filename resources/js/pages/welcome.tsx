// import BackToTop from '@/components/BackToTop';
// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';
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
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
//             </Head>

//             <div className="flex flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
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
//             </div>

//             {/* Posts Section */}

//             <div className="flex-1 rounded-br-lg rounded-bl-lg p-6 pb-12 text-[13px] leading-[20px] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:text-[#EDEDEC]">
//                 <h1 className="mb-10 text-center text-4xl font-bold">Latest Posts</h1>

//                 <div className="mx-auto max-w-5xl space-y-6">
//                     {posts.map((post) => (
//                         <div
//                             key={post.id}
//                             className="rounded-xl bg-white p-6 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"
//                         >
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
//                     <div className="py-8 text-center font-medium text-gray-500 dark:text-gray-400">No more posts to show.</div>
//                 )}

//                 {posts.length === 0 && <div className="py-8 text-center font-medium text-gray-500 dark:text-gray-400">No posts available.</div>}

//                 <BackToTop />
//             </div>
//         </>
//     );
// }

// import axios from 'axios';
// import { useEffect, useState } from 'react';

// export default function LandingPage() {
//     const [projects, setProjects] = useState([]);
//     const [posts, setPosts] = useState([]);

//     const gallery = [
//         'https://picsum.photos/400/400?1',
//         'https://picsum.photos/400/400?2',
//         'https://picsum.photos/400/400?3',
//         'https://picsum.photos/400/400?4',
//         'https://picsum.photos/400/400?5',
//         'https://picsum.photos/400/400?6',
//     ];

//     // demo fetch
//     useEffect(() => {
//         axios
//             .get('/api/projects')
//             .then((res) => {
//                 setProjects(res.data);
//             })
//             .catch(() => {
//                 setProjects([
//                     { id: 1, title: 'Project One', description: 'Modern web project', image: 'https://picsum.photos/400/250?1' },
//                     { id: 2, title: 'Project Two', description: 'Laravel system', image: 'https://picsum.photos/400/250?2' },
//                     { id: 3, title: 'Project Three', description: 'React UI dashboard', image: 'https://picsum.photos/400/250?3' },
//                 ]);
//             });

//         axios
//             .get('/api/posts')
//             .then((res) => {
//                 setPosts(res.data);
//             })
//             .catch(() => {
//                 setPosts([
//                     { id: 1, title: 'Laravel Tips', excerpt: 'Improve your Laravel workflow', image: 'https://picsum.photos/400/250?4' },
//                     { id: 2, title: 'React Performance', excerpt: 'Optimize React apps', image: 'https://picsum.photos/400/250?5' },
//                     { id: 3, title: 'Modern UI Design', excerpt: 'Latest design trends', image: 'https://picsum.photos/400/250?6' },
//                 ]);
//             });
//     }, []);

//     return (
//         <div className="bg-gray-50 text-gray-800">
//             {/* NAVBAR */}

//             <header className="sticky top-0 z-50 bg-white shadow">
//                 <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//                     <h1 className="text-2xl font-bold text-blue-600">MyLogo</h1>

//                     <nav className="hidden space-x-6 md:flex">
//                         <a href="#projects" className="hover:text-blue-600">
//                             Projects
//                         </a>
//                         <a href="#gallery" className="hover:text-blue-600">
//                             Gallery
//                         </a>
//                         <a href="#posts" className="hover:text-blue-600">
//                             Posts
//                         </a>
//                     </nav>

//                     <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">Login</button>
//                 </div>
//             </header>

//             {/* HERO */}

//             <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-24 text-white">
//                 <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
//                     <div>
//                         <h2 className="mb-6 text-5xl font-bold">Modern Laravel + React Platform</h2>

//                         <p className="mb-8 text-lg">Build modern applications with projects, gallery and blog system.</p>

//                         <div className="space-x-4">
//                             <button className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600">Get Started</button>

//                             <button className="rounded-lg border border-white px-6 py-3">View Projects</button>
//                         </div>
//                     </div>

//                     <img src="https://picsum.photos/600/400" className="rounded-xl shadow-lg" />
//                 </div>
//             </section>

//             {/* PROJECTS */}

//             <section id="projects" className="py-20">
//                 <div className="mx-auto max-w-7xl px-6">
//                     <h2 className="mb-12 text-center text-3xl font-bold">Our Projects</h2>

//                     <div className="grid gap-8 md:grid-cols-3">
//                         {projects.map((project) => (
//                             <div key={project.id} className="rounded-xl bg-white shadow transition hover:shadow-lg">
//                                 <img src={project.image} className="rounded-t-xl" />

//                                 <div className="p-6">
//                                     <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>

//                                     <p className="mb-4 text-gray-600">{project.description}</p>

//                                     <button className="font-semibold text-blue-600">View Project →</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* GALLERY */}

//             <section id="gallery" className="bg-gray-100 py-20">
//                 <div className="mx-auto max-w-7xl px-6">
//                     <h2 className="mb-12 text-center text-3xl font-bold">Gallery</h2>

//                     <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
//                         {gallery.map((img, i) => (
//                             <img key={i} src={img} className="cursor-pointer rounded-lg transition hover:scale-105" />
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* POSTS */}

//             <section id="posts" className="py-20">
//                 <div className="mx-auto max-w-7xl px-6">
//                     <h2 className="mb-12 text-center text-3xl font-bold">Latest Posts</h2>

//                     <div className="grid gap-8 md:grid-cols-3">
//                         {posts.map((post) => (
//                             <div key={post.id} className="rounded-xl bg-white shadow hover:shadow-lg">
//                                 <img src={post.image} className="rounded-t-xl" />

//                                 <div className="p-6">
//                                     <h3 className="mb-3 text-xl font-semibold">{post.title}</h3>

//                                     <p className="mb-4 text-gray-600">{post.excerpt}</p>

//                                     <button className="font-semibold text-blue-600">Read More →</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* FOOTER */}

//             <footer className="bg-gray-900 py-10 text-gray-300">
//                 <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
//                     <div>
//                         <h3 className="mb-4 text-xl font-bold text-white">MyLogo</h3>
//                         <p>Modern Laravel + React landing page demo.</p>
//                     </div>

//                     <div>
//                         <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
//                         <ul className="space-y-2">
//                             <li>
//                                 <a href="#projects">Projects</a>
//                             </li>
//                             <li>
//                                 <a href="#gallery">Gallery</a>
//                             </li>
//                             <li>
//                                 <a href="#posts">Posts</a>
//                             </li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h4 className="mb-4 font-semibold text-white">Contact</h4>
//                         <p>Email: info@example.com</p>
//                         <p>Phone: +92 300 0000000</p>
//                     </div>
//                 </div>

//                 <div className="mt-10 text-center text-gray-500">© 2026 MyCompany</div>
//             </footer>
//         </div>
//     );
// }

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const gallery = [
        'https://picsum.photos/400/400?1',
        'https://picsum.photos/400/400?2',
        'https://picsum.photos/400/400?3',
        'https://picsum.photos/400/400?4',
        'https://picsum.photos/400/400?5',
        'https://picsum.photos/400/400?6',
    ];

    // Fetch projects
    useEffect(() => {
        axios
            .get('/api/projects')
            .then((res) => setProjects(res.data))
            .catch((err) => console.error('Failed to fetch projects', err));
    }, []);

    // Fetch posts (paginated)
    const fetchPosts = async (pageNumber = 1) => {
        try {
            const res = await axios.get(`/posts-home?page=${pageNumber}`);
            const newPosts = res.data.data;

            setPosts((prev) => [...prev, ...newPosts]);
            setHasMore(res.data.next_page_url !== null);
        } catch (error) {
            console.error('Failed to fetch posts', error);
            setHasMore(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPosts(page);
    }, []);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchPosts(nextPage);
                }
            },
            { threshold: 1 },
        );

        if (loader.current) observer.observe(loader.current);
        return () => observer.disconnect();
    }, [hasMore, page]);

    return (
        <div className="bg-gray-50 text-gray-800">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 bg-white shadow">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-blue-600">MyLogo</h1>
                    <nav className="hidden space-x-6 md:flex">
                        <a href="#projects" className="hover:text-blue-600">
                            Projects
                        </a>
                        <a href="#gallery" className="hover:text-blue-600">
                            Gallery
                        </a>
                        <a href="#posts" className="hover:text-blue-600">
                            Posts
                        </a>
                    </nav>
                    <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">Login</button>
                </div>
            </header>

            {/* HERO */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-24 text-white">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-5xl font-bold">Modern Laravel + React Platform</h2>
                        <p className="mb-8 text-lg">Build modern applications with projects, gallery and blog system.</p>
                        <div className="space-x-4">
                            <button className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600">Get Started</button>
                            <button className="rounded-lg border border-white px-6 py-3">View Projects</button>
                        </div>
                    </div>
                    <img src="https://picsum.photos/600/400" className="rounded-xl shadow-lg" />
                </div>
            </section>

            {/* PROJECTS */}
            <section id="projects" className="py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="mb-12 text-center text-3xl font-bold">Our Projects</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {projects.map((project) => (
                            <div key={project.id} className="rounded-xl bg-white shadow transition hover:shadow-lg">
                                <img src={project.image} className="rounded-t-xl" />
                                <div className="p-6">
                                    <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                                    <p className="mb-4 text-gray-600">{project.description}</p>
                                    <button className="font-semibold text-blue-600">View Project →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY */}
            <section id="gallery" className="bg-gray-100 py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="mb-12 text-center text-3xl font-bold">Gallery</h2>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                        {gallery.map((img, i) => (
                            <img key={i} src={img} className="cursor-pointer rounded-lg transition hover:scale-105" />
                        ))}
                    </div>
                </div>
            </section>

            {/* POSTS */}
            <section id="posts" className="py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="mb-12 text-center text-3xl font-bold">Latest Posts</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {posts.map((post) => (
                            <div key={post.id} className="rounded-xl bg-white shadow hover:shadow-lg">
                                {post.image && <img src={post.image} className="rounded-t-xl" />}
                                <div className="p-6">
                                    <h3 className="mb-3 text-xl font-semibold">{post.title}</h3>
                                    <p className="mb-4 text-gray-600">{post.content}</p>
                                    <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                                    <button className="font-semibold text-blue-600">Read More →</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div ref={loader} className="flex justify-center py-10">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && <div className="py-8 text-center font-medium text-gray-500">No more posts to show.</div>}

                    {posts.length === 0 && !hasMore && <div className="py-8 text-center font-medium text-gray-500">No posts available.</div>}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 py-10 text-gray-300">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
                    <div>
                        <h3 className="mb-4 text-xl font-bold text-white">MyLogo</h3>
                        <p>Modern Laravel + React landing page demo.</p>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#projects">Projects</a>
                            </li>
                            <li>
                                <a href="#gallery">Gallery</a>
                            </li>
                            <li>
                                <a href="#posts">Posts</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-white">Contact</h4>
                        <p>Email: info@example.com</p>
                        <p>Phone: +92 300 0000000</p>
                    </div>
                </div>
                <div className="mt-10 text-center text-gray-500">© 2026 MyCompany</div>
            </footer>
        </div>
    );
}
