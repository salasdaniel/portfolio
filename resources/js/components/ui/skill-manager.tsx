import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { SelectField } from './select-field';
import { Plus, X } from 'lucide-react';

interface Skill {
    id?: number;
    name?: string;
    description?: string;
    experience_level: number;
    category?: string;
}

interface SkillManagerProps {
    title: string;
    skills: Skill[];
    onChange: (skills: Skill[]) => void;
    availableOptions?: Array<{ id: number; name: string }>;
    allowCustom?: boolean;
    showCategory?: boolean;
    categories?: string[];
}

const experienceLevels = [
    { value: 1, label: 'Beginner' },
    { value: 2, label: 'Basic' },
    { value: 3, label: 'Intermediate' },
    { value: 4, label: 'Advanced' },
    { value: 5, label: 'Expert' },
];

export function SkillManager({ 
    title, 
    skills, 
    onChange, 
    availableOptions, 
    allowCustom = false,
    showCategory = false,
    categories = []
}: SkillManagerProps) {
    const addSkill = () => {
        const newSkill: Skill = {
            ...(allowCustom ? { name: '' } : { id: undefined }),
            description: '',
            experience_level: 1,
            ...(showCategory ? { category: '' } : {})
        };
        onChange([...skills, newSkill]);
    };

    const updateSkill = (index: number, field: keyof Skill, value: string | number | undefined | null) => {
        const updatedSkills = skills.map((skill, i) => 
            i === index ? { ...skill, [field]: value } : skill
        );
        onChange(updatedSkills);
    };

    const removeSkill = (index: number) => {
        onChange(skills.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkill}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {title.slice(0, -1)}
                </Button>
            </div>

            <div className="space-y-4">
                {skills.map((skill, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Skill Selection/Input */}
                                {allowCustom ? (
                                    <div className="space-y-2">
                                        <Label>Technology Name</Label>
                                        <Input
                                            value={skill.name || ''}
                                            onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                            placeholder="e.g., Docker, AWS, Redis"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label>Select {title.slice(0, -1)}</Label>
                                        <SelectField
                                            options={availableOptions || []}
                                            value={skill.id?.toString() || ''}
                                            onValueChange={(value) => updateSkill(index, 'id', value ? parseInt(value) : undefined)}
                                            placeholder={`Select ${title.slice(0, -1).toLowerCase()}...`}
                                        />
                                    </div>
                                )}

                                {/* Experience Level */}
                                <div className="space-y-2">
                                    <Label>Experience Level</Label>
                                    <SelectField
                                        options={experienceLevels.map(level => ({ 
                                            id: level.value, 
                                            name: level.label 
                                        }))}
                                        value={skill.experience_level?.toString() || '1'}
                                        onValueChange={(value) => updateSkill(index, 'experience_level', parseInt(value || '1'))}
                                    />
                                </div>

                                {/* Category (for custom technologies) */}
                                {showCategory && (
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <SelectField
                                            options={categories.map(cat => ({ id: cat, name: cat }))}
                                            value={skill.category || ''}
                                            onValueChange={(value) => updateSkill(index, 'category', value)}
                                            placeholder="Select category..."
                                        />
                                    </div>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSkill(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea
                                value={skill.description || ''}
                                onChange={(e) => updateSkill(index, 'description', e.target.value)}
                                placeholder="Describe your experience with this technology..."
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {skills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No {title.toLowerCase()} added yet.</p>
                    <p className="text-sm">Click "Add {title.slice(0, -1)}" to get started.</p>
                </div>
            )}
        </div>
    );
}
