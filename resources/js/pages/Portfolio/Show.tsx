import PublicLayout from '@/layouts/PublicLayout';

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
    projects?: Array<{
        name?: string;
        description?: string;
        technologies?: string;
        status?: string;
        repository_url?: string;
        demo_url?: string;
    }>;
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
    programmingLanguageSkills?: Array<{
        id?: number;
        name?: string;
        pivot?: {
            experience_level?: string;
        };
    }>;
    databaseSkills?: Array<{
        id?: number;
        name?: string;
        pivot?: {
            experience_level?: string;
        };
    }>;
    frameworkSkills?: Array<{
        id?: number;
        name?: string;
        pivot?: {
            experience_level?: string;
        };
    }>;
    otherTechnologies?: Array<{
        name?: string;
        level?: string;
    }>;
}

interface Props {
    user: User;
    username: string;
}

export default function Show({ user }: Props) {
    // Debug logs to see what data is being received
    console.log('User data:', user);
    console.log('Programming Languages:', user.programmingLanguageSkills);
    console.log('Database Skills:', user.databaseSkills);
    console.log('Framework Skills:', user.frameworkSkills);
    console.log('User Skills:', user.skills);
    
    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
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
                            <span className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer" 
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
                                <h3 className="text-xs font-semibold mb-1 transition-colors duration-300" style={{ color: 'rgba(204, 204, 204, 0.6)' }}>
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
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
                        <nav className="flex space-x-8 border-b transition-all duration-300" style={{ borderColor: '#444444' }}>
                            <a href="#about" className="py-4 px-2 border-b-2 font-medium text-sm relative group transition-all duration-300" 
                               style={{ borderColor: '#f39c12', color: '#f39c12' }}>
                                About
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </a>
                            <a href="#resume" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                Resume
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </a>
                            <a href="#portfolio" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                Portfolio
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </a>
                            <a href="#blog" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                Blog
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </a>
                            <a href="#contact" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                Contact
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </a>
                        </nav>
                    </div>

                    {/* About Me Section */}
                    <div className="mb-12 relative z-10">
                        <h2 className="text-3xl font-bold mb-6 transition-all duration-300 hover:text-orange-400" style={{ color: '#ffffff' }}>
                            About Me
                        </h2>
                        <div className="relative w-12 h-1 mb-6 rounded-full overflow-hidden">
                            <div className="absolute inset-0" style={{ backgroundColor: '#f39c12' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 animate-pulse"></div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.skills && user.skills.length > 0 ? (
                                user.skills.map((skill, index) => (
                                    <div key={index} className="flex items-start space-x-4 p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f39c12' }}>
                                            {skill.icon ? (
                                                <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-6 h-6 text-white" />
                                            ) : (
                                                <svg className="w-6 h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
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
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f39c12' }}>
                                            <svg className="w-6 h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                <path d="M17 2v2h3v16H4V4h3V2H5C3.9 2 3 2.9 3 4v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-2z"/>
                                                <path d="M9 2v2h6V2c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2z"/>
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
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f39c12' }}>
                                            <svg className="w-6 h-6" fill="#ffffff" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z"/>
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

                    {/* Skills Section */}
                    {(user.programmingLanguageSkills?.length || user.frameworkSkills?.length || user.databaseSkills?.length || user.otherTechnologies?.length) && (
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-6" style={{ color: '#ffffff' }}>
                                Skills
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {/* Programming Languages */}
                                {user.programmingLanguageSkills?.map((skill, index) => (
                                    <div key={`prog-${index}`} className="w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c', border: '1px solid #f39c12' }}>
                                        <span className="text-xs font-medium text-center" style={{ color: '#ffffff' }}>
                                            {skill.name || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                                
                                {/* Frameworks */}
                                {user.frameworkSkills?.map((skill, index) => (
                                    <div key={`framework-${index}`} className="w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c', border: '1px solid #f39c12' }}>
                                        <span className="text-xs font-medium text-center" style={{ color: '#ffffff' }}>
                                            {skill.name || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                                
                                {/* Databases */}
                                {user.databaseSkills?.map((skill, index) => (
                                    <div key={`db-${index}`} className="w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c', border: '1px solid #f39c12' }}>
                                        <span className="text-xs font-medium text-center" style={{ color: '#ffffff' }}>
                                            {skill.name || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                                
                                {/* Other Technologies */}
                                {user.otherTechnologies?.map((skill, index) => (
                                    <div key={`other-${index}`} className="w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c', border: '1px solid #f39c12' }}>
                                        <span className="text-xs font-medium text-center" style={{ color: '#ffffff' }}>
                                            {skill.name || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back to Search */}
                    <div className="text-center mt-16">
                        <a 
                            href={route('home')}
                            className="inline-flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200"
                            style={{ 
                                border: '1px solid #f39c12',
                                color: '#f39c12',
                                backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f39c12';
                                e.currentTarget.style.color = '#121212';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#f39c12';
                            }}
                        >
                            ← Back to Search
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}