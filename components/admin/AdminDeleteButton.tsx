import { classNames } from "@/utils/tailwind";

type deleteButtonProps = {
    onclick: () => void;
    extraClassNames?: string;
    disabled: boolean;
};

export const DeleteButton = ({
    onclick,
    disabled,
    extraClassNames,
}: deleteButtonProps) => {
    return (
        <button
            type="button"
            className={classNames(
                "inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:text-white shadow-sm hover:bg-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-100 sm:w-auto",
                extraClassNames ? extraClassNames : ""
            )}
            onClick={() => {
                onclick();
            }}
            disabled={disabled}
        >
            Delete
        </button>
    );
};
