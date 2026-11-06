import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <img src="/Japchi_logo_nobg.png" alt={name ?? 'JAPCHI'} className="size-8 rounded-md object-contain" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    JAPCHI
                </span>
            </div>
        </>
    );
}
