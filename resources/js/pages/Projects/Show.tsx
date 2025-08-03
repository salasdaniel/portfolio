import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, ExternalLink, Github } from 'lucide-react';

interface Environment {
    id: number;
    name: string;
}

interface Status {
    id: number;
    name: string;
}

interface Database {
    id: number;
    name: string;
}

interface ProgrammingLanguage {
    id: number;
    name: string;
}

interface Framework {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface ProjectType {
    id: number;
    name: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    project_type: ProjectType;
    environment: Environment;
    status: Status;
    database: Database;
    programming_languages: ProgrammingLanguage[];
    frameworks: Framework[];
    tags: Tag[];
    repo_url: string;
    live_url: string;
    image_url: string;
    is_private: boolean;
    is_pinned: boolean;
    pin_order: number | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    project: Project;
}

export default function Show({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/panel',
        },
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: project.title,
            href: `/projects/${project.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.title} />
            
            <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
                {/* Back Button */}
                <div className="w-full max-w-4xl mb-4">
                    <Link href="/projects">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Button>
                    </Link>
                </div>

                {/* Project Card */}
                <div className="w-full max-w-4xl bg-card border rounded-2xl shadow-2xl overflow-hidden">
                    {/* Card Header with Image */}
                    <div className="relative">
                        {project.image_url ? (
                            <div className="h-64 md:h-80 overflow-hidden">
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-64 md:h-80 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary">
                                            {project.title.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground">No image available</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Floating Edit Button */}
                        <div className="absolute top-4 right-4">
                            <Link href={`/projects/${project.id}/edit`}>
                                <Button size="sm" className="shadow-lg">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        </div>

                        {/* Status and Privacy Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                           
                            {project.is_private && (
                                <span className="px-3 py-1 bg-red-500/90 text-white backdrop-blur-sm rounded-full text-sm font-medium border border-red-500">
                                    Private
                                </span>
                            )}
                            {project.is_pinned && (
                                <span className="px-3 py-1 bg-yellow-500/90 text-white backdrop-blur-sm rounded-full text-sm font-medium border border-yellow-500">
                                    📌 Pinned {project.pin_order && `#${project.pin_order}`}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8">
                        {/* Project Type and Title */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    {project.project_type && (
                                        <h2 className="font-bold text-muted-foreground mb-2">
                                            {project.project_type.name}
                                        </h2>
                                    )}
                                    <h1 className="text-3xl font-bold">{project.title}</h1>
                                </div>
                                
                                {project.status && (
                                    <div className="flex items-center">
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${
                                            project.status.name.toLowerCase() === 'completed' || 
                                            project.status.name.toLowerCase() === 'completado' ||
                                            project.status.name.toLowerCase() === 'finalizado'
                                                ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                                                : project.status.name.toLowerCase() === 'in progress' ||
                                                  project.status.name.toLowerCase() === 'en progreso' ||
                                                  project.status.name.toLowerCase() === 'desarrollo'
                                                ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                                                : project.status.name.toLowerCase() === 'paused' ||
                                                  project.status.name.toLowerCase() === 'pausado'
                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
                                                : project.status.name.toLowerCase() === 'cancelled' ||
                                                  project.status.name.toLowerCase() === 'cancelado'
                                                ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                                                : 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                                        }`}>
                                            {project.status.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed">
                                {project.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {project.repo_url && (
                                <a
                                    href={project.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm">
                                        <Github className="mr-2 h-4 w-4" />
                                        Github 
                                    </Button>
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="sm">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Live Demo
                                    </Button>
                                </a>
                            )}
                        </div>

                        {/* Technical Details Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Technologies */}
                            <div className="space-y-6">
                                {project.programming_languages && project.programming_languages.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                            Programming Languages
                                        </h3>
                                        <p className="text-sm">
                                            {project.programming_languages.map((lang) => lang.name).join(' | ')}
                                        </p>
                                    </div>
                                )}

                                {project.frameworks && project.frameworks.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                            Frameworks
                                        </h3>
                                        <p className="text-sm">
                                            {project.frameworks.map((framework) => framework.name).join(' | ')}
                                        </p>
                                    </div>
                                )}

                                {project.tags && project.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full text-sm font-medium"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Environment & Database */}
                            <div className="space-y-6">
                                {project.environment && (
                                    <div>
                                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                            Environment
                                        </h3>
                                        <p className="text-sm">{project.environment.name}</p>
                                    </div>
                                )}

                                {project.database && (
                                    <div>
                                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                            Database
                                        </h3>
                                        <p className="text-sm">{project.database.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
