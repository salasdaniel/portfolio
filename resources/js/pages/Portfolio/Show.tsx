import { SearchableSelectFieldDark } from '@/components/ui/searchable-select-field-dark';
import { useState } from 'react';

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
    description?: string;
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
    username: string;
}

export default function Show({ user, projects }: Props) {
    const [activeSection, setActiveSection] = useState('about');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filter states
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [selectedFramework, setSelectedFramework] = useState<string>('all');
    const [selectedDatabase, setSelectedDatabase] = useState<string>('all');

    // Debug logs to see what data is being received
    // console.log('User data:', user);
    // console.log('Programming Languages:', user.programming_language_skills);
    // console.log('Database Skills:', user.database_skills);
    // console.log('Framework Skills:', user.framework_skills);
    // console.log('User Skills:', user.skills);
    // console.log('Projects:', projects);

    // Debug specific project data
    if (projects && projects.length > 0) {
        console.log('Projects data:', projects);
    }

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
        
        return projects.filter(project => {
            const languageMatch = selectedLanguage === 'all' || 
                project.programming_languages?.includes(selectedLanguage);
            
            const frameworkMatch = selectedFramework === 'all' || 
                project.frameworks?.includes(selectedFramework);
            
            const databaseMatch = selectedDatabase === 'all' || 
                project.database === selectedDatabase;
            
            return languageMatch && frameworkMatch && databaseMatch;
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
                `
            }} />
            <div className="flex">
                {/* Left Sidebar - Profile Information */}
                <div className="fixed top-0 left-0 w-80 h-screen p-8 flex flex-col items-center justify-center text-center"
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
                                    backgroundColor: '#1db954ff',
                                    color: '#121212',
                                    background: 'linear-gradient(135deg, #1db954 0%, #17a844 50%, #1db954 100%)',
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
                <div className="flex-1 ml-80 p-8 relative">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}></div>

                    {/* Navigation Tabs */}
                    <div className="mb-8 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold transition-all duration-300 hover:text-orange-400" style={{ color: '#ffffff' }}>
                                {activeSection === 'about' ? 'About Me' : 'My Projects'}
                            </h2>
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveSection('about')}
                                    className={`py-4 px-2 font-medium text-sm relative group transition-all duration-300 ${activeSection === 'about'
                                            ? 'border-b-2'
                                            : 'hover:opacity-80 hover:text-orange-400'
                                        }`}
                                    style={{
                                        borderColor: activeSection === 'about' ? '#1db954ff' : 'transparent',
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
                                        borderColor: activeSection === 'projects' ? '#1db954ff' : 'transparent',
                                        color: activeSection === 'projects' ? '#ffffff' : '#888888'
                                    }}
                                >
                                    Projects
                                </button>
                                <a href="#portfolio" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                    Portfolio
                                </a>
                                <a href="#blog" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                    Blog
                                </a>
                                <a href="#contact" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                    Contact
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Conditional Content Based on Active Section */}
                    {activeSection === 'about' ? (
                        <>
                            {/* About Me Section */}
                            <div className="mb-12 relative z-10">
                                <div className="relative w-12 h-1 mb-6 rounded-full overflow-hidden">
                                    <div className="absolute inset-0" style={{ backgroundColor: '#1db954ff' }}></div>
                                </div>

                                {user.description && (
                                    <p className="text-lg leading-relaxed mb-8 transition-all duration-300 hover:text-gray-200" style={{ color: '#cccccc' }}>
                                        {user.description}
                                    </p>
                                )}
                            </div>

                            {/* What I'm Doing Section */}
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold mb-6" style={{ color: '#ffffff' }}>
                                    What I'm Doing
                                </h2>
                                <div className="relative w-12 h-1 mb-8 rounded-full overflow-hidden">
                                    <div className="absolute inset-0" style={{ backgroundColor: '#1db954ff' }}></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill, index) => (
                                            <div key={index} className="flex items-start space-x-4 p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                                <div className="w-12 h-12 rounded-lg flex items-center justify-center" >
                                                    {skill.icon ? (
                                                        <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:p-2" style={{ color: '#ffffff', fill: '#ffffff' }} />
                                                    ) : (
                                                        <svg className="w-6 h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#ffffff' }}>
                                                        {skill.title}
                                                    </h3>
                                                    <p style={{ color: '#cccccc' }}>
                                                        {skill.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        /* Default fallback cards if no skills data */
                                        <>
                                            <div className="flex items-start space-x-4 p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1db954ff' }}>
                                                    <svg className="w-6 h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                        <path d="M17 2v2h3v16H4V4h3V2H5C3.9 2 3 2.9 3 4v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-2z" />
                                                        <path d="M9 2v2h6V2c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#ffffff' }}>
                                                        Mobile Apps
                                                    </h3>
                                                    <p style={{ color: '#cccccc' }}>
                                                        Professional development of applications for Android and iOS.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-4 p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
                                                    <svg className="w-6 h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#ffffff' }}>
                                                        Web Development
                                                    </h3>
                                                    <p style={{ color: '#cccccc' }}>
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
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#ffffff' }}>
                                        Stack
                                    </h2>
                                    <div className="relative w-12 h-1 mb-8 rounded-full overflow-hidden">
                                        <div className="absolute inset-0" style={{ backgroundColor: '#1db954ff' }}></div>
                                    </div>

                                    {/* Technologies Carousel Container */}
                                    <div className="relative rounded-2xl  flex justify-center" >
                                        <div className="w-full">
                                            <div className="flex gap-6 min-w-max ">
                                                {/* Programming Languages */}
                                                {user.programming_language_skills?.map((skill, index) => (
                                                    <div key={`prog-${index}`} className="flex-shrink-0 w-28 h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
                                                        style={{
                                                            backgroundColor: '#1a1a1a',

                                                        }}>
                                                        <span className="text-sm font-bold text-center" style={{ color: '#ffffff' }}>
                                                            {skill.name}
                                                        </span>

                                                    </div>
                                                ))}

                                                {/* Frameworks */}
                                                {user.framework_skills?.map((skill, index) => (
                                                    <div key={`framework-${index}`} className="flex-shrink-0 w-28 h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
                                                        style={{
                                                            backgroundColor: '#1a1a1a',

                                                        }}>
                                                        <span className="text-sm font-bold text-center" style={{ color: '#ffffff' }}>
                                                            {skill.name}
                                                        </span>

                                                    </div>
                                                ))}

                                                {/* Databases */}
                                                {user.database_skills?.map((skill, index) => (
                                                    <div key={`db-${index}`} className="flex-shrink-0 w-28 h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
                                                        style={{
                                                            backgroundColor: '#1a1a1a',

                                                        }}>
                                                        <span className="text-sm font-bold text-center" style={{ color: '#ffffff' }}>
                                                            {skill.name}
                                                        </span>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Other Technologies Section */}
                            {user.other_technologies?.length && (
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#ffffff' }}>
                                        Other Technologies
                                    </h2>
                                    <div className="relative w-12 h-1 mb-8 rounded-full overflow-hidden">
                                        <div className="absolute inset-0" style={{ backgroundColor: '#1db954ff' }}></div>
                                    </div>

                                    {/* Technologies Tags */}
                                    <div className="flex flex-wrap gap-3">
                                        {user.other_technologies.map((tech, index) => (
                                            <div key={index} className="px-4 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
                                                style={{
                                                    backgroundColor: '#2c2c2c',


                                                }}>
                                                <span className="text-sm font-medium" style={{ color: '#cccccc' }}>
                                                    {tech.name}
                                                </span>
                                                {tech.level && (
                                                    <span className="text-xs ml-2 opacity-70" style={{ color: '#cccccc' }}>
                                                        {tech.level}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Projects Section */
                        <div className="mb-12 relative z-10">
                            <div className="relative w-12 h-1 mb-6 rounded-full overflow-hidden">
                                <div className="absolute inset-0" style={{ backgroundColor: '#1db954ff' }}></div>
                            </div>

                            {/* Filters */}
                            <div className="mb-8 bg-gray-800 p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'transparent' }}>
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
                                    <div className="mt-4 pt-2">
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
                                                               backgroundColor: '#1db954ff', 
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