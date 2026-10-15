import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 text-gray-900 hover:text-gray-900 focus:border-indigo-700 focus:text-gray-900 dark:text-neutral-100 dark:hover:text-neutral-100 dark:focus:border-indigo-300 dark:focus:text-neutral-100'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-100 dark:focus:border-neutral-600 dark:focus:text-neutral-100') +
                className
            }
        >
            {children}
        </Link>
    );
}
