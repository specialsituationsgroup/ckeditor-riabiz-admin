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

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export function AdminFormTextInput({
    placeholder,
    register,
    disabled,
    type,
    onChange
}: {
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    register: UseFormRegisterReturn<string>;
}) {
    return (
        <input
            type={type ?? "string"}
            placeholder={placeholder ?? ""}
            disabled={disabled}
            {...register}
            className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            onChange={onChange ?? undefined}
        />
    );
}
