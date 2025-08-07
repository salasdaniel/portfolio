import { SearchableSelectFieldDark } from '@/components/ui/searchable-select-field-dark';
import { useState } from 'react';
import { router } from '@inertiajs/react';


interface User {
    id: number;
    name: string;
    username: string;
    profession?: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    github_url?: string;
    profile_image?: string;
    cv_file?: string;
    description?: string;
    theme_color?: string;
    education?: Array<{
        degree?: string;
        institution?: string;
        description?: string;
        start_date?: string;
        end_date?: string;
    }>;
    experience?: Array<{
        position?: string;
        company?: string;
        description?: string;
        start_date?: string;
        end_date?: string;
    }>;
    skills?: Array<{
        title?: string;
        description?: string;
        icon?: string;
    }>;
    programming_language_skills?: Array<{
        id?: number;
        name?: string;
        pivot?: {
            experience_level?: string;
        };
    }>;
    database_skills?: Array<{
        id?: number;
        name?: string;
        pivot?: {
            experience_level?: string;
        };
    }>;
    framework_skills?: Array<{
        id?: number;
        name?: string;
        pivot?: {
            experience_level?: string;
        };
    }>;
    other_technologies?: Array<{
        name?: string;
        level?: string;
    }>;
}

interface Experience {
    id: number;
    position: string;
    company: string;
    description?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    location?: string;
    employment_type?: string;
    created_at: string;
    updated_at: string;
}

interface Education {
    id: number;
    degree: string;
    institution: string;
    description?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    field_of_study?: string;
    grade?: string;
    created_at: string;
    updated_at: string;
}

interface Certification {
    id: number;
    institution: string;
    field_of_study?: string;
    description?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    certification_url?: string;
    pin_order?: number;
    created_at: string;
    updated_at: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    repo_url?: string;
    live_url?: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
    environment_id: number;
    user_id: number;
    status_id: number;
    database_id: number;
    project_type_id: number;
    is_private: boolean;
    is_pinned: boolean;
    pin_order?: number;
    programming_languages: string[];
    frameworks: string[];
    tags: string[];
    environment: string;
    status: string;
    database: string;
    project_type: string;
}

interface Props {
    user: User;
    projects: Project[];
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
    username: string;
}

export default function Show({ user, projects, experience, education, certifications }: Props) {
    const [activeSection, setActiveSection] = useState('about');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Filter states
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [selectedFramework, setSelectedFramework] = useState<string>('all');
    const [selectedDatabase, setSelectedDatabase] = useState<string>('all');

    // Contact form states
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    console.log('Projects data:', user.theme_color);
    

    // Contact form handlers
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...contactForm,
                    username: user.username
                })
            });

            const data = await response.json();

            if (data.success) {
                setSubmitMessage('Message sent successfully! Thank you for reaching out.');
                setContactForm({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitMessage(data.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setSubmitMessage('Failed to send message. Please try again or contact me directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Debug logs to see what data is being received
    // console.log('User data:', user);
    // console.log('Programming Languages:', user.programming_language_skills);
    // console.log('Database Skills:', user.database_skills);
    // console.log('Framework Skills:', user.framework_skills);
    // console.log('User Skills:', user.skills);
    // console.log('Projects:', projects);

    // Debug specific project data
    // if (projects && projects.length > 0) {
    //     console.log('Projects data:', projects);
    // }

    // Get unique values for filters
    const getUniqueLanguages = () => {
        const languages = new Set<string>();
        projects?.forEach(project => {
            project.programming_languages?.forEach(lang => languages.add(lang));
        });
        return Array.from(languages).sort().map(lang => ({ id: lang, name: lang }));
    };

    const getUniqueFrameworks = () => {
        const frameworks = new Set<string>();
        projects?.forEach(project => {
            project.frameworks?.forEach(fw => frameworks.add(fw));
        });
        return Array.from(frameworks).sort().map(fw => ({ id: fw, name: fw }));
    };

    const getUniqueDatabases = () => {
        const databases = new Set<string>();
        projects?.forEach(project => {
            if (project.database) databases.add(project.database);
        });
        return Array.from(databases).sort().map(db => ({ id: db, name: db }));
    };

    // Filter projects based on selected filters
    const getFilteredProjects = () => {
        if (!projects) return [];

        const filtered = projects.filter(project => {
            const languageMatch = selectedLanguage === 'all' ||
                project.programming_languages?.includes(selectedLanguage);

            const frameworkMatch = selectedFramework === 'all' ||
                project.frameworks?.includes(selectedFramework);

            const databaseMatch = selectedDatabase === 'all' ||
                project.database === selectedDatabase;

            return languageMatch && frameworkMatch && databaseMatch;
        });

        // Sort projects: pinned first by pin_order, then non-pinned
        return filtered.sort((a, b) => {
            // If both are pinned, sort by pin_order
            if (a.is_pinned && b.is_pinned) {
                return (a.pin_order || 0) - (b.pin_order || 0);
            }
            // If only a is pinned, a comes first
            if (a.is_pinned && !b.is_pinned) {
                return -1;
            }
            // If only b is pinned, b comes first
            if (!a.is_pinned && b.is_pinned) {
                return 1;
            }
            // If neither is pinned, maintain original order
            return 0;
        });
    };

    const clearAllFilters = () => {
        setSelectedLanguage('all');
        setSelectedFramework('all');
        setSelectedDatabase('all');
    };

    const filteredProjects = getFilteredProjects();

    const openProjectModal = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeProjectModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
            {/* Estilos para el carrusel scrolleable */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scroll-container {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .scroll-container::-webkit-scrollbar {
                    display: none;
                }
                
                /* Prevent autocomplete styling */
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                textarea:-webkit-autofill,
                textarea:-webkit-autofill:hover,
                textarea:-webkit-autofill:focus {
                    -webkit-box-shadow: 0 0 0 1000px #1a1a1a inset !important;
                    -webkit-text-fill-color: #ffffff !important;
                    background-color: #1a1a1a !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                `
            }} />
            
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4"
                style={{
                    backgroundColor: '#2c2c2c',
                    background: 'linear-gradient(145deg, #2c2c2c 0%, #252525 50%, #2a2a2a 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden">
                            {user.profile_image ? (
                                <img
                                    src={`/storage/${user.profile_image}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: user.theme_color }}>
                                    <span className="text-xl font-bold" style={{ color: '#121212' }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold" style={{ color: '#ffffff' }}>
                                {user.name}
                            </h1>
                            <p className="text-sm" style={{ color: '#cccccc' }}>
                                {user.username}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg transition-all duration-300"
                        style={{ backgroundColor: '#1a1a1a' }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                
                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0  p-4 rounded-b-lg"
                        style={{
                            backgroundColor: '#2c2c2c',
                            background: 'linear-gradient(145deg, #2c2c2c 0%, #252525 50%, #2a2a2a 100%)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        }}>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    setActiveSection('about');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                                    activeSection === 'about' ? 'border-l-4' : 'hover:opacity-80'
                                }`}
                                style={{
                                    borderColor: activeSection === 'about' ? user.theme_color : 'transparent',
                                    backgroundColor: activeSection === 'about' ? '#1a1a1a' : 'transparent',
                                    color: activeSection === 'about' ? '#ffffff' : '#888888'
                                }}
                            >
                                About
                            </button>
                            <button
                                onClick={() => {
                                    setActiveSection('projects');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                                    activeSection === 'projects' ? 'border-l-4' : 'hover:opacity-80'
                                }`}
                                style={{
                                    borderColor: activeSection === 'projects' ? user.theme_color : 'transparent',
                                    backgroundColor: activeSection === 'projects' ? '#1a1a1a' : 'transparent',
                                    color: activeSection === 'projects' ? '#ffffff' : '#888888'
                                }}
                            >
                                Projects
                            </button>
                            <button
                                onClick={() => {
                                    setActiveSection('resume');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                                    activeSection === 'resume' ? 'border-l-4' : 'hover:opacity-80'
                                }`}
                                style={{
                                    borderColor: activeSection === 'resume' ? user.theme_color : 'transparent',
                                    backgroundColor: activeSection === 'resume' ? '#1a1a1a' : 'transparent',
                                    color: activeSection === 'resume' ? '#ffffff' : '#888888'
                                }}
                            >
                                Resume
                            </button>
                            <button
                                onClick={() => {
                                    setActiveSection('contact');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                                    activeSection === 'contact' ? 'border-l-4' : 'hover:opacity-80'
                                }`}
                                style={{
                                    borderColor: activeSection === 'contact' ? user.theme_color : 'transparent',
                                    backgroundColor: activeSection === 'contact' ? '#1a1a1a' : 'transparent',
                                    color: activeSection === 'contact' ? '#ffffff' : '#888888'
                                }}
                            >
                                Contact
                            </button>
                            <button
                                onClick={() => {
                                    router.visit('/');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 hover:opacity-80"
                                style={{ color: '#888888' }}
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex">
                {/* Left Sidebar - Profile Information - Desktop Only */}
                <div className="hidden lg:flex fixed top-0 left-0 w-80 h-screen p-8 flex-col items-center justify-center text-center"
                    style={{
                        backgroundColor: '#2c2c2c',
                        background: 'linear-gradient(145deg, #2c2c2c 0%, #252525 50%, #2a2a2a 100%)',
                        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                    {/* Profile Image */}
                    <p className="text-lg mb-4 opacity-80 transition-opacity duration-300 hover:opacity-100" style={{ color: 'rgba(203, 209, 205, 1)' }}>
                        {user.username}
                    </p>

                    <div className="relative w-40 h-40 rounded-full mb-6 overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-105"
                        style={{

                            boxShadow: '0 8px 32px #B3B3BB3',

                        }}>
                        {user.profile_image ? (
                            <img
                                src={`/storage/${user.profile_image}`}
                                alt={user.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-5xl font-bold transition-all duration-300 group-hover:scale-110" style={{ color: '#121212' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}

                    </div>

                    {/* Name and Username */}
                    <h1 className="text-2xl font-bold mb-2 transition-all duration-300 hover:scale-105"
                        style={{
                            color: '#ffffff',
                            textShadow: '0 2px 10px rgba(255, 255, 255, 0.1)'
                        }}>
                        {user.name}
                    </h1>

                    {/* Profession Badge */}
                    {user.profession && (
                        <div className="my-4">
                            <span className="px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                                style={{
                                    backgroundColor: user.theme_color,
                                    color: '#121212',
                                    background: user.theme_color,
                                    boxShadow: '0 4px 15px #66656526',
                                    border: '1px solid rgba(29, 185, 84, 0.5)'
                                }}>
                                {user.profession}
                            </span>
                        </div>
                    )}

                    {/* Separator Line */}
                    <div className="relative w-3/4 h-px my-6 overflow-hidden">

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 "></div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-4 w-full">
                        {/* Email */}
                        {user.email && (
                            <div className="">
                                <h3 className="text-xs font-semibold mb-1 transition-colors duration-300" style={{ color: '#cccccc99' }}>
                                    EMAIL
                                </h3>
                                <h2 className="transition-all duration-300 group-hover:text-green-400" style={{ color: '#ffffff' }}>
                                    {user.email}
                                </h2>
                            </div>
                        )}

                        {/* Phone */}
                        {user.phone && (
                            <div className="">
                                <h3 className="text-xs font-semibold mb-1 transition-colors duration-300" style={{ color: 'rgba(204, 204, 204, 0.6)' }}>
                                    PHONE
                                </h3>
                                <p className="text-sm transition-all duration-300 group-hover:text-green-400" style={{ color: '#ffffff' }}>
                                    {user.phone}
                                </p>
                            </div>
                        )}

                        {/* Location */}
                        {user.location && (
                            <div className="">
                                <h3 className="text-xs font-semibold mb-1 transition-colors duration-300" style={{ color: 'rgba(204, 204, 204, 0.6)' }}>
                                    LOCATION
                                </h3>
                                <p className="text-sm transition-all duration-300 group-hover:text-green-400" style={{ color: '#ffffff' }}>
                                    {user.location}
                                </p>
                            </div>
                        )}

                        <div className="relative w-3/4 h-px my-6 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 "></div>
                        </div>
                        {/* Social Links */}
                        {(user.github_url || user.linkedin_url) && (
                            <div className="pt-4">
                                <div className="flex justify-center gap-4">
                                    {user.github_url && (
                                        <a
                                            href={user.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 group relative overflow-hidden"

                                        >
                                            <svg className="w-6 h-6 transition-all duration-300 group-hover:scale-110 z-10 relative" fill="#ffffff" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%]"></div>
                                        </a>
                                    )}
                                    {user.linkedin_url && (
                                        <a
                                            href={user.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 group relative overflow-hidden"

                                        >
                                            <svg className="w-6 h-6 transition-all duration-300 group-hover:scale-110 z-10 relative" fill="#ffffff" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%]"></div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 lg:ml-80 p-4 lg:p-8 pt-20 lg:pt-8 relative">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}></div>

                    {/* Navigation Tabs - Desktop Only */}
                    <div className="hidden lg:block relative z-10 mt-4 lg:mt-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold transition-all duration-300 hover:text-orange-400" style={{ color: '#ffffff' }}>
                                {activeSection === 'about' ? 'About Me' :
                                    activeSection === 'projects' ? 'My Projects' :
                                        activeSection === 'resume' ? 'Resume' :
                                            activeSection === 'contact' ? 'Contact Me' : 'About Me'}
                            </h2>
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveSection('about')}
                                    className={`py-4 px-2 font-medium text-sm relative group transition-all duration-300 ${activeSection === 'about'
                                        ? 'border-b-2'
                                        : 'hover:opacity-80 hover:text-orange-400'
                                        }`}
                                    style={{
                                        borderColor: activeSection === 'about' ? user.theme_color : 'transparent',
                                        color: activeSection === 'about' ? '#ffffff' : '#888888'
                                    }}
                                >
                                    About
                                </button>
                                <button
                                    onClick={() => setActiveSection('projects')}
                                    className={`py-4 px-2 font-medium text-sm relative group transition-all duration-300 ${activeSection === 'projects'
                                        ? 'border-b-2'
                                        : 'hover:opacity-80 hover:text-orange-400'
                                        }`}
                                    style={{
                                        borderColor: activeSection === 'projects' ? user.theme_color : 'transparent',
                                        color: activeSection === 'projects' ? '#ffffff' : '#888888'
                                    }}
                                >
                                    Projects
                                </button>
                                <button
                                    onClick={() => setActiveSection('resume')}
                                    className={`py-4 px-2 font-medium text-sm relative group transition-all duration-300 ${activeSection === 'resume'
                                        ? 'border-b-2'
                                        : 'hover:opacity-80 hover:text-orange-400'
                                        }`}
                                    style={{
                                        borderColor: activeSection === 'resume' ? user.theme_color : 'transparent',
                                        color: activeSection === 'resume' ? '#ffffff' : '#888888'
                                    }}
                                >
                                    Resume
                                </button>

                                <button
                                    onClick={() => setActiveSection('contact')}
                                    className={`py-4 px-2 font-medium text-sm relative group transition-all duration-300 ${activeSection === 'contact'
                                        ? 'border-b-2'
                                        : 'hover:opacity-80 hover:text-orange-400'
                                        }`}
                                    style={{
                                        borderColor: activeSection === 'contact' ? user.theme_color : 'transparent',
                                        color: activeSection === 'contact' ? '#ffffff' : '#888888'
                                    }}
                                >
                                    Contact
                                </button>
                                <a onClick={() => router.visit('/')} className="py-4 px-2 font-medium hover:cursor-pointer text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                    Exit
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Mobile Section Title */}
                    <div className="lg:hidden relative z-10 mt-8">
                        <h2 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
                            {activeSection === 'about' ? 'About Me' :
                                activeSection === 'projects' ? 'My Projects' :
                                    activeSection === 'resume' ? 'Resume' :
                                        activeSection === 'contact' ? 'Contact Me' : 'About Me'}
                        </h2>
                    </div>

                    {/* Conditional Content Based on Active Section */}
                    {activeSection === 'about' ? (
                        <>
                            {/* About Me Section */}
                            <div className="mb-8 lg:mb-12 relative z-10">
                                <div className="relative w-12 h-1 mb-4 lg:mb-6 rounded-full overflow-hidden">
                                    <div className="absolute inset-0" style={{ backgroundColor: user.theme_color }}></div>
                                </div>

                                {user.description && (
                                    <p className="text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 transition-all duration-300 hover:text-gray-200" style={{ color: '#cccccc' }}>
                                        {user.description}
                                    </p>
                                )}
                            </div>

                            {/* What I'm Doing Section */}
                            <div className="mb-8 lg:mb-12">
                                <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#ffffff' }}>
                                    What I'm Doing
                                </h2>
                                <div className="relative w-12 h-1 mb-6 lg:mb-8 rounded-full overflow-hidden">
                                    <div className="absolute inset-0" style={{ backgroundColor: user.theme_color }}></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill, index) => (
                                            <div key={index} className="flex items-start space-x-3 lg:space-x-4 p-4 lg:p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0" >
                                                    {skill.icon ? (
                                                        <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:p-2" style={{ color: '#ffffff', fill: '#ffffff' }} />
                                                    ) : (
                                                        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg lg:text-xl font-semibold mb-1 lg:mb-2" style={{ color: '#ffffff' }}>
                                                        {skill.title}
                                                    </h3>
                                                    <p className="text-sm lg:text-base" style={{ color: '#cccccc' }}>
                                                        {skill.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        /* Default fallback cards if no skills data */
                                        <>
                                            <div className="flex items-start space-x-3 lg:space-x-4 p-4 lg:p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: user.theme_color }}>
                                                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                        <path d="M17 2v2h3v16H4V4h3V2H5C3.9 2 3 2.9 3 4v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-2z" />
                                                        <path d="M9 2v2h6V2c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg lg:text-xl font-semibold mb-1 lg:mb-2" style={{ color: '#ffffff' }}>
                                                        Mobile Apps
                                                    </h3>
                                                    <p className="text-sm lg:text-base" style={{ color: '#cccccc' }}>
                                                        Professional development of applications for Android and iOS.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3 lg:space-x-4 p-4 lg:p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ffffff' }}>
                                                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg lg:text-xl font-semibold mb-1 lg:mb-2" style={{ color: '#ffffff' }}>
                                                        Web Development
                                                    </h3>
                                                    <p className="text-sm lg:text-base" style={{ color: '#cccccc' }}>
                                                        High-quality development of sites at the professional level.
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stack Section */}
                            {(user.programming_language_skills?.length || user.framework_skills?.length || user.database_skills?.length) && (
                                <div className="mb-8 lg:mb-12">
                                    <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#ffffff' }}>
                                        Stack
                                    </h2>
                                    <div className="relative w-12 h-1 mb-6 lg:mb-8 rounded-full overflow-hidden">
                                        <div className="absolute inset-0" style={{ backgroundColor: user.theme_color }}></div>
                                    </div>

                                    {/* Technologies Container */}
                                    <div className="flex flex-wrap gap-3 lg:gap-4 justify-center lg:justify-start">
                                        {/* Programming Languages */}
                                        {user.programming_language_skills?.map((skill, index) => (
                                            <div key={`prog-${index}`} className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
                                                style={{
                                                    backgroundColor: '#1a1a1a',
                                                }}>
                                                <span className="text-xs lg:text-sm font-bold text-center px-1" style={{ color: '#ffffff' }}>
                                                    {skill.name}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Frameworks */}
                                        {user.framework_skills?.map((skill, index) => (
                                            <div key={`framework-${index}`} className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
                                                style={{
                                                    backgroundColor: '#1a1a1a',
                                                }}>
                                                <span className="text-xs lg:text-sm font-bold text-center px-1" style={{ color: '#ffffff' }}>
                                                    {skill.name}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Databases */}
                                        {user.database_skills?.map((skill, index) => (
                                            <div key={`db-${index}`} className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
                                                style={{
                                                    backgroundColor: '#1a1a1a',
                                                }}>
                                                <span className="text-xs lg:text-sm font-bold text-center px-1" style={{ color: '#ffffff' }}>
                                                    {skill.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Technologies Section */}
                            {user.other_technologies?.length && (
                                <div className="mb-8 lg:mb-12">
                                    <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#ffffff' }}>
                                        Other Technologies
                                    </h2>
                                    <div className="relative w-12 h-1 mb-6 lg:mb-8 rounded-full overflow-hidden">
                                        <div className="absolute inset-0" style={{ backgroundColor: user.theme_color }}></div>
                                    </div>

                                    {/* Technologies Tags */}
                                    <div className="flex flex-wrap gap-2 lg:gap-3">
                                        {user.other_technologies.map((tech, index) => (
                                            <div key={index} className="px-3 py-3 lg:px-4 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
                                                style={{
                                                    backgroundColor: '#2c2c2c',
                                                }}>
                                                <span className="text-xs lg:text-sm font-medium" style={{ color: '#cccccc' }}>
                                                    {tech.name}
                                                </span>
                                                {tech.level && (
                                                    <span className="text-xs ml-1 lg:ml-2 opacity-70" style={{ color: '#cccccc' }}>
                                                        {tech.level}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : activeSection === 'resume' ? (
                        /* Resume Section - Experience and Education Combined */
                        <div className="mb-12 relative z-10">
                            <div className="relative w-12 h-1 mb-6 rounded-full overflow-hidden">
                                <div className="absolute inset-0" style={{ backgroundColor: user.theme_color }}></div>
                            </div>

                            {/* Download CV Button */}
                            {user.cv_file && (
                                <div className="mb-8 flex justify-right">
                                    <a
                                        href={`/storage/${user.cv_file}`}
                                        download
                                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 hover:scale-105 "
                                        style={{
                                            backgroundColor: user.theme_color,
                                            color: '#121212',
                                            background: user.theme_color ,
                                           
                                        }}
                                    >
                                        
                                        <span className="transition-all duration-300 group-hover:tracking-wide">Download CV</span>
                                        <svg className="w-5 h-5 transition-transform duration-300 " fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12,16L16,12H13V4H11V12H8L12,16M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z" />
                                        </svg>
                                    </a>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Work Experience Section */}
                                <div className="mb-8">
                                    <div className="flex items-center mb-8">
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" >
                                            <svg className="w-10 h-10" fill="#ffffffff" viewBox="0 0 24 24">
                                                <path d="M20 6h-2V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 4h8v2H8V4zm12 15H4V8h16v11z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold " style={{ color: '#ffffff' }}>
                                            Experience
                                        </h3>

                                    </div>

                                    {experience && experience.length > 0 ? (
                                        <div className="relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>

                                            <div className="space-y-8">
                                                {experience.map((exp, index) => (
                                                    <div key={exp.id} className="relative pl-12">
                                                        {/* Timeline dot */}
                                                        <div
                                                            className="absolute left-2.5 w-3 h-3 rounded-full  border-gray-600"
                                                            style={{ backgroundColor: index === 0 ? user.theme_color : '#888888' }}
                                                        ></div>

                                                        <div className="">
                                                            <h4 className="text-2xl mb-2 " style={{ color: '#ffffff' }}>
                                                                {exp.position}
                                                            </h4>
                                                            <h5 className="text-base " style={{ color: '#cccccc' }}>
                                                                {exp.company}
                                                            </h5>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#cccccc' }}>
                                                                <span style={{ color: user.theme_color }}>
                                                                    {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {' '}
                                                                    {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                                                                </span>
                                                                {exp.location && (
                                                                    <span>📍 {exp.location}</span>
                                                                )}
                                                                {exp.employment_type && (
                                                                    <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: '#1a1a1a' }}>
                                                                        {exp.employment_type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {exp.description && (
                                                                <div className="">
                                                                    {exp.description.split('\n').map((line, lineIndex) => {
                                                                        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                                                                            return (
                                                                                <div key={lineIndex} className="flex items-start ">
                                                                                    <span className="mr-2 mt-1" style={{ color: user.theme_color }}>●</span>
                                                                                    <span className="text-sm leading-relaxed" style={{ color: '#cccccc' }}>
                                                                                        {line.replace(/^[•-]\s*/, '')}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        } else if (line.trim()) {
                                                                            return (
                                                                                <p key={lineIndex} className="text-sm leading-relaxed " style={{ color: '#cccccc' }}>
                                                                                    {line}
                                                                                </p>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#888888' }}>
                                                <path d="M20 6h-2V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 4h8v2H8V4zm12 15H4V8h16v11z" />
                                            </svg>
                                            <p className="text-sm" style={{ color: '#888888' }}>
                                                No work experience records yet
                                            </p>
                                        </div>
                                    )}
                                </div>



                                {/* Certifications Section */}
                                <div className="mb-8">
                                    <div className="flex items-center mb-8">
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" >
                                            <svg className="w-10 h-10" fill="#ffffffff" viewBox="0 0 24 24">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold " style={{ color: '#ffffff' }}>
                                            Certifications
                                        </h3>
                                    </div>

                                    {certifications && certifications.length > 0 ? (
                                        <div className="relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>

                                            <div className="space-y-8">
                                                {certifications.map((cert, index) => (
                                                    <div key={cert.id} className="relative pl-12">
                                                        {/* Timeline dot */}
                                                        <div
                                                            className="absolute left-2.5 w-3 h-3 rounded-full "
                                                            style={{ backgroundColor: index === 0 ? user.theme_color : '#888888' }}
                                                        ></div>

                                                        <div className="">
                                                            <h4 className="text-2xl mb-2" style={{ color: '#ffffff' }}>
                                                                {cert.field_of_study || 'Certification'}
                                                            </h4>
                                                            <h5 className="text-base " style={{ color: '#cccccc' }}>
                                                                {cert.institution}
                                                            </h5>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#cccccc' }}>
                                                                <span style={{ color: user.theme_color }}>
                                                                    {new Date(cert.start_date).toLocaleDateString('en-US', { year: 'numeric' })} — {' '}
                                                                    {cert.is_current ? 'Present' : cert.end_date ? new Date(cert.end_date).toLocaleDateString('en-US', { year: 'numeric' }) : 'Present'}
                                                                </span>
                                                                {cert.certification_url && (
                                                                    <a href={cert.certification_url} target="_blank" rel="noopener noreferrer"
                                                                        className="px-2 py-1 text-xs rounded underline hover:text-green-400" style={{ backgroundColor: '#1a1a1a' }}>
                                                                        🏆 View Certificate
                                                                    </a>
                                                                )}
                                                            </div>
                                                            {cert.description && (
                                                                <p className="text-sm leading-relaxed" style={{ color: '#cccccc' }}>
                                                                    {cert.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#888888' }}>
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm" style={{ color: '#888888' }}>
                                                No certifications yet
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Education Section */}
                                <div className="mb-2">
                                    <div className="flex items-center  mb-8">
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" >
                                            <svg className="w-10 h-10" fill="#ffffffff" viewBox="0 0 24 24">
                                                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold " style={{ color: '#ffffff' }}>
                                            Education
                                        </h3>
                                    </div>

                                    {education && education.length > 0 ? (
                                        <div className="relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>

                                            <div className="space-y-8">
                                                {education.map((edu, index) => (
                                                    <div key={edu.id} className="relative pl-12">
                                                        {/* Timeline dot */}
                                                        <div
                                                            className="absolute left-2.5 w-3 h-3 rounded-full "
                                                            style={{ backgroundColor: index === 0 ? user.theme_color : '#888888' }}
                                                        ></div>

                                                        <div className="">
                                                            <h4 className="text-2xl mb-2" style={{ color: '#ffffff' }}>
                                                                {edu.degree}
                                                            </h4>
                                                            <h5 className="text-base " style={{ color: '#cccccc' }}>
                                                                {edu.institution}
                                                            </h5>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#cccccc' }}>
                                                                <span style={{ color: user.theme_color }}>
                                                                    {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' })} — {' '}
                                                                    {edu.is_current ? 'Present' : edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' }) : 'Present'}
                                                                </span>
                                                                {edu.field_of_study && (
                                                                    <span>📚 {edu.field_of_study}</span>
                                                                )}
                                                                {edu.grade && (
                                                                    <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: '#1a1a1a' }}>
                                                                        {edu.grade}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {edu.description && (
                                                                <p className="text-sm leading-relaxed" style={{ color: '#cccccc' }}>
                                                                    {edu.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#888888' }}>
                                                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                            </svg>
                                            <p className="text-sm" style={{ color: '#888888' }}>
                                                No education records yet
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeSection === 'contact' ? (
                        /* Contact Section */
                        <div className="mb-12 relative z-10">
                            <div className="relative w-12 h-1 mb-6 rounded-full overflow-hidden">
                                <div className="absolute inset-0" style={{ backgroundColor: user.theme_color }}></div>
                            </div>

                            <div className="max-w-2xl mx-auto">
                                <div className="mb-8 text-center">
                                    <h3 className="text-3xl mb-4" style={{ color: '#ffffff' }}>Get In Touch</h3>
                                    <p className="text-lg" style={{ color: '#cccccc' }}>
                                        Have a question or want to work together? Feel free to reach out!
                                    </p>
                                </div>

                                {/* Contact Form */}
                                <form onSubmit={handleContactSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm  mb-2" style={{ color: '#cccccc' }}>
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={contactForm.name}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg "
                                                style={{
                                                    backgroundColor: '#1a1a1a',
                                                    color: '#ffffff'
                                                }}
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm mb-2" style={{ color: '#cccccc' }}>
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={contactForm.email}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg "
                                                style={{
                                                    backgroundColor: '#1a1a1a',
                                                    color: '#ffffff'
                                                }}
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm mb-2" style={{ color: '#cccccc' }}>
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={contactForm.subject}
                                            onChange={handleContactChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg "
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                color: '#ffffff'
                                            }}
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm mb-2" style={{ color: '#cccccc' }}>
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            value={contactForm.message}
                                            onChange={handleContactChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg  resize-vertical"
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                color: '#ffffff'
                                            }}
                                            placeholder="Tell me about your project or question..."
                                        />
                                    </div>

                                    {submitMessage && (
                                        <div className={`p-4 rounded-lg ${submitMessage.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                            {submitMessage}
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-8 py-4 rounded-lg font-medium text-lg disabled:opacity-50 hover:cursor-pointer hover:scale-105 transition-all duration-300 "
                                            style={{
                                                backgroundColor: user.theme_color,
                                                color: '#121212'
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <span>Send Message</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        /* Projects Section */
                        <div className="mb-12 relative z-10">
                            <div className="relative w-12 h-1 mb-6 rounded-full overflow-hidden">
                                <div className="absolute inset-0" style={{ backgroundColor: user.theme_color }}></div>
                            </div>

                            {/* Filters */}
                            <div className=" bg-gray-800 pb-4 rounded-lg shadow-sm" style={{ backgroundColor: 'transparent' }}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Language Filter */}
                                    <div className="space-y-2">
                                        <SearchableSelectFieldDark
                                            label="Language"
                                            options={getUniqueLanguages()}
                                            value={selectedLanguage === 'all' ? '' : selectedLanguage}
                                            onValueChange={(value) => setSelectedLanguage(value || 'all')}
                                            placeholder="All languages"
                                            searchPlaceholder="Search languages..."

                                        />
                                    </div>

                                    {/* Framework Filter */}
                                    <div className="space-y-2">
                                        <SearchableSelectFieldDark
                                            label="Framework"
                                            options={getUniqueFrameworks()}
                                            value={selectedFramework === 'all' ? '' : selectedFramework}
                                            onValueChange={(value) => setSelectedFramework(value || 'all')}
                                            placeholder="All frameworks"
                                            searchPlaceholder="Search frameworks..."
                                        />
                                    </div>

                                    {/* Database Filter */}
                                    <div className="space-y-2">
                                        <SearchableSelectFieldDark
                                            label="Database"
                                            options={getUniqueDatabases()}
                                            value={selectedDatabase === 'all' ? '' : selectedDatabase}
                                            onValueChange={(value) => setSelectedDatabase(value || 'all')}
                                            placeholder="All databases"
                                            searchPlaceholder="Search databases..."
                                        />
                                    </div>
                                </div>

                                {/* Active Filters and Clear Button */}
                                {(selectedLanguage !== 'all' || selectedFramework !== 'all' || selectedDatabase !== 'all') && (
                                    <div className=" pt-2">
                                        <div className="flex flex-wrap items-center gap-2 justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedLanguage !== 'all' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-600 text-blue-100">
                                                        {selectedLanguage}
                                                        <button
                                                            onClick={() => setSelectedLanguage('all')}
                                                            className="ml-1 text-blue-200 hover:text-white"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                )}
                                                {selectedFramework !== 'all' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-600 text-green-100">
                                                        {selectedFramework}
                                                        <button
                                                            onClick={() => setSelectedFramework('all')}
                                                            className="ml-1 text-green-200 hover:text-white"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                )}
                                                {selectedDatabase !== 'all' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-600 text-purple-100">
                                                        {selectedDatabase}
                                                        <button
                                                            onClick={() => setSelectedDatabase('all')}
                                                            className="ml-1 text-purple-200 hover:text-white"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={clearAllFilters}
                                                className="px-3 py-1 text-xs text-gray-300 hover:text-white border border-gray-600 rounded hover:bg-gray-600 transition-colors"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                        <div className="mt-2 text-xs" style={{ color: 'rgba(204, 204, 204, 0.6)' }}>
                                            Showing {filteredProjects.length} of {projects?.length || 0} projects
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Projects Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredProjects && filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                        <div key={project.id} className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group"
                                            style={{ backgroundColor: '#2c2c2c' }}
                                            onClick={() => openProjectModal(project)}>

                                            {/* Project Image */}
                                            <div className="w-full h-48 overflow-hidden relative">
                                                {project.image_url ? (
                                                    <img
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20 opacity-50"></div>
                                                        <svg className="w-16 h-16 z-10" fill="#1db954ff" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                    </div>
                                                )}

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-all duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                                                    <svg
                                                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                    </svg>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${project.status === 'Completed'
                                                        ? 'bg-green-500 text-white'
                                                        : project.status === 'In Progress'
                                                            ? 'bg-yellow-500 text-white'
                                                            : 'bg-gray-500 text-white'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                </div>

                                                {/* Pin Badge */}
                                                {/* {project.is_pinned && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-orange-500 text-white">
                                                            {project.pin_order}
                                                        </span>
                                                    </div>
                                                )} */}
                                            </div>

                                            {/* Project Content */}
                                            <div className="px-6 py-1 text-white">
                                                <p className="text-sm py-2"
                                                >
                                                    {project.project_type}
                                                </p>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-green-400 flex-1"
                                                        style={{ color: '#ffffff' }}>
                                                        {project.title}
                                                    </h3>

                                                    {/* Action Icons */}
                                                    <div className="flex items-center gap-3 ml-3">

                                                        {project.live_url && (
                                                            <a href={project.live_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-10 h-5 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-120"
                                                                title="Live Demo">
                                                                <svg className="w-10 h-10" fill="#ffffffff" viewBox="0 0 640 640">
                                                                    <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM331.3 188.7C325.1 182.5 314.9 182.5 308.7 188.7L204.7 292.7C200.1 297.3 198.8 304.2 201.2 310.1C203.6 316 209.5 320 216 320L288 320L288 424C288 437.3 298.7 448 312 448L328 448C341.3 448 352 437.3 352 424L352 320L424 320C430.5 320 436.3 316.1 438.8 310.1C441.3 304.1 439.9 297.2 435.3 292.7L331.3 188.7z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>


                                                <p className="text-sm mb-4 line-clamp-3" style={{ color: '#cccccc' }}>
                                                    {project.description}
                                                </p>




                                                {/* Action Buttons */}
                                                {/* <div className="flex gap-3 mt-6">
                                                    {project.live_url && (
                                                        <a href={project.live_url}
                                                           target="_blank"
                                                           rel="noopener noreferrer"
                                                           className="flex-1 py-2 px-4 rounded-lg text-center text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                                           style={{ 
                                                               backgroundColor: user.theme_color, 
                                                               color: '#121212' 
                                                           }}>
                                                            Live Demo
                                                        </a>
                                                    )}
                                                    {project.repo_url && (
                                                        <a href={project.repo_url}
                                                           target="_blank"
                                                           rel="noopener noreferrer"
                                                           className="flex-1 py-2 px-4 rounded-lg text-center text-sm font-medium transition-all duration-300 hover:scale-105 border border-gray-600 hover:border-gray-500"
                                                           style={{ color: '#ffffff' }}>
                                                            Repository
                                                        </a>
                                                    )}
                                                </div> */}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#888888' }}>
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                        </svg>
                                        <p className="text-lg font-medium mb-2" style={{ color: '#ffffff' }}>
                                            No Projects Yet
                                        </p>
                                        <p style={{ color: '#888888' }}>
                                            Projects will appear here once they are added to the portfolio.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Footer */}
            <div className="lg:hidden p-4"
                style={{
                    backgroundColor: '#2c2c2c',
                    background: 'linear-gradient(145deg, #2c2c2c 0%, #252525 50%, #2a2a2a 100%)',
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col space-y-1">
                        {user.email && (
                            <span style={{ color: '#ffffff' }}>{user.email}</span>
                        )}
                        {user.phone && (
                            <span style={{ color: '#ffffff' }}>{user.phone}</span>
                        )}
                        {user.location && (
                            <span style={{ color: '#ffffff' }}>{user.location}</span>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        {user.github_url && (
                            <a
                                href={user.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                                style={{ backgroundColor: '#1a1a1a' }}
                            >
                                <svg className="w-4 h-4" fill="#ffffff" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        )}
                        {user.linkedin_url && (
                            <a
                                href={user.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                                style={{ backgroundColor: '#1a1a1a' }}
                            >
                                <svg className="w-4 h-4" fill="#ffffff" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Modal */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    onClick={closeProjectModal}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.71)' }}>
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
                        style={{
                            backgroundColor: '#2c2c2c',
                            boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.14), 0 0 0 1px rgba(255, 255, 255, 0)'
                        }}
                        onClick={(e) => e.stopPropagation()}>

                        {/* Close Button */}
                        <button
                            onClick={closeProjectModal}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center"
                        >
                            ✕
                        </button>

                        {/* Card Header with Image */}
                        <div className="relative">
                            {selectedProject.image_url ? (
                                <div className="h-80 md:h-96 overflow-hidden">
                                    <img
                                        src={selectedProject.image_url}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-80 md:h-96 bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">
                                                {selectedProject.title.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-300">No image available</p>
                                    </div>
                                </div>
                            )}

                            {/* Status and Privacy Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">

                                {selectedProject.is_pinned && (
                                    <span className="px-3 py-1 bg-yellow-500/90 text-white backdrop-blur-sm rounded-full text-sm font-medium border border-yellow-500">
                                        📌 Pinned {selectedProject.pin_order && `#${selectedProject.pin_order}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 md:p-6">
                            {/* Project Type and Title */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between ">
                                    <div>
                                        {selectedProject.project_type && (
                                            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                                                {selectedProject.project_type}
                                            </h2>
                                        )}
                                        <h1 className="text-3xl font-bold text-white">{selectedProject.title}</h1>
                                    </div>

                                    {selectedProject.status && (
                                        <div className="flex items-center">
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium  ${selectedProject.status.toLowerCase() === 'completed' ||
                                                selectedProject.status.toLowerCase() === 'completado' ||
                                                selectedProject.status.toLowerCase() === 'finalizado'
                                                ? 'bg-green-500 text-white border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                                                : selectedProject.status.toLowerCase() === 'in progress' ||
                                                    selectedProject.status.toLowerCase() === 'en progreso' ||
                                                    selectedProject.status.toLowerCase() === 'desarrollo'
                                                    ? 'bg-blue-500 text-white border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                                                    : selectedProject.status.toLowerCase() === 'paused' ||
                                                        selectedProject.status.toLowerCase() === 'pausado'
                                                        ? 'bg-yellow-500 text-white border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
                                                        : selectedProject.status.toLowerCase() === 'cancelled' ||
                                                            selectedProject.status.toLowerCase() === 'cancelado'
                                                            ? 'bg-red-500 text-white border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                                                            : 'bg-gray-500 text-white border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                                                }`}>
                                                {selectedProject.status}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-300 leading-relaxed">
                                    {selectedProject.description || 'No description available.'}
                                </p>
                                <div className="relative w-4/4 h-px mt-4 overflow-hidden">

                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 "></div>
                                </div>
                            </div>



                            {/* Technical Details */}
                            <div className="space-y-2">
                                {/* Stack Combined - Programming Languages + Frameworks */}
                                {((selectedProject.programming_languages && selectedProject.programming_languages.length > 0) ||
                                    (selectedProject.frameworks && selectedProject.frameworks.length > 0)) && (
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest text-gray-400">
                                                STACK
                                            </h3>
                                            <p className="text-white">
                                                {[
                                                    ...(selectedProject.programming_languages || []),
                                                    ...(selectedProject.frameworks || [])
                                                ].join(' | ')}
                                            </p>
                                        </div>
                                    )}

                                {/* Environment & Database in separate grid */}
                                {(selectedProject.environment || selectedProject.database) && (
                                    <div className="grid md:grid-cols-2">
                                        {selectedProject.database && (
                                            <div>
                                                <h3 className="text-xs uppercase tracking-widest text-gray-400">
                                                    Database
                                                </h3>
                                                <p className="text-white">{selectedProject.database}</p>
                                            </div>
                                        )}
                                        {selectedProject.environment && (
                                            <div>
                                                <h3 className="text-xs uppercase tracking-widest text-gray-400">
                                                    Environment
                                                </h3>
                                                <p className="text-white">{selectedProject.environment}</p>
                                            </div>
                                        )}


                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 my-6">
                                    {selectedProject.repo_url && (
                                        <a
                                            href={selectedProject.repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-300 hover:scale-105 text-white hover:opacity-90"
                                            style={{ backgroundColor: '#121212' }}

                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            Github
                                        </a>
                                    )}
                                    {selectedProject.live_url && (
                                        <a
                                            href={selectedProject.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-300 hover:scale-105 bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                            style={{ color: '#121212' }}
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                            </svg>
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Tags section moved to bottom with minimal style */}
                            {selectedProject.tags && selectedProject.tags.length > 0 && (
                                <div className="mt-6 ">

                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}