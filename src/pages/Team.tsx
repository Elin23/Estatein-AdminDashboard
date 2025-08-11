import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, push, set, remove } from 'firebase/database';
import TeamForm from '../components/Team/TeamForm';
import { type TeamMember } from '../types/index';
import GenericCard from '../components/GenericCard/GenericCard';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export default function Team() {
    const role = useSelector((state: RootState) => state.auth.role) || '';
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [editing, setEditing] = useState<TeamMember | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const teamRef = ref(db, 'team');
        return onValue(teamRef, snap => {
            const data = snap.val() || {};
            const list: TeamMember[] = Object.entries(data).map(
                ([id, val]) => ({ id, ...(val as any) })
            );
            setMembers(list);
            setLoading(false);

        });
    }, []);


    const handleSave = async (memberData: Omit<TeamMember, 'id'>, id?: string) => {
        if (id) {
            await set(ref(db, `team/${id}`), memberData);
        } else {
            const newRef = push(ref(db, 'team'));
            await set(newRef, memberData);
        }
        setShowForm(false);
        setEditing(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this member?')) {
            await remove(ref(db, `team/${id}`));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Our Team</h1>
                {(role === "admin") && (<button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                    onClick={() => { setEditing(null); setShowForm(true); }}
                >
                    + Add Member
                </button>)}
            </div>

            {showForm && (
                <TeamForm
                    initialData={editing ?? undefined}
                    onCancel={() => { setShowForm(false); setEditing(null); }}
                    onSubmit={handleSave}
                />
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 huge:max-w-[1390px] huge:mx-auto">
                {loading ? Array.from({ length: 4 }).map((_, idx) => (
                    <GenericCard key={idx} loading />
                ))
                    : members.map((member) => (
                        <GenericCard
                            key={member.id}
                            title={member.name}
                            subtitle={member.role}
                            imageSrc={member.clientImage}
                            imageAlt={member.name}
                            onEdit={() => { setEditing(member); setShowForm(true); }}
                            onDelete={() => handleDelete(member.id)}
                            hasImage={true}

                        />
                    ))}
            </div>
        </div>
    );
}

