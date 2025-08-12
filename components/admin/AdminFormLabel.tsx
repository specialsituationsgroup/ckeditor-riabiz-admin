export function AdminFormLabel({
    label,
    required,
}: {
    label: string;
    required?: boolean;
}) {
    return <label className="block font-semibold text-gray-600">{label}{`${required ? '*' : ''}`}</label>;
}
