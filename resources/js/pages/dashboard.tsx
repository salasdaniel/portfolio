import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FolderOpen, Plus, User, Briefcase, GraduationCap, Code, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Project {
    id: number;
    title: string;
    description?: string;
    technologies?: string;
    created_at: string;
}

interface Experience {
    id: number;
    position: string;
    company: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
}

interface Education {
    id: number;
    institution: string;
    degree: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
}

interface ProgrammingLanguage {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email?: string;
    profession?: string;
    description?: string;
    profile_image?: string;
    location?: string;
    projects?: Project[];
    experience?: Experience[];
    education?: Education[];
    programming_language_skills?: ProgrammingLanguage[];
    framework_skills?: ProgrammingLanguage[];
    database_skills?: ProgrammingLanguage[];
    other_technologies?: Array<{
        id: number;
        name: string;
    }>;
}

interface Stats {
    totalProjects: number;
    totalExperiences: number;
    totalSkills: number;
    totalEducation: number;
}

interface Props {
    user: User;
    stats: Stats;
}

export default function Dashboard({ user, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
                
                {/* Main Content Layout - LinkedIn Style */}
                <div className="grid gap-6 lg:grid-cols-12">
                    
                    {/* Left Sidebar - Profile Card */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card overflow-hidden">
                            {/* Profile Header */}
                            <div className="relative h-20 bg-gradient-to-r from-primary/20 to-primary/10">
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                                    <div className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-muted flex items-center justify-center">
                                        {user.profile_image ? (
                                            <img
                                                src={`/storage/${user.profile_image}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-muted-foreground">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Profile Info */}
                            <div className="pt-10 pb-4 px-6 text-center">
                                <h2 className="text-lg font-semibold">{user.name}</h2>
                                {user.profession && (
                                    <p className="text-sm text-muted-foreground mt-1">{user.profession}</p>
                                )}
                                {user.location && (
                                    <p className="text-xs text-muted-foreground mt-1">{user.location}</p>
                                )}
                                
                                {user.description && (
                                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3 text-left">
                                        {user.description}
                                    </p>
                                )}
                            </div>
                            
                            {/* Profile Stats */}
                            <div className="border-t px-6 py-4">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-semibold text-primary">{stats.totalProjects}</div>
                                        <div className="text-xs text-muted-foreground">Projects</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-primary">{stats.totalSkills}</div>
                                        <div className="text-xs text-muted-foreground">Skills</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Top Skills Section */}
                            <div className="border-t px-6 py-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Code className="h-4 w-4 text-primary" />
                                    <h4 className="font-semibold text-sm">Top Skills</h4>
                                </div>
                                
                                <div className="space-y-3">
                                    {/* Programming Languages */}
                                    {user.programming_language_skills && user.programming_language_skills.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Programming Languages</p>
                                            <div className="flex flex-wrap gap-1">
                                                {user.programming_language_skills.slice(0, 5).map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Frameworks */}
                                    {user.framework_skills && user.framework_skills.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Frameworks</p>
                                            <div className="flex flex-wrap gap-1">
                                                {user.framework_skills.slice(0, 3).map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Databases */}
                                    {user.database_skills && user.database_skills.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Databases</p>
                                            <div className="flex flex-wrap gap-1">
                                                {user.database_skills.slice(0, 3).map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Other Technologies */}
                                    {user.other_technologies && user.other_technologies.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Other Skills</p>
                                            <div className="flex flex-wrap gap-1">
                                                {user.other_technologies.slice(0, 4).map((tech) => (
                                                    <span
                                                        key={tech.id}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                                                    >
                                                        {tech.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Show message if no skills */}
                                    {(!user.programming_language_skills || user.programming_language_skills.length === 0) &&
                                     (!user.framework_skills || user.framework_skills.length === 0) &&
                                     (!user.database_skills || user.database_skills.length === 0) &&
                                     (!user.other_technologies || user.other_technologies.length === 0) && (
                                        <div className="text-center py-2">
                                            <p className="text-xs text-muted-foreground">No skills added yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="border-t px-6 py-4 space-y-2">
                                <Link href="/settings/profile" className="block">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <User className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </Link>
                                <Link href="/projects/create" className="block">
                                    <Button size="sm" className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Project
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Quick Navigation Card - Moved from sidebar */}
                        {/* This will be moved to the main content area */}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-6 max-h-[100vh] overflow-y-auto">
                        
                        {/* Welcome Banner + Quick Access */}
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Welcome Banner */}
                            <div className="md:col-span-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card p-6">
                                <h2 className="text-xl font-semibold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                                <p className="text-muted-foreground">
                                    Here's what's happening with your portfolio today.
                                </p>
                            </div>
                            
                            {/* Quick Access Card */}
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card p-4">
                                <h3 className="font-semibold text-sm mb-3">Quick Access</h3>
                                <div className="space-y-2">
                                    <Link href="/projects" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <FolderOpen className="h-4 w-4 text-primary" />
                                        <span className="text-sm">All Projects</span>
                                        <span className="ml-auto text-xs text-muted-foreground">{stats.totalProjects}</span>
                                    </Link>
                                    <Link href="/experiences" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <Briefcase className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Experience</span>
                                        <span className="ml-auto text-xs text-muted-foreground">{stats.totalExperiences}</span>
                                    </Link>
                                    <Link href="/experiences" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <GraduationCap className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Education</span>
                                        <span className="ml-auto text-xs text-muted-foreground">{stats.totalEducation}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Activity Feed Style Cards */}
                        <div className="space-y-6">
                            
                            {/* Recent Projects */}
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card">
                                <div className="p-6 border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FolderOpen className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-lg">Recent Projects</h3>
                                        </div>
                                        <Link href="/projects" className="text-sm text-primary hover:underline font-medium">
                                            View all ({stats.totalProjects})
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {user.projects && user.projects.length > 0 ? (
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {user.projects.slice(0, 3).map((project) => (
                                                <div key={project.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                                    <h4 className="font-medium mb-2">{project.title}</h4>
                                                    {project.description && (
                                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(project.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <Link href={`/projects/${project.id}`} className="text-xs text-primary hover:underline">
                                                            View
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                                            <p className="text-muted-foreground mb-4">No projects yet</p>
                                            <Link href="/projects/create">
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create Your First Project
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Experience & Education */}
                            <div className="grid gap-6 md:grid-cols-2">
                                
                                {/* Recent Experience */}
                                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card">
                                    <div className="p-6 border-b">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="h-5 w-5 text-primary" />
                                                <h3 className="font-semibold">Experience</h3>
                                            </div>
                                            <Link href="/experiences" className="text-sm text-primary hover:underline">
                                                Manage
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {user.experience && user.experience.length > 0 ? (
                                            <div className="space-y-4">
                                                {user.experience.slice(0, 2).map((exp) => (
                                                    <div key={exp.id} className="flex gap-3">
                                                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <Briefcase className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm">{exp.position}</h4>
                                                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {new Date(exp.start_date).getFullYear()} - {
                                                                    exp.is_current ? 'Present' : 
                                                                    exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-muted-foreground mb-3">No experience added yet</p>
                                                <Link href="/experiences">
                                                    <Button variant="outline" size="sm">
                                                        Add Experience
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card">
                                    <div className="p-6 border-b">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <GraduationCap className="h-5 w-5 text-primary" />
                                                <h3 className="font-semibold">Education</h3>
                                            </div>
                                            <Link href="/experiences" className="text-sm text-primary hover:underline">
                                                Manage
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {user.education && user.education.length > 0 ? (
                                            <div className="space-y-4">
                                                {user.education.slice(0, 2).map((edu) => (
                                                    <div key={edu.id} className="flex gap-3">
                                                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <GraduationCap className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm">{edu.degree}</h4>
                                                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {new Date(edu.start_date).getFullYear()} - {
                                                                    edu.is_current ? 'Present' : 
                                                                    edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-muted-foreground mb-3">No education added yet</p>
                                                <Link href="/experiences">
                                                    <Button variant="outline" size="sm">
                                                        Add Education
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
