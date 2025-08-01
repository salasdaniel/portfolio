import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, ExternalLink, Github } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    description: string;
    programming_languages: string;
    frameworks: string;
    tags: string;
    environment: string;
    repo_url: string;
    live_url: string;
    image_url: string;
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
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/projects">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Projects
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{project.title}</h1>
                    </div>
                    <Link href={`/projects/${project.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Project Image */}
                    <div className="lg:col-span-2">
                        {project.image_url ? (
                            <div className="rounded-lg border bg-card overflow-hidden">
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        ) : (
                            <div className="rounded-lg border bg-card h-64 flex items-center justify-center">
                                <p className="text-muted-foreground">No image available</p>
                            </div>
                        )}
                    </div>

                    {/* Project Links */}
                    <div className="space-y-4">
                        {project.repo_url && (
                            <a
                                href={project.repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button className="w-full" variant="outline">
                                    <Github className="mr-2 h-4 w-4" />
                                    View Repository
                                </Button>
                            </a>
                        )}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button className="w-full">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Live Site
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

                {/* Project Details */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-4">Description</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {project.description || 'No description available.'}
                        </p>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-4">Technical Details</h2>
                        <div className="space-y-4">
                            {project.programming_languages && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                        Programming Languages
                                    </h3>
                                    <p>{project.programming_languages}</p>
                                </div>
                            )}
                            {project.frameworks && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                        Frameworks
                                    </h3>
                                    <p>{project.frameworks}</p>
                                </div>
                            )}
                            {project.tags && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.split(',').map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-muted rounded-md text-sm"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {project.environment && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                        Environment
                                    </h3>
                                    <p>{project.environment}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Project Information</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                Created
                            </h3>
                            <p>{new Date(project.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground mb-1">
                                Last Updated
                            </h3>
                            <p>{new Date(project.updated_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
