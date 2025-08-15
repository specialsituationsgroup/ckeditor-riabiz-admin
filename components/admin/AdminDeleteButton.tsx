/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

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
