import { TableHead } from '@/components/ui/table';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';

type TableHeadingProps = {
    name: string;
    sortable?: boolean;
    sort_field?: string | null;
    sort_direction?: 'asc' | 'desc' | null;
    sortChanged: (field: string) => void;
    children: React.ReactNode;
};

export default function TableHeading({ name, sortable = true, sort_field = null, sort_direction = null, sortChanged, children }: TableHeadingProps) {
    const activeIcon = 'text-gray-900 dark:text-white';
    const inactiveIcon = 'text-gray-400 dark:text-gray-500';

    const isAsc = sort_field === name && sort_direction === 'asc';
    const isDesc = sort_field === name && sort_direction === 'desc';

    return (
        <TableHead onClick={sortable ? () => sortChanged(name) : undefined}>
            <div className={`flex items-center justify-between gap-1 px-3 py-3 ${sortable ? 'cursor-pointer' : ''}`}>
                {children}

                {sortable && (
                    <div className="pointer-events-none flex flex-col leading-none">
                        <ChevronUpIcon
                            className={`w-4 transition-all duration-200 ease-out ${isAsc ? activeIcon + ' -translate-y-0.5 scale-110 opacity-100' : inactiveIcon + ' opacity-60'} `}
                        />

                        <ChevronDownIcon
                            className={`-mt-1 w-4 transition-all duration-200 ease-out ${isDesc ? activeIcon + ' translate-y-0.5 scale-110 opacity-100' : inactiveIcon + ' opacity-60'} `}
                        />
                    </div>
                )}
            </div>
        </TableHead>
    );
}

// import { TableHead } from '@/components/ui/table';
// import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';

// type TableHeadingProps = {
//     name: string;
//     sortable?: boolean;
//     sort_field?: string | null;
//     sort_direction?: 'asc' | 'desc' | null;
//     sortChanged?: (field: string) => void;
//     children: React.ReactNode;
// };

// export default function TableHeading({
//     name,
//     sortable = true,
//     sort_field = null,
//     sort_direction = null,
//     sortChanged = () => {},
//     children,
// }: TableHeadingProps) {
//     const activeIcon = 'text-gray-900 dark:text-white';
//     const inactiveIcon = 'text-gray-400 dark:text-gray-500';

//     return (
//         <TableHead onClick={sortable ? () => sortChanged(name) : undefined}>
//             <div className="flex cursor-pointer items-center justify-between gap-1 px-3 py-3">
//                 {children}
//                 {sortable && (
//                     <div>
//                         <ChevronUpIcon className={'w-4 ' + (sort_field === name && sort_direction === 'asc' ? activeIcon : inactiveIcon)} />

//                         <ChevronDownIcon className={'-mt-2 w-4 ' + (sort_field === name && sort_direction === 'desc' ? activeIcon : inactiveIcon)} />
//                     </div>
//                 )}
//             </div>
//         </TableHead>
//     );
// }
