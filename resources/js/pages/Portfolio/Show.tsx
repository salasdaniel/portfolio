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

interface Props {
    user: User;
    username: string;
}

export default function Show({ user }: Props) {
    // Debug logs to see what data is being received
    console.log('User data:', user);
    console.log('Programming Languages:', user.programming_language_skills);
    console.log('Database Skills:', user.database_skills);
    console.log('Framework Skills:', user.framework_skills);
    console.log('User Skills:', user.skills);
    
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
                               style={{ borderColor: '#1db954ff', color: '#ffffff' }}>
                                About
                             
                            </a>
                            <a href="#resume" className="py-4 px-2 font-medium text-sm transition-all duration-300 hover:opacity-80 hover:text-orange-400 relative group" style={{ color: '#888888' }}>
                                Resume
                               
                            </a>
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

                    {/* About Me Section */}
                    <div className="mb-12 relative z-10">
                        <h2 className="text-3xl font-bold mb-6 transition-all duration-300 hover:text-orange-400" style={{ color: '#ffffff' }}>
                            About Me
                        </h2>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.skills && user.skills.length > 0 ? (
                                user.skills.map((skill, index) => (
                                    <div key={index} className="flex items-start space-x-4 p-6 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#2c2c2c' }}>
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" >
                                            {skill.icon ? (
                                                <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:p-2" style={{ color: '#ffffff', fill: '#ffffff' }} />
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
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1db954ff' }}>
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
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
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
                </div>
            </div>
        </div>
    );
}