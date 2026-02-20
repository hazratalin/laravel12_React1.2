import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    image_url?: string;
    roles: { id: number; name: string }[];
    created_at: string;
    updated_at: string;
}

interface Props {
    user: User;
}

const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500'];

export default function Show({ user }: Props) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: '/users' },
                { title: user.name, href: `/users/${user.id}` },
            ]}
        >
            <Head title={`User: ${user.name}`} />

            <div className="mt-8 flex flex-col items-center">
                {/* Back Button */}
                <Link
                    href="/users"
                    className="mb-6 inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Link>

                {/* User Card */}
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg transition-colors duration-300 dark:bg-gray-800 dark:shadow-gray-900">
                    <div className="flex flex-col items-center">
                        <img
                            src={user.image_url || '/images/fallback.jpg'}
                            alt={user.name}
                            className="mb-4 h-32 w-32 transform rounded-full border-4 border-indigo-600 object-cover transition-transform duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/30 dark:border-indigo-400"
                        />
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="mt-1 text-gray-500 dark:text-gray-300">{user.email}</p>

                        {/* Roles */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {user.roles?.length ? (
                                user.roles.map((role, index) => (
                                    <span
                                        key={role.id}
                                        className={`rounded px-3 py-1 text-sm font-medium text-white ${bgColors[index % bgColors.length]}`}
                                    >
                                        {role.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-400 dark:text-gray-500">No roles assigned</span>
                            )}
                        </div>

                        {/* Timestamps */}
                        <div className="mt-6 w-full border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-300">
                            <p>
                                <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// import AppLayout from '@/layouts/app-layout';
// import { Head, Link } from '@inertiajs/react';
// import { ArrowLeft } from 'lucide-react';

// interface User {
//     id: number;
//     name: string;
//     email: string;
//     image_url?: string;
//     roles: { id: number; name: string }[];
//     created_at: string;
//     updated_at: string;
// }

// interface Props {
//     user: User;
// }

// const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500'];

// export default function Show({ user }: Props) {
//     return (
//         <AppLayout
//             breadcrumbs={[
//                 { title: 'Users', href: '/users' },
//                 { title: user.name, href: `/users/${user.id}` },
//             ]}
//         >
//             <Head title={`User: ${user.name}`} />

//             <div className="mt-8 flex flex-col items-center">
//                 {/* Back Button */}
//                 <Link href="/users" className="mb-6 inline-flex items-center text-gray-500 hover:text-gray-700">
//                     <ArrowLeft className="mr-2 h-4 w-4" />
//                     Back to Users
//                 </Link>

//                 {/* User Card */}
//                 <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg transition-colors duration-300 dark:bg-gray-800 dark:shadow-gray-900">
//                     <div className="flex flex-col items-center">
//                         <img
//                             src={user.image_url || '/images/fallback.jpg'}
//                             alt={user.name}
//                             className="mb-4 h-32 w-32 rounded-full border-4 border-indigo-600 object-cover"
//                         />
//                         <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
//                         <p className="mt-1 text-gray-500">{user.email}</p>

//                         {/* Roles */}
//                         <div className="mt-3 flex flex-wrap gap-2">
//                             {user.roles?.length ? (
//                                 user.roles.map((role, index) => (
//                                     <span
//                                         key={role.id}
//                                         className={`rounded px-3 py-1 text-sm font-medium text-white ${bgColors[index % bgColors.length]}`}
//                                     >
//                                         {role.name}
//                                     </span>
//                                 ))
//                             ) : (
//                                 <span className="text-sm text-gray-400">No roles assigned</span>
//                             )}
//                         </div>

//                         {/* Timestamps */}
//                         <div className="mt-6 w-full border-t border-gray-200 pt-4 text-sm text-gray-500">
//                             <p>
//                                 <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
//                             </p>
//                             <p>
//                                 <strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleDateString()}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
