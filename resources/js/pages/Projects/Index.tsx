import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface ProgrammingLanguage {
    id: number;
    name: string;
    color?: string;
}

interface Framework {
    id: number;
    name: string;
    category?: string;
    color?: string;
}

interface Tag {
    id: number;
    name: string;
    color?: string;
}

interface Environment {
    id: number;
    name: string;
    description?: string;
    color?: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    programming_languages: ProgrammingLanguage[];
    frameworks: Framework[];
    tags: Tag[];
    environment: Environment | null;
    repo_url: string;
    live_url: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/panel',
    },
    {
        title: 'Projects',
        href: '/projects',
    },
];

export default function Index({ projects }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/projects/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Link href="/projects/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 text-left font-medium">Title</th>
                                    <th className="p-4 text-left font-medium">Languages</th>
                                    <th className="p-4 text-left font-medium">Frameworks</th>
                                    <th className="p-4 text-left font-medium">Tags</th>
                                    <th className="p-4 text-left font-medium">Environment</th>
                                    <th className="p-4 text-center font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            No projects found. Create your first project!
                                        </td>
                                    </tr>
                                ) : (
                                    projects.data.map((project) => (
                                        <tr key={project.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <div>
                                                    <div className="font-medium">{project.title}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                                        {project.description}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {project.programming_languages?.map(lang => lang.name).join(', ') || '-'}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {project.frameworks?.map(fw => fw.name).join(', ') || '-'}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {project.tags?.map(tag => tag.name).join(', ') || '-'}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {project.environment?.name || '-'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/projects/${project.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/projects/${project.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(project.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {projects.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {projects.data.length} of {projects.total} projects
                        </div>
                        <div className="flex gap-2">
                            {Array.from({ length: projects.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/projects?page=${page}`}
                                    className={`px-3 py-1 rounded ${
                                        page === projects.current_page
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
