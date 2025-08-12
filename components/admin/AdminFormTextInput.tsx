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
