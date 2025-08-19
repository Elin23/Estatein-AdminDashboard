import React from "react";

type Option = { value: string; label: string };

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
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;

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
  rows = 3,
  select = false,
  options = [],
  file = false,
  accept,
  multiple = false,
  className = "",
}: FormFieldProps) {
  const resolvedValue = value ?? undefined;
  const resolvedDefaultValue =
    value === undefined ? (defaultValue as any) : undefined;

  const baseInputCls =
    "w-full px-3 py-2 border border-black dark:border-white rounded text-black dark:text-white bg-transparent";

  return (
    <div className={`mb-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-1 text-black dark:text-white"
        >
          {label}
        </label>
      )}

      {file ? (
        <input
          id={id}
          name={name}
          type="file"
          onChange={onChange}
          accept={accept}
          multiple={multiple}
          required={required}
          className={baseInputCls}
        />
      ) : select ? (
        <select
          id={id}
          name={name}
          value={resolvedValue}
          defaultValue={resolvedDefaultValue as string}
          onChange={onChange}
          onKeyDown={onKeyDown}
          required={required}
          className={baseInputCls}
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
          value={resolvedValue}
          defaultValue={resolvedDefaultValue as string}
          onKeyDown={onKeyDown}
          onChange={onChange}
          required={required}
          rows={rows}
          className={`${baseInputCls} resize-none`}
          autoComplete="off"
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={resolvedValue}
          defaultValue={resolvedDefaultValue as string | number}
          onChange={onChange}
          onKeyDown={onKeyDown}
          required={required}
          className={baseInputCls}
          autoComplete="off"
        />
      )}
    </div>
  );
}
