import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { route } from 'ziggy-js';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import { TagInput } from '@/components/ui/tag-input';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { Plus, Trash2, Save, Edit2, Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/panel',
    },
    {
        title: 'Experiences',
        href: '/experiences',
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

interface UserCertification {
    id?: number;
    institution: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
    certification_url?: string;
    sort_order: number;
    pin_order?: number;
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

interface UserSkill {
    id?: number;
    title: string;
    description?: string;
    icon?: string; // SVG format
    sort_order: number;
}

interface ProgrammingLanguage {
    id: number;
    name: string;
}

interface Database {
    id: number;
    name: string;
}

interface Framework {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    profession?: string;
    linkedin_url?: string;
    github_url?: string;
    cv_file?: string;
    education?: UserEducation[];
    experience?: UserExperience[];
    skills?: UserSkill[];
    certifications?: UserCertification[];
    programming_language_skills?: Array<{
        id: number;
        name: string;
        pivot: {
            description?: string;
            experience_level: string;
        };
    }>;
    database_skills?: Array<{
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
        experience_level?: number;
        category?: string;
        sort_order?: number;
    }>;
}

interface Props {
    user: User;
    programmingLanguages?: ProgrammingLanguage[];
    databases?: Database[];
    frameworks?: Framework[];
}

export default function Index({ user, programmingLanguages = [], databases = [], frameworks = [] }: Props) {
    const [educationList, setEducationList] = useState<UserEducation[]>([]);
    const [experienceList, setExperienceList] = useState<UserExperience[]>([]);
    const [skillsList, setSkillsList] = useState<UserSkill[]>([]);
    const [certificationList, setCertificationList] = useState<UserCertification[]>([]);
    const [savedEducations, setSavedEducations] = useState<UserEducation[]>(user.education || []);
    const [savedExperiences, setSavedExperiences] = useState<UserExperience[]>(user.experience || []);
    const [savedSkills, setSavedSkills] = useState<UserSkill[]>(user.skills || []);
    const [savedCertifications, setSavedCertifications] = useState<UserCertification[]>(user.certifications || []);
    const [savingEducation, setSavingEducation] = useState<number | null>(null);
    const [savingExperience, setSavingExperience] = useState<number | null>(null);
    const [savingSkill, setSavingSkill] = useState<number | null>(null);
    const [savingCertification, setSavingCertification] = useState<number | null>(null);

    // Estados para tecnologías
    const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState<number[]>(
        user.programming_language_skills?.map(skill => skill.id) || []
    );
    const [selectedDatabases, setSelectedDatabases] = useState<number[]>(
        user.database_skills?.map(skill => skill.id) || []
    );
    const [selectedFrameworks, setSelectedFrameworks] = useState<number[]>(
        user.framework_skills?.map(skill => skill.id) || []
    );
    const [otherTechnologies, setOtherTechnologies] = useState<string[]>(
        user.other_technologies?.map(tech => tech.name) || []
    );
    const [savingTechnologies, setSavingTechnologies] = useState(false);

    // Estados para campos profesionales
    const [profession, setProfession] = useState(user.profession || '');
    const [linkedinUrl, setLinkedinUrl] = useState(user.linkedin_url || '');
    const [githubUrl, setGithubUrl] = useState(user.github_url || '');
    const [savingProfessionalInfo, setSavingProfessionalInfo] = useState(false);

    // Estados para mensajes
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    // Confirmation dialog states
    const [deleteEducationId, setDeleteEducationId] = useState<number | null>(null);
    const [deleteExperienceId, setDeleteExperienceId] = useState<number | null>(null);
    const [deleteSkillId, setDeleteSkillId] = useState<number | null>(null);
    const [deleteCertificationId, setDeleteCertificationId] = useState<number | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [cvFileName, setCvFileName] = useState<string | null>(
        user.cv_file ? user.cv_file.split('/').pop() || null : null
    );

    // CV File handler
    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCvFile(file);
            setCvFileName(file.name);
        }
        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    };

    // Helper function to format dates
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return dateString.split('T')[0]; // Get only YYYY-MM-DD part
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

    const editEducation = (savedIndex: number) => {
        // Move the saved education record back to the edit form
        const educationToEdit = savedEducations[savedIndex];
        if (educationToEdit) {
            // Add to the education list for editing
            setEducationList([...educationList, educationToEdit]);
            // Remove from saved list
            setSavedEducations(savedEducations.filter((_, i) => i !== savedIndex));
        }
    };

    const updateEducation = (index: number, field: keyof UserEducation, value: string | boolean) => {
        const updated = educationList.map((edu, i) => {
            if (i === index) {
                const updatedEdu = { ...edu, [field]: value };
                // If setting is_current to true, clear end_date
                if (field === 'is_current' && value === true) {
                    updatedEdu.end_date = '';
                }
                return updatedEdu;
            }
            return edu;
        });
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

    const editExperience = (savedIndex: number) => {
        // Move the saved experience record back to the edit form
        const experienceToEdit = savedExperiences[savedIndex];
        if (experienceToEdit) {
            // Add to the experience list for editing
            setExperienceList([...experienceList, experienceToEdit]);
            // Remove from saved list
            setSavedExperiences(savedExperiences.filter((_, i) => i !== savedIndex));
        }
    };

    const updateExperience = (index: number, field: keyof UserExperience, value: string | boolean) => {
        const updated = experienceList.map((exp, i) => {
            if (i === index) {
                const updatedExp = { ...exp, [field]: value };
                // If setting is_current to true, clear end_date
                if (field === 'is_current' && value === true) {
                    updatedExp.end_date = '';
                }
                return updatedExp;
            }
            return exp;
        });
        setExperienceList(updated);
    };

    const handleEducationCurrentChange = (index: number, isChecked: boolean) => {
        const updated = educationList.map((edu, i) => {
            if (i === index) {
                const result = {
                    ...edu,
                    is_current: isChecked,
                    end_date: isChecked ? '' : edu.end_date
                };
                return result;
            }
            return edu;
        });
        setEducationList(updated);
    };

    const handleExperienceCurrentChange = (index: number, isChecked: boolean) => {
        const updated = experienceList.map((exp, i) => {
            if (i === index) {
                const result = {
                    ...exp,
                    is_current: isChecked,
                    end_date: isChecked ? '' : exp.end_date
                };
                return result;
            }
            return exp;
        });
        setExperienceList(updated);
    };

    const addSkill = () => {
        const newSkill: UserSkill = {
            title: '',
            description: '',
            icon: '',
            sort_order: skillsList.length,
        };
        setSkillsList([...skillsList, newSkill]);
    };

    const removeSkill = (index: number) => {
        const updated = skillsList.filter((_, i) => i !== index);
        setSkillsList(updated);
    };

    const editSkill = (savedIndex: number) => {
        // Move the saved skill record back to the edit form
        const skillToEdit = savedSkills[savedIndex];
        if (skillToEdit) {
            // Add to the skills list for editing
            setSkillsList([...skillsList, skillToEdit]);
            // Remove from saved list
            setSavedSkills(savedSkills.filter((_, i) => i !== savedIndex));
        }
    };

    const updateSkill = (index: number, field: keyof UserSkill, value: string) => {
        const updated = skillsList.map((skill, i) => {
            if (i === index) {
                return { ...skill, [field]: value };
            }
            return skill;
        });
        setSkillsList(updated);
    };

    // Certification functions
    const addCertification = () => {
        const newCertification: UserCertification = {
            institution: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            certification_url: '',
            sort_order: certificationList.length,
            pin_order: certificationList.length + 1,
        };
        setCertificationList([...certificationList, newCertification]);
    };

    const removeCertification = (index: number) => {
        const updated = certificationList.filter((_, i) => i !== index);
        setCertificationList(updated);
    };

    const editCertification = (savedIndex: number) => {
        // Move the saved certification record back to the edit form
        const certificationToEdit = savedCertifications[savedIndex];
        if (certificationToEdit) {
            // Add to the certification list for editing
            setCertificationList([...certificationList, certificationToEdit]);
            // Remove from saved list
            setSavedCertifications(savedCertifications.filter((_, i) => i !== savedIndex));
        }
    };

    const updateCertification = (index: number, field: keyof UserCertification, value: string | boolean | number) => {
        const updated = certificationList.map((cert, i) => {
            if (i === index) {
                const updatedCert = { ...cert, [field]: value };
                // If setting is_current to true, clear end_date
                if (field === 'is_current' && value === true) {
                    updatedCert.end_date = '';
                }
                return updatedCert;
            }
            return cert;
        });
        setCertificationList(updated);
    };

    const handleCertificationCurrentChange = (index: number, isChecked: boolean) => {
        const updated = certificationList.map((cert, i) => {
            if (i === index) {
                const result = {
                    ...cert,
                    is_current: isChecked,
                    end_date: isChecked ? '' : cert.end_date
                };
                return result;
            }
            return cert;
        });
        setCertificationList(updated);
    };

    const saveEducation = (index: number) => {
        const education = educationList[index];
        setSavingEducation(index);
        
        const formData = new FormData();
        if (education.id) formData.append('id', education.id.toString());
        formData.append('institution', education.institution);
        formData.append('degree', education.degree);
        if (education.field_of_study) formData.append('field_of_study', education.field_of_study);
        formData.append('start_date', education.start_date);
        if (education.end_date && !education.is_current) formData.append('end_date', education.end_date);
        formData.append('is_current', education.is_current ? 'true' : 'false');
        if (education.description) formData.append('description', education.description);
        formData.append('sort_order', education.sort_order.toString());

        fetch('/experiences/education', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setSavingEducation(null);
            
            // Always add the updated/new record to saved educations
            // If it was an edit, the record was already removed from savedEducations
            setSavedEducations([...savedEducations, data.education]);
            
            // Remove from form list
            const updated = educationList.filter((_, i) => i !== index);
            setEducationList(updated);
            
            setSuccess('Educación guardada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
        })
        .catch(error => {
            console.error('Error saving education:', error);
            setSavingEducation(null);
            setError('Error al guardar el registro de educación. Por favor intenta de nuevo.');
            setTimeout(() => setError(''), 5000);
        });
    };

    const saveExperience = (index: number) => {
        const experience = experienceList[index];
        setSavingExperience(index);
        
        const formData = new FormData();
        if (experience.id) formData.append('id', experience.id.toString());
        formData.append('position', experience.position);
        formData.append('company', experience.company);
        if (experience.location) formData.append('location', experience.location);
        formData.append('start_date', experience.start_date);
        if (experience.end_date && !experience.is_current) formData.append('end_date', experience.end_date);
        formData.append('is_current', experience.is_current ? 'true' : 'false');
        if (experience.description) formData.append('description', experience.description);
        formData.append('sort_order', experience.sort_order.toString());

        fetch('/experiences/work', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setSavingExperience(null);
            
            // Always add the updated/new record to saved experiences
            // If it was an edit, the record was already removed from savedExperiences
            setSavedExperiences([...savedExperiences, data.experience]);
            
            // Remove from form list
            const updated = experienceList.filter((_, i) => i !== index);
            setExperienceList(updated);
            
            setSuccess('Experiencia guardada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
        })
        .catch(error => {
            console.error('Error saving experience:', error);
            setSavingExperience(null);
            setError('Error al guardar el registro de experiencia. Por favor intenta de nuevo.');
            setTimeout(() => setError(''), 5000);
        });
    };

    const saveSkill = (index: number) => {
        const skill = skillsList[index];
        setSavingSkill(index);
        
        const formData = new FormData();
        if (skill.id) formData.append('id', skill.id.toString());
        formData.append('title', skill.title);
        if (skill.description) formData.append('description', skill.description);
        if (skill.icon) formData.append('icon', skill.icon);
        formData.append('sort_order', skill.sort_order.toString());

        // Get fresh CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (!csrfToken) {
            console.error('CSRF token not found');
            setSavingSkill(null);
            setError('Error: Token CSRF no encontrado. Por favor recarga la página.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        fetch('/experiences/skill', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 419) {
                    throw new Error('CSRF token mismatch. Please refresh the page and try again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setSavingSkill(null);
            
            // Always add the updated/new record to saved skills
            // If it was an edit, the record was already removed from savedSkills
            setSavedSkills([...savedSkills, data.skill]);
            
            // Remove from form list
            const updated = skillsList.filter((_, i) => i !== index);
            setSkillsList(updated);
            
            setSuccess('Habilidad guardada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
        })
        .catch(error => {
            console.error('Error saving skill:', error);
            setSavingSkill(null);
            if (error.message.includes('CSRF')) {
                setError(error.message);
            } else {
                setError('Error al guardar el registro de habilidad. Por favor intenta de nuevo.');
            }
            setTimeout(() => setError(''), 5000);
        });
    };

    const saveCertification = (index: number) => {
        const certification = certificationList[index];
        setSavingCertification(index);
        
        const formData = new FormData();
        if (certification.id) formData.append('id', certification.id.toString());
        formData.append('institution', certification.institution);
        if (certification.field_of_study) formData.append('field_of_study', certification.field_of_study);
        formData.append('start_date', certification.start_date);
        if (certification.end_date && !certification.is_current) formData.append('end_date', certification.end_date);
        formData.append('is_current', certification.is_current ? 'true' : 'false');
        if (certification.description) formData.append('description', certification.description);
        if (certification.certification_url) formData.append('certification_url', certification.certification_url);
        formData.append('sort_order', certification.sort_order.toString());
        if (certification.pin_order !== undefined && certification.pin_order !== null) {
            formData.append('pin_order', certification.pin_order.toString());
        }

        fetch('/experiences/certification', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setSavingCertification(null);
            
            // Always add the updated/new record to saved certifications
            // If it was an edit, the record was already removed from savedCertifications
            setSavedCertifications([...savedCertifications, data.certification]);
            
            // Remove from form list
            const updated = certificationList.filter((_, i) => i !== index);
            setCertificationList(updated);
            
            setSuccess('Certification saved successfully');
            setTimeout(() => setSuccess(''), 3000);
        })
        .catch(error => {
            console.error('Error saving certification:', error);
            setSavingCertification(null);
            setError('Error saving certification record. Please try again.');
            setTimeout(() => setError(''), 5000);
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Use fetch for the full form submission since we need to handle files and arrays
        const formData = new FormData();
        
        if (cvFile) {
            formData.append('cv_file', cvFile);
        }
        
        formData.append('education', JSON.stringify(educationList));
        formData.append('experience', JSON.stringify(experienceList));
        formData.append('skills', JSON.stringify(skillsList));
        formData.append('certifications', JSON.stringify(certificationList));

        fetch('/experiences', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        })
        .then(() => {
            setSuccess('Cambios guardados exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            window.location.reload();
        })
        .catch(() => {
            // Handle error if needed
        });
    };

    const deleteEducation = async (id: number) => {
        try {
            const response = await fetch(route('education.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                setSavedEducations(savedEducations.filter(edu => edu.id !== id));
                setSuccess('Educación eliminada exitosamente');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Error al eliminar la educación');
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            console.error('Error deleting education:', error);
            setError('Error al eliminar la educación');
            setTimeout(() => setError(''), 5000);
        } finally {
            setDeleteEducationId(null);
        }
    };

    const deleteExperience = async (id: number) => {
        try {
            const response = await fetch(route('experience.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                setSavedExperiences(savedExperiences.filter(exp => exp.id !== id));
                setSuccess('Experiencia eliminada exitosamente');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Error al eliminar la experiencia');
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            console.error('Error deleting experience:', error);
            setError('Error al eliminar la experiencia');
            setTimeout(() => setError(''), 5000);
        } finally {
            setDeleteExperienceId(null);
        }
    };

    const deleteSkill = async (id: number) => {
        try {
            const response = await fetch(route('skill.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                setSavedSkills(savedSkills.filter(skill => skill.id !== id));
                setSuccess('Habilidad eliminada exitosamente');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Error al eliminar la habilidad');
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            setError('Error al eliminar la habilidad');
            setTimeout(() => setError(''), 5000);
        } finally {
            setDeleteSkillId(null);
        }
    };

    const deleteCertification = async (id: number) => {
        try {
            const response = await fetch(route('certification.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                setSavedCertifications(savedCertifications.filter(cert => cert.id !== id));
                setSuccess('Certification deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Error deleting certification');
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            console.error('Error deleting certification:', error);
            setError('Error deleting certification');
            setTimeout(() => setError(''), 5000);
        } finally {
            setDeleteCertificationId(null);
        }
    };

    const saveTechnologies = async () => {
        setSavingTechnologies(true);
        
        const formData = new FormData();
        
        // Convert arrays to JSON strings for Laravel to parse
        formData.append('programming_languages', JSON.stringify(selectedProgrammingLanguages));
        formData.append('databases', JSON.stringify(selectedDatabases));
        formData.append('frameworks', JSON.stringify(selectedFrameworks));
        formData.append('other_technologies', JSON.stringify(otherTechnologies));

        try {
            const response = await fetch('/experiences/technologies', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
            });

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (response.ok) {
                try {
                    const data = JSON.parse(responseText);
                    console.log('Parsed data:', data);
                    
                    // Update states with saved data
                    if (data.programming_languages) {
                        setSelectedProgrammingLanguages(data.programming_languages.map((lang: { id: number }) => lang.id));
                    }
                    if (data.databases) {
                        setSelectedDatabases(data.databases.map((db: { id: number }) => db.id));
                    }
                    if (data.frameworks) {
                        setSelectedFrameworks(data.frameworks.map((fw: { id: number }) => fw.id));
                    }
                    if (data.other_technologies) {
                        setOtherTechnologies(data.other_technologies.map((tech: { name: string }) => tech.name));
                    }
                    
                    setSuccess('Tecnologías guardadas exitosamente');
                    setTimeout(() => setSuccess(''), 3000);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    setError(`Error al procesar respuesta del servidor`);
                    setTimeout(() => setError(''), 5000);
                }
            } else {
                console.error('Server response:', responseText);
                setError(`Error al guardar las tecnologías: ${response.status}`);
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            console.error('Error saving technologies:', error);
            setError('Error de conexión al guardar las tecnologías');
            setTimeout(() => setError(''), 5000);
        } finally {
            setSavingTechnologies(false);
        }
    };

    const saveProfessionalInfo = async () => {
        setSavingProfessionalInfo(true);
        
        const formData = new FormData();
        formData.append('profession', profession);
        formData.append('linkedin_url', linkedinUrl);
        formData.append('github_url', githubUrl);
        
        if (cvFile) {
            formData.append('cv_file', cvFile);
        }

        try {
            const response = await fetch('/experiences/professional-info', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setSuccess('Información profesional guardada exitosamente');
                setTimeout(() => setSuccess(''), 3000);
                // Reset CV file state after successful save
                setCvFile(null);
            } else {
                setError('Error al guardar la información profesional');
            }
        } catch (error) {
            console.error('Error saving professional info:', error);
            setError('Error al guardar la información profesional');
        } finally {
            setSavingProfessionalInfo(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Experiences" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Professional Experience</h1>
                </div>

                {/* Status Messages */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Technologies Section */}
                    <div className="rounded-lg border bg-card p-6">
                        <div className="space-y-6">
                            <HeadingSmall title="Technologies & Skills" />
                            
                            {/* Programming Languages */}
                            <div className="space-y-2">
                                <MultiSelect
                                    label="Programming Languages"
                                    options={programmingLanguages}
                                    value={selectedProgrammingLanguages}
                                    onChange={setSelectedProgrammingLanguages}
                                    placeholder="Select programming languages"
                                />
                            </div>

                            {/* Databases */}
                            <div className="space-y-2">
                                <MultiSelect
                                    label="Databases"
                                    options={databases}
                                    value={selectedDatabases}
                                    onChange={setSelectedDatabases}
                                    placeholder="Select databases"
                                />
                            </div>

                            {/* Frameworks */}
                            <div className="space-y-2">
                                <MultiSelect
                                    label="Frameworks & Libraries"
                                    options={frameworks}
                                    value={selectedFrameworks}
                                    onChange={setSelectedFrameworks}
                                    placeholder="Select frameworks and libraries"
                                />
                            </div>

                            {/* Other Technologies */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Other Technologies
                                </label>
                                <TagInput
                                    value={otherTechnologies}
                                    onChange={setOtherTechnologies}
                                    placeholder="Type and press space to add technologies..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Add custom technologies not listed above. Type a technology and press space or enter to add it.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    type="button" 
                                    onClick={saveTechnologies}
                                    disabled={savingTechnologies}
                                >
                                    {savingTechnologies ? 'Saving...' : 'Save Technologies'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information Section */}
                    <div className="rounded-lg border bg-card p-6">
                        <div className="space-y-6">
                            <HeadingSmall title="Professional Information" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Profession */}
                                <div className="space-y-2">
                                    <Label htmlFor="profession">Profession</Label>
                                    <Input
                                        id="profession"
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        placeholder="e.g., Full Stack Developer"
                                    />
                                </div>

                                {/* LinkedIn URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                    <Input
                                        id="linkedin_url"
                                        type="url"
                                        value={linkedinUrl}
                                        onChange={(e) => setLinkedinUrl(e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>

                                {/* GitHub URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="github_url">GitHub URL</Label>
                                    <Input
                                        id="github_url"
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/username"
                                    />
                                </div>

                                {/* CV File Upload */}
                                <div className="space-y-2">
                                    <Label>CV File</Label>
                                    <div className="flex items-center gap-4">
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
                                        {cvFileName && (
                                            <span className="text-sm text-muted-foreground">
                                                {cvFileName}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        PDF, DOC, or DOCX format. Max 5MB.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    type="button" 
                                    onClick={saveProfessionalInfo}
                                    disabled={savingProfessionalInfo}
                                >
                                    {savingProfessionalInfo ? 'Saving...' : 'Save Professional Info'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <form onSubmit={submit} className="space-y-8">

                            {/* Skills Section */}
                            <div className="space-y-6 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <HeadingSmall title="Skills" />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={addSkill}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Skill
                                    </Button>
                                </div>
                                
                                {(skillsList.length === 0 && savedSkills.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No skills added yet.</p>
                                        <p className="text-sm">Click "Add Skill" to get started.</p>
                                    </div>
                                )}
                                
                                {skillsList.map((skill, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Skill {index + 1}</h4>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => saveSkill(index)}
                                                    disabled={savingSkill === index}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {savingSkill === index ? 'Saving...' : 'Save'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeSkill(index)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Title *</Label>
                                                <Input
                                                    value={skill.title}
                                                    onChange={(e) => updateSkill(index, 'title', e.target.value)}
                                                    placeholder="e.g. JavaScript, Project Management"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Icon (SVG)</Label>
                                                <Textarea
                                                    value={skill.icon || ''}
                                                    onChange={(e) => updateSkill(index, 'icon', e.target.value)}
                                                    placeholder="<svg>...</svg> or icon name"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={skill.description || ''}
                                                onChange={(e) => updateSkill(index, 'description', e.target.value)}
                                                placeholder="Describe your proficiency level and experience with this skill..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Saved Skills Table */}
                            {savedSkills.length > 0 && (
                                <div className="space-y-4">
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left p-4 font-medium">Icon</th>
                                                    <th className="text-left p-4 font-medium">Title</th>
                                                    <th className="text-left p-4 font-medium">Description</th>
                                                    <th className="text-left p-4 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedSkills.map((skill, index) => (
                                                    <tr key={skill.id || index} className="border-t">
                                                        <td className="p-4">
                                                            {skill.icon ? (
                                                                <div className="w-8 h-8 flex items-center justify-center">
                                                                    {skill.icon.startsWith('<svg') ? (
                                                                        <div dangerouslySetInnerHTML={{ __html: skill.icon }} />
                                                                    ) : (
                                                                        <span className="text-2xl">{skill.icon}</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                                                    <span className="text-xs">?</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-4 font-medium">{skill.title}</td>
                                                        <td className="p-4">
                                                            {skill.description ? (
                                                                <span className="text-sm text-muted-foreground">
                                                                    {skill.description.length > 100 
                                                                        ? `${skill.description.substring(0, 100)}...` 
                                                                        : skill.description
                                                                    }
                                                                </span>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => editSkill(index)}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => skill.id && setDeleteSkillId(skill.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Work Experience Section */}
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
                                
                                {(experienceList.length === 0 && savedExperiences.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No work experience records added yet.</p>
                                        <p className="text-sm">Click "Add Experience" to get started.</p>
                                    </div>
                                )}
                                
                                {experienceList.map((exp, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Experience {index + 1}</h4>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => saveExperience(index)}
                                                    disabled={savingExperience === index}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {savingExperience === index ? 'Saving...' : 'Save'}
                                                </Button>
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
                                                <Checkbox
                                                    id={`experience-current-${index}`}
                                                    checked={exp.is_current}
                                                    onCheckedChange={(checked) => {
                                                        handleExperienceCurrentChange(index, checked === true);
                                                    }}
                                                />
                                                <Label htmlFor={`experience-current-${index}`} className="ml-2">Current position</Label>
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

                            {/* Saved Experience Table */}
                            {savedExperiences.length > 0 && (
                                <div className="space-y-4 ">
                                    {/* <HeadingSmall title="Saved Work Experience Records" /> */}
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left p-4 font-medium">Position</th>
                                                    <th className="text-left p-4 font-medium">Company</th>
                                                    <th className="text-left p-4 font-medium">Location</th>
                                                    <th className="text-left p-4 font-medium">Period</th>
                                                    <th className="text-left p-4 font-medium">Status</th>
                                                    <th className="text-left p-4 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedExperiences.map((exp, index) => (
                                                    <tr key={exp.id || index} className="border-t">
                                                        <td className="p-4 font-medium">{exp.position}</td>
                                                        <td className="p-4">{exp.company}</td>
                                                        <td className="p-4">{exp.location || '-'}</td>
                                                        <td className="p-4">
                                                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : 'N/A')}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                exp.is_current 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {exp.is_current ? 'Current' : 'Completed'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => editExperience(index)}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => exp.id && setDeleteExperienceId(exp.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                            )}

                            
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
                                
                                {(educationList.length === 0 && savedEducations.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No education records added yet.</p>
                                        <p className="text-sm">Click "Add Education" to get started.</p>
                                    </div>
                                )}
                                
                                {educationList.map((edu, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Education {index + 1}</h4>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => saveEducation(index)}
                                                    disabled={savingEducation === index}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {savingEducation === index ? 'Saving...' : 'Save'}
                                                </Button>
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
                                                <Checkbox
                                                    id={`education-current-${index}`}
                                                    checked={edu.is_current}
                                                    onCheckedChange={(checked) => {
                                                        handleEducationCurrentChange(index, checked === true);
                                                    }}
                                                />
                                                <Label htmlFor={`education-current-${index}`} className="ml-2">Currently studying</Label>
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

                            {/* Saved Education Table */}
                            {savedEducations.length > 0 && (
                                <div className="space-y-4">
                                    {/* <HeadingSmall title="Saved Education Records" /> */}
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left p-4 font-medium">Institution</th>
                                                    <th className="text-left p-4 font-medium">Degree</th>
                                                    <th className="text-left p-4 font-medium">Field</th>
                                                    <th className="text-left p-4 font-medium">Period</th>
                                                    <th className="text-left p-4 font-medium">Status</th>
                                                    <th className="text-left p-4 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedEducations.map((edu, index) => (
                                                    <tr key={edu.id || index} className="border-t">
                                                        <td className="p-4 font-medium">{edu.institution}</td>
                                                        <td className="p-4">{edu.degree}</td>
                                                        <td className="p-4">{edu.field_of_study || '-'}</td>
                                                        <td className="p-4">
                                                            {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : (edu.end_date ? formatDate(edu.end_date) : 'N/A')}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                edu.is_current 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {edu.is_current ? 'Current' : 'Completed'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => editEducation(index)}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => edu.id && setDeleteEducationId(edu.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Certifications Section */}
                            <div className="space-y-6 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <HeadingSmall title="Certifications" />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={addCertification}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Certification
                                    </Button>
                                </div>
                                
                                {(certificationList.length === 0 && savedCertifications.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No certifications added yet.</p>
                                        <p className="text-sm">Click "Add Certification" to get started.</p>
                                    </div>
                                )}
                                
                                {certificationList.map((cert, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Certification {index + 1}</h4>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => saveCertification(index)}
                                                    disabled={savingCertification === index}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {savingCertification === index ? 'Saving...' : 'Save'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeCertification(index)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Institution *</Label>
                                                <Input
                                                    value={cert.institution}
                                                    onChange={(e) => updateCertification(index, 'institution', e.target.value)}
                                                    placeholder="Certification Provider"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Field of Study</Label>
                                                <Input
                                                    value={cert.field_of_study || ''}
                                                    onChange={(e) => updateCertification(index, 'field_of_study', e.target.value)}
                                                    placeholder="e.g., Information Technology"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Start Date *</Label>
                                                <Input
                                                    type="date"
                                                    value={cert.start_date}
                                                    onChange={(e) => updateCertification(index, 'start_date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>End Date</Label>
                                                <Input
                                                    type="date"
                                                    value={cert.end_date || ''}
                                                    onChange={(e) => updateCertification(index, 'end_date', e.target.value)}
                                                    disabled={cert.is_current}
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Certification URL</Label>
                                                <Input
                                                    value={cert.certification_url || ''}
                                                    onChange={(e) => updateCertification(index, 'certification_url', e.target.value)}
                                                    placeholder="https://..."
                                                    type="url"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label>Pin Order</Label>
                                                <Input
                                                    value={cert.pin_order || ''}
                                                    onChange={(e) => updateCertification(index, 'pin_order', parseInt(e.target.value) || 0)}
                                                    placeholder="Order number"
                                                    type="number"
                                                    min="1"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2 flex items-center">
                                                <Checkbox
                                                    id={`certification-current-${index}`}
                                                    checked={cert.is_current}
                                                    onCheckedChange={(checked) => {
                                                        handleCertificationCurrentChange(index, checked === true);
                                                    }}
                                                />
                                                <Label htmlFor={`certification-current-${index}`} className="ml-2">Currently pursuing</Label>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={cert.description || ''}
                                                onChange={(e) => updateCertification(index, 'description', e.target.value)}
                                                placeholder="Key skills learned, certificate details..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Saved Certifications Table */}
                            {savedCertifications.length > 0 && (
                                <div className="space-y-4">
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left p-4 font-medium">Institution</th>
                                                    <th className="text-left p-4 font-medium">Field</th>
                                                    <th className="text-left p-4 font-medium">Period</th>
                                                    <th className="text-left p-4 font-medium">Certificate</th>
                                                    <th className="text-left p-4 font-medium">Pin Order</th>
                                                    <th className="text-left p-4 font-medium">Status</th>
                                                    <th className="text-left p-4 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedCertifications.map((cert, index) => (
                                                    <tr key={cert.id || index} className="border-t">
                                                        <td className="p-4 font-medium">{cert.institution}</td>
                                                        <td className="p-4">{cert.field_of_study || '-'}</td>
                                                        <td className="p-4 text-sm text-muted-foreground">
                                                            {formatDate(cert.start_date)} - {cert.is_current ? 'Present' : (cert.end_date ? formatDate(cert.end_date) : 'N/A')}
                                                        </td>
                                                        <td className="p-4">
                                                            {cert.certification_url ? (
                                                                <a href={cert.certification_url} target="_blank" rel="noopener noreferrer" 
                                                                   className="text-blue-600 hover:text-blue-800 underline">
                                                                    View Certificate
                                                                </a>
                                                            ) : '-'}
                                                        </td>
                                                        <td className="p-4">{cert.pin_order || '-'}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${cert.is_current ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {cert.is_current ? 'Pursuing' : 'Completed'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => editCertification(index)}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive"
                                                                    onClick={() => cert.id && setDeleteCertificationId(cert.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialogs */}
            <AlertDialog open={deleteEducationId !== null} onOpenChange={() => setDeleteEducationId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que quieres eliminar este registro de educación? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteEducationId && deleteEducation(deleteEducationId)}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteExperienceId !== null} onOpenChange={() => setDeleteExperienceId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que quieres eliminar este registro de experiencia laboral? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteExperienceId && deleteExperience(deleteExperienceId)}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteSkillId !== null} onOpenChange={() => setDeleteSkillId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que quieres eliminar esta habilidad? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteSkillId && deleteSkill(deleteSkillId)}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteCertificationId !== null} onOpenChange={() => setDeleteCertificationId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this certification record? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteCertificationId && deleteCertification(deleteCertificationId)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
