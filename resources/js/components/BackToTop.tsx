// import { ChevronUpIcon } from '@heroicons/react/24/solid';
// import { useEffect, useState } from 'react';

// export default function BackToTop() {
//     const [visible, setVisible] = useState(false);

//     // Detect scroll
//     useEffect(() => {
//         const toggleVisible = () => {
//             setVisible(window.scrollY > 400);
//         };
//         window.addEventListener('scroll', toggleVisible);
//         return () => window.removeEventListener('scroll', toggleVisible);
//     }, []);

//     // Smooth scroll
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth',
//         });
//     };

//     if (!visible) return null;

//     return (
//         <button
//             onClick={scrollToTop}
//             className="fixed right-8 bottom-8 z-50 animate-bounce cursor-pointer rounded-full bg-black p-3 text-white shadow-lg transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
//         >
//             <ChevronUpIcon className="h-5 w-5 font-bold" />
//         </button>
//     );
// }

import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisible = () => {
            setVisible(window.scrollY > 400);
        };
        window.addEventListener('scroll', toggleVisible);
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className={`fixed right-8 bottom-8 z-50 transition-all duration-500 ease-out ${visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
        >
            <button
                onClick={scrollToTop}
                className="animate-bounce cursor-pointer rounded-full bg-black p-4 text-white shadow-lg transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
            >
                <ChevronUpIcon className="h-5 w-5 font-bold" />
            </button>
        </div>
    );
}
