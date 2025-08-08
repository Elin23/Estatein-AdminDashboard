import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  icon: LucideIcon;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  required
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="block w-full pl-11 pr-3 py-3 text-gray-900 dark:text-white
                 placeholder-gray-500 dark:placeholder-gray-400
                 border border-gray-300 dark:border-gray-600
                 rounded-lg
                 bg-white dark:bg-gray-800
                 focus:outline-none focus:ring-2 focus:ring-purple70 focus:border-transparent
                 transition-all duration-200"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;