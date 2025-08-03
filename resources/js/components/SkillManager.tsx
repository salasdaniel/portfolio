import React from 'react';

interface Skill {
    id: number;
    name: string;
    pivot?: {
        experience_level: string;
    };
}

interface SkillManagerProps {
    skills: Skill[];
    availableSkills: Skill[];
    onChange: (skills: { id: number; experience_level: string }[]) => void;
    label: string;
    placeholder?: string;
}

const SkillManager: React.FC<SkillManagerProps> = ({
    skills = [],
    availableSkills = [],
    onChange,
    label,
    placeholder = "Buscar habilidades..."
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showDropdown, setShowDropdown] = React.useState(false);

    const selectedSkillIds = skills.map(skill => skill.id);
    
    const filteredAvailableSkills = availableSkills.filter(skill => 
        !selectedSkillIds.includes(skill.id) &&
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addSkill = (skillId: number) => {
        const skill = availableSkills.find(s => s.id === skillId);
        if (skill) {
            const newSkills = [
                ...skills.map(s => ({ 
                    id: s.id, 
                    experience_level: s.pivot?.experience_level || 'beginner' 
                })),
                { id: skillId, experience_level: 'beginner' }
            ];
            onChange(newSkills);
            setSearchTerm('');
            setShowDropdown(false);
        }
    };

    const removeSkill = (skillId: number) => {
        const newSkills = skills
            .filter(s => s.id !== skillId)
            .map(s => ({ 
                id: s.id, 
                experience_level: s.pivot?.experience_level || 'beginner' 
            }));
        onChange(newSkills);
    };

    const updateExperienceLevel = (skillId: number, experienceLevel: string) => {
        const newSkills = skills.map(s => ({
            id: s.id,
            experience_level: s.id === skillId ? experienceLevel : (s.pivot?.experience_level || 'beginner')
        }));
        onChange(newSkills);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            {/* Selected Skills */}
            <div className="space-y-2">
                {skills.map(skill => (
                    <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                            <select
                                value={skill.pivot?.experience_level || 'beginner'}
                                onChange={(e) => updateExperienceLevel(skill.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="beginner">Principiante</option>
                                <option value="intermediate">Intermedio</option>
                                <option value="advanced">Avanzado</option>
                                <option value="expert">Experto</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => removeSkill(skill.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Skill */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {showDropdown && searchTerm && filteredAvailableSkills.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredAvailableSkills.slice(0, 5).map(skill => (
                            <button
                                key={skill.id}
                                type="button"
                                onClick={() => addSkill(skill.id)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                            >
                                {skill.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillManager;
