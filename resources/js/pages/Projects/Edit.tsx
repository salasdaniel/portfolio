import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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

export default function Edit({ project }: Props) {
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
        {
            title: 'Edit',
            href: `/projects/${project.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: project.title || '',
        description: project.description || '',
        programming_languages: project.programming_languages || '',
        frameworks: project.frameworks || '',
        tags: project.tags || '',
        environment: project.environment || '',
        repo_url: project.repo_url || '',
        live_url: project.live_url || '',
        image_url: project.image_url || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${project.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${project.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href={`/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Project
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Project</h1>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Title *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="Enter project title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="programming_languages" className="text-sm font-medium">
                                    Programming Languages
                                </label>
                                <input
                                    id="programming_languages"
                                    type="text"
                                    value={data.programming_languages}
                                    onChange={(e) => setData('programming_languages', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="e.g., PHP, JavaScript, Python"
                                />
                                {errors.programming_languages && (
                                    <p className="text-sm text-destructive">{errors.programming_languages}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="frameworks" className="text-sm font-medium">
                                    Frameworks
                                </label>
                                <input
                                    id="frameworks"
                                    type="text"
                                    value={data.frameworks}
                                    onChange={(e) => setData('frameworks', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="e.g., Laravel, React, Vue"
                                />
                                {errors.frameworks && (
                                    <p className="text-sm text-destructive">{errors.frameworks}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-sm font-medium">
                                    Tags
                                </label>
                                <input
                                    id="tags"
                                    type="text"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="e.g., Web, API, Mobile"
                                />
                                {errors.tags && (
                                    <p className="text-sm text-destructive">{errors.tags}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="environment" className="text-sm font-medium">
                                    Environment
                                </label>
                                <input
                                    id="environment"
                                    type="text"
                                    value={data.environment}
                                    onChange={(e) => setData('environment', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="e.g., AWS, Vercel, Docker"
                                />
                                {errors.environment && (
                                    <p className="text-sm text-destructive">{errors.environment}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="repo_url" className="text-sm font-medium">
                                    Repository URL
                                </label>
                                <input
                                    id="repo_url"
                                    type="url"
                                    value={data.repo_url}
                                    onChange={(e) => setData('repo_url', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="https://github.com/username/repo"
                                />
                                {errors.repo_url && (
                                    <p className="text-sm text-destructive">{errors.repo_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="live_url" className="text-sm font-medium">
                                    Live URL
                                </label>
                                <input
                                    id="live_url"
                                    type="url"
                                    value={data.live_url}
                                    onChange={(e) => setData('live_url', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="https://example.com"
                                />
                                {errors.live_url && (
                                    <p className="text-sm text-destructive">{errors.live_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="image_url" className="text-sm font-medium">
                                    Image URL
                                </label>
                                <input
                                    id="image_url"
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {errors.image_url && (
                                    <p className="text-sm text-destructive">{errors.image_url}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Describe your project..."
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Project'}
                            </Button>
                            <Link href={`/projects/${project.id}`}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
