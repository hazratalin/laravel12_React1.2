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
                className="cursor-pointer rounded-full bg-white p-4 text-black shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] transition-all hover:-translate-y-[1px] hover:bg-gray-50 dark:bg-[#161615] dark:text-white dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] dark:hover:bg-[#262625]"
            >
                <ChevronUpIcon className="h-5 w-5 font-bold" />
            </button>
        </div>
    );
}
