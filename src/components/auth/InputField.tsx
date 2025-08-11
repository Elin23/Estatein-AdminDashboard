import React from 'react';

interface InputFieldProps {
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  Icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
}

const InputField = ({ type, value, onChange, placeholder, Icon, required = false }: InputFieldProps) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple65 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

export default InputField;
