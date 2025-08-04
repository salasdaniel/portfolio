import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from '@/components/ui/tag-input';
import ColorPicker from '@/components/ColorPicker';
import { MultiSelect } from '@/components/ui/multi-select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Upload, Plus, Trash2, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface UserEducation {
    id?: number;
    institution: string;
    degree: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
    sort_order: number;
}

interface UserExperience {
    id?: number;
    position: string;
    company: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
    sort_order: number;
}

interface User {
    id: number;
    name: string;
    username?: string;
    email: string;
    email_verified_at?: string | null;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    github_url?: string;
    born_date?: string;
    profession?: string;
    description?: string;
    profile_image?: string;
    cv_file?: string;
    theme_color: string;
    programming_language_skills?: Array<{
        id: number;
        name: string;
        pivot: {
            description?: string;
            experience_level: string;
        };
    }>;
    framework_skills?: Array<{
        id: number;
        name: string;
        pivot: {
            description?: string;
            experience_level: string;
        };
    }>;
    other_technologies?: Array<{
        id: number;
        name: string;
        description?: string;
        experience_level: number;
        category?: string;
    }>;
    education?: UserEducation[];
    experience?: UserExperience[];
}

interface ProgrammingLanguage {
    id: number;
    name: string;
}

interface Framework {
    id: number;
    name: string;
}

interface Database {
    id: number;
    name: string;
}

interface Props {
    user: User;
    programmingLanguages: ProgrammingLanguage[];
    frameworks: Framework[];
    databases: Database[];
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({ user, programmingLanguages, frameworks, databases, mustVerifyEmail }: Props) {
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
        user.profile_image ? `/storage/${user.profile_image}` : null
    );
    
    const [cvFileName, setCvFileName] = useState<string | null>(
        user.cv_file ? user.cv_file.split('/').pop() || null : null
    );

    const [educationList, setEducationList] = useState<UserEducation[]>(user.education || []);
    const [experienceList, setExperienceList] = useState<UserExperience[]>(user.experience || []);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        born_date: user.born_date || '',
        profession: user.profession || '',
        description: user.description || '',
        theme_color: user.theme_color || '#3b82f6',
        programming_language_ids: user.programming_language_skills?.map(skill => skill.id) || [],
        framework_ids: user.framework_skills?.map(skill => skill.id) || [],
        database_ids: [] as number[],
        other_technologies: user.other_technologies?.map(tech => tech.name) || [],
    });

    // Separate state for files and complex data
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setProfileImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCvFile(file);
            setCvFileName(file.name);
        }
    };

    const addEducation = () => {
        const newEducation: UserEducation = {
            institution: '',
            degree: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            sort_order: educationList.length,
        };
        setEducationList([...educationList, newEducation]);
    };

    const removeEducation = (index: number) => {
        const updated = educationList.filter((_, i) => i !== index);
        setEducationList(updated);
    };

    const updateEducation = (index: number, field: keyof UserEducation, value: string | boolean) => {
        const updated = educationList.map((edu, i) => 
            i === index ? { ...edu, [field]: value } : edu
        );
        setEducationList(updated);
    };

    const addExperience = () => {
        const newExperience: UserExperience = {
            position: '',
            company: '',
            location: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            sort_order: experienceList.length,
        };
        setExperienceList([...experienceList, newExperience]);
    };

    const removeExperience = (index: number) => {
        const updated = experienceList.filter((_, i) => i !== index);
        setExperienceList(updated);
    };

    const updateExperience = (index: number, field: keyof UserExperience, value: string | boolean) => {
        const updated = experienceList.map((exp, i) => 
            i === index ? { ...exp, [field]: value } : exp
        );
        setExperienceList(updated);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post('/settings/profile', {
            preserveScroll: true,
            forceFormData: true,
            onBefore: () => {
                // Add files and complex data to the form right before submission
                if (profileImage) {
                    setData('profile_image' as any, profileImage);
                }
                
                if (cvFile) {
                    setData('cv_file' as any, cvFile);
                }
                
                setData('education' as any, educationList);
                setData('experience' as any, experienceList);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* Basic Information */}
                    <div>
                        <HeadingSmall title="Personal Information" />
                        <form onSubmit={submit} className="mt-6 space-y-6">
                            
                            {/* Profile Image */}
                            <div className="space-y-2">
                                <Label>Profile Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                        {profileImagePreview ? (
                                            <img
                                                src={profileImagePreview}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-muted-foreground">
                                                {data.name ? (data.name as string).charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            id="profile-image-input"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => {
                                                const input = document.getElementById('profile-image-input') as HTMLInputElement;
                                                input?.click();
                                            }}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Image
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            JPG, PNG or GIF. Max 2MB.
                                        </p>
                                    </div>
                                </div>
                                <InputError message={undefined} />
                            </div>

                            {/* CV Upload */}
                            <div className="space-y-2">
                                <Label>CV/Resume</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {cvFileName || 'No file selected'}
                                        </span>
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={handleCvChange}
                                            id="cv-file-input"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => {
                                                const input = document.getElementById('cv-file-input') as HTMLInputElement;
                                                input?.click();
                                            }}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload CV
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PDF, DOC or DOCX. Max 5MB.
                                        </p>
                                    </div>
                                </div>
                                <InputError message={undefined} />
                            </div>

                            {/* Basic Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name as string}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={data.username as string}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="@username"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email as string}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone as string}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location as string}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="City, Country"
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profession">Profession</Label>
                                    <Input
                                        id="profession"
                                        value={data.profession as string}
                                        onChange={(e) => setData('profession', e.target.value)}
                                        placeholder="e.g., Full Stack Developer"
                                    />
                                    <InputError message={errors.profession} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="born_date">Born Date</Label>
                                    <Input
                                        id="born_date"
                                        type="date"
                                        value={data.born_date as string}
                                        onChange={(e) => setData('born_date', e.target.value)}
                                    />
                                    <InputError message={errors.born_date} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                    <Input
                                        id="linkedin_url"
                                        type="url"
                                        value={data.linkedin_url as string}
                                        onChange={(e) => setData('linkedin_url', e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                    <InputError message={errors.linkedin_url} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="github_url">GitHub URL</Label>
                                    <Input
                                        id="github_url"
                                        type="url"
                                        value={data.github_url as string}
                                        onChange={(e) => setData('github_url', e.target.value)}
                                        placeholder="https://github.com/username"
                                    />
                                    <InputError message={errors.github_url} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Bio/Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description as string}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Theme Color */}
                            <ColorPicker
                                label="Theme Color"
                                value={data.theme_color as string}
                                onChange={(color: string) => setData('theme_color', color)}
                            />

                            {/* Skills Section */}
                            <div className="space-y-8 pt-6 border-t">
                                <HeadingSmall title="Skills & Technologies" />
                                
                                {/* Programming Languages */}
                                <div className="space-y-2">
                                    <MultiSelect
                                        label="Programming Languages"
                                        options={programmingLanguages}
                                        value={data.programming_language_ids as number[]}
                                        onChange={(values) => setData('programming_language_ids', values)}
                                        placeholder="Select programming languages"
                                    />
                                    {errors.programming_language_ids && (
                                        <p className="text-sm text-destructive">{errors.programming_language_ids}</p>
                                    )}
                                </div>

                                {/* Frameworks */}
                                <div className="space-y-2">
                                    <MultiSelect
                                        label="Frameworks"
                                        options={frameworks}
                                        value={data.framework_ids as number[]}
                                        onChange={(values) => setData('framework_ids', values)}
                                        placeholder="Select frameworks"
                                    />
                                    {errors.framework_ids && (
                                        <p className="text-sm text-destructive">{errors.framework_ids}</p>
                                    )}
                                </div>

                                {/* Databases */}
                                <div className="space-y-2">
                                    <MultiSelect
                                        label="Databases"
                                        options={databases}
                                        value={data.database_ids as number[]}
                                        onChange={(values) => setData('database_ids', values)}
                                        placeholder="Select databases"
                                    />
                                    {errors.database_ids && (
                                        <p className="text-sm text-destructive">{errors.database_ids}</p>
                                    )}
                                </div>

                                {/* Other Technologies */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Other Technologies
                                    </label>
                                    <TagInput
                                        value={data.other_technologies as string[]}
                                        onChange={(technologies) => setData('other_technologies', technologies)}
                                        placeholder="Type and press space to add technologies..."
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Add custom technologies not listed above. Type a technology and press space or enter to add it.
                                    </p>
                                    {errors.other_technologies && (
                                        <p className="text-sm text-destructive">{errors.other_technologies}</p>
                                    )}
                                </div>
                            </div>

                            {/* Education Section */}
                            <div className="space-y-6 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <HeadingSmall title="Education" />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={addEducation}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Education
                                    </Button>
                                </div>
                                
                                {educationList.map((edu, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Education {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeEducation(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Institution *</Label>
                                                <Input
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                    placeholder="University or School"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Degree *</Label>
                                                <Input
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                    placeholder="Bachelor's, Master's, etc."
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Field of Study</Label>
                                                <Input
                                                    value={edu.field_of_study || ''}
                                                    onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                                                    placeholder="Computer Science, Engineering, etc."
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Start Date *</Label>
                                                <Input
                                                    type="date"
                                                    value={edu.start_date}
                                                    onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>End Date</Label>
                                                <Input
                                                    type="date"
                                                    value={edu.end_date || ''}
                                                    onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                                                    disabled={edu.is_current}
                                                />
                                            </div>
                                            
                                            <div className="space-y-2 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`education-current-${index}`}
                                                    checked={edu.is_current}
                                                    onChange={(e) => {
                                                        updateEducation(index, 'is_current', e.target.checked);
                                                        if (e.target.checked) {
                                                            updateEducation(index, 'end_date', '');
                                                        }
                                                    }}
                                                    className="mr-2"
                                                />
                                                <Label htmlFor={`education-current-${index}`}>Currently studying</Label>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={edu.description || ''}
                                                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                                placeholder="Achievements, activities, coursework..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Experience Section */}
                            <div className="space-y-6 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <HeadingSmall title="Work Experience" />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={addExperience}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Experience
                                    </Button>
                                </div>
                                
                                {experienceList.map((exp, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Experience {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeExperience(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Position *</Label>
                                                <Input
                                                    value={exp.position}
                                                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                                    placeholder="Job Title"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Company *</Label>
                                                <Input
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                    placeholder="Company Name"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Location</Label>
                                                <Input
                                                    value={exp.location || ''}
                                                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Start Date *</Label>
                                                <Input
                                                    type="date"
                                                    value={exp.start_date}
                                                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>End Date</Label>
                                                <Input
                                                    type="date"
                                                    value={exp.end_date || ''}
                                                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                                    disabled={exp.is_current}
                                                />
                                            </div>
                                            
                                            <div className="space-y-2 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`experience-current-${index}`}
                                                    checked={exp.is_current}
                                                    onChange={(e) => {
                                                        updateExperience(index, 'is_current', e.target.checked);
                                                        if (e.target.checked) {
                                                            updateExperience(index, 'end_date', '');
                                                        }
                                                    }}
                                                    className="mr-2"
                                                />
                                                <Label htmlFor={`experience-current-${index}`}>Current position</Label>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={exp.description || ''}
                                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                                placeholder="Responsibilities, achievements, technologies used..."
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Profile'}
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600">Profile saved successfully!</p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    {/* Email Verification Notice */}
                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                Your email address is unverified. Please check your email for a verification link.
                            </p>
                        </div>
                    )}

                    {/* Delete Account */}
                    <div className="pt-6 border-t">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
