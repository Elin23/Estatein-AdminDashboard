import { TeamMember } from '../../types/index';

interface Props {
    member: TeamMember;
    onEdit: () => void;
    onDelete: () => void;
}

export default function TeamCard({ member, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <img
                src={member.clientImage}
                alt={member.name}
                className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg text-white font-bold">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={onEdit}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
