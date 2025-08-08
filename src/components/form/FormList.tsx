import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { DynamicForm } from '../../types';

interface FormListProps {
  forms: DynamicForm[];
  onEdit: (form: DynamicForm) => void;
  onDelete: (id: string) => void;
}

const FormList: React.FC<FormListProps> = ({ forms, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => (
        <div key={form.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{form.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{form.category}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(form)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(form.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {form.fields.length} fields • Created {form.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormList;