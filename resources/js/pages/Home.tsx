import React from 'react';
import { Link } from '@inertiajs/react';

// Define a type for a single post to ensure type-safety.
export type Post = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

// Define a type for the pagination links to ensure type-safety.
export type LinkItem = {
  url: string | null;
  label: string;
  active: boolean;
};

// Define a type for the posts prop, which includes pagination data.
export type PostsPaginated = {
  data: Post[];
  links: LinkItem[];
};

export default function Home({ posts }: { posts: PostsPaginated }) {
  return (
    <>
      <h1 className='title text-center text-xl pt-2'>Latest Posts</h1>
      <div>
        {posts.data.map(post => (
          <div key={post.id} className='p-4 border-b'>
            <div className='text-sm text-slate-600'>
              <span>Posted On:</span>{' '}
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <p className='font-medium'>{post.content}</p>
          </div>
        ))}
      </div>

      <div className='py-12 px-4'>
        {posts.links.map(link => (
          link.url ? (
            <Link
              key={link.label}
              href={link.url}
              // className={`p-1 mx-1 ${link.active ? 'text-blue-500 font-bold' : ''}`}
              className={` inline-block px-4 py-2 mx-1 rounded-full text-sm
               ${link.active ? 'bg-indigo-600 text-white font-semibold border-gray-300 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}
             ${!link.url && 'opacity-50 cursor-not-allowed'}`}>
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Link>
          ) : (
            <span
              key={link.label}
              className='p-1 mx-1 text-slate-300'
              dangerouslySetInnerHTML={{ __html: link.label }}
            ></span>
          )
        ))}
      </div>


    </>
  );
}
