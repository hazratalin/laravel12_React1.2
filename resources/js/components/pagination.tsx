import { Link } from '@inertiajs/react';
import React from 'react';

export type LinkItem = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Paginated = {
  links: LinkItem[];
};

export default function Pagination({ links }: Paginated) {
  return (
    <div>
      <nav className="text-center mt-4">
        {/* {links.map((link) => (
          <Link
          preserveScroll
            href={link.url || '#'}
            key={link.label}
            className={`inline-block py-2 px-3 rounded-lg text-xs text-gray-200
              ${link.active ? 'bg-gray-950' : ''}
              ${!link.url ? '!text-gray-500 cursor-not-allowed' : 'hover:bg-gray-950'}`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))} */}

                    {links.map((link) =>
                        link.url ? (
                            <Link
                            preserveScroll
                                key={link.label}
                                href={link.url || '#'}
                                className={`mx-1 inline-block rounded-full px-4 py-2 text-sm ${link.active ? 'border-gray-300 bg-indigo-600 font-semibold text-white hover:bg-gray-700 hover:text-gray-100' : 'text-gray-500 hover:bg-gray-100'} ${!link.url && 'cursor-not-allowed opacity-50'}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Link>
                        ) : (
                            <span key={link.label} className="mx-1 p-1 text-slate-300" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        ),
                    )}
      </nav>
    </div>
  );
}
