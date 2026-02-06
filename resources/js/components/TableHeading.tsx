export default function TableHeading({ name, sortable = true, sort_field = null, sort_direction = null, sortChanged = () => {} }) {
    return (
        // <th
        //     onClick={onClick}
        //     className="border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-sm font-semibold text-gray-900"
        // >
        //     {children}
        // </th>
        <TableHead onClick={() => sortChanged(name)}>
            <div className="flex cursor-pointer items-center justify-between gap-1 px-3 py-3">
                {children}
                {sortable && (
                    <div>
                        <ChevronUpIcon className={'w-4 ' + (sort_field === 'status' && sort_direction === 'asc' ? 'text-white' : 'text-gray-400')} />
                        <ChevronDownIcon
                            className={'-mt-2 w-4 ' + (sort_field === 'status' && sort_direction === 'desc' ? 'text-white' : 'text-gray-400')}
                        />
                    </div>
                )}
            </div>
        </TableHead>
    );
}
