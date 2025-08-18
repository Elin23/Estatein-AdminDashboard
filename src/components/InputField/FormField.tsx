import React from "react";

type Option = {
    value: string;
    label: string;
};

interface FormFieldProps {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string | number;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void | Promise<void>;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

    type?: string; 
    required?: boolean;
    multiline?: boolean; 
    rows?: number; 
    select?: boolean; 
    options?: Option[]; 
    file?: boolean;
    accept?: string; 
    multiple?: boolean; 
    className?: string; 
}

export default function FormField({
    id,
    name,
    label,
    placeholder,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    type = "text",
    required = false,
    multiline = false,
    rows,
    select = false,
    options = [],
    file = false,
    accept,
    multiple = false,
    className = "",
}: FormFieldProps) {
    if (file) {
        return (
            <div className={`mb-2.5 ${className}`}>
                <label
                    htmlFor={id}
                    className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold text-gray-800 dark:text-white block"
                >
                    {label}
                </label>
                <input
                    id={id}
                    name={name}
                    type="file"
                    onChange={onChange}
                    accept={accept}
                    multiple={multiple}
                    required={required}
                    className="rounded-lg text-sm/[20px] 2xl:text-lg font-medium border border-black dark:border-white text-black dark:text-white px-5 py-4 bg-transparent w-full"
                />
            </div>
        );
    }

    return (
        <div className={`mb-2.5 ${className}`}>
            <label
                htmlFor={id}
                className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold text-gray-800 dark:text-white block"
            >
                {label}
            </label>

            {select ? (
                <select
                    id={id}
                    name={name}
                    value={value}
                    defaultValue={defaultValue as string}
                    onChange={onChange}
                    required={required}
                    className="rounded-lg border-black dark:border-white text-black dark:text-white text-sm/[20px] 2xl:text-lg font-medium border px-3 py-2 bg-transparent w-full"
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option
                            key={opt.value}
                            value={opt.value}
                            className="text-black dark:text-white dark:bg-gray-800"
                        >
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : multiline ? (
                <textarea
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    defaultValue={defaultValue as string}
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    required={required}
                    rows={rows}
                    className="rounded-lg text-sm/[20px] 2xl:text-lg font-medium border border-black dark:border-white text-black dark:text-white px-3 py-2 bg-transparent w-full resize-none"
                />
            ) : (
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    defaultValue={defaultValue as string | number}
                    onChange={onChange}
                    required={required}
                    className="rounded-lg text-sm/[20px] 2xl:text-lg font-medium border border-black dark:border-white text-black dark:text-white px-3 py-2 bg-transparent w-full"
                />
            )}
        </div>
    );
}
