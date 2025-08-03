import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import { SelectField } from '@/components/ui/select-field';
import { TagInput } from '@/components/ui/tag-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Status, type Database } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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

interface Environment {
    id: number;
    name: string;
    description?: string;
    color?: string;
}

interface ProjectType {
    id: number;
    name: string;
    description?: string;
    color?: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    programming_languages: ProgrammingLanguage[];
    frameworks: Framework[];
    tags: Tag[];
    project_type: ProjectType | null;
    environment: Environment | null;
    status: Status | null;
    database: Database | null;
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
    programmingLanguages: ProgrammingLanguage[];
    frameworks: Framework[];
    environments: Environment[];
    statuses: Status[];
    databases: Database[];
    projectTypes: ProjectType[];
}

export default function Edit({ project, programmingLanguages, frameworks, environments, statuses, databases, projectTypes }: Props) {
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
        programming_language_ids: project.programming_languages?.map(pl => pl.id) || [] as number[],
        framework_ids: project.frameworks?.map(f => f.id) || [] as number[],
        project_type_id: project.project_type?.id?.toString() || '' as string,
        environment_id: project.environment?.id?.toString() || '' as string,
        status_id: project.status?.id?.toString() || '' as string,
        database_id: project.database?.id?.toString() || '' as string,
        tags: project.tags?.map(t => t.name) || [] as string[],
        repo_url: project.repo_url || '',
        live_url: project.live_url || '',
        image_url: project.image_url || '',
        is_private: project.is_private || false as boolean,
        is_pinned: project.is_pinned || false as boolean,
        pin_order: project.pin_order || null as number | null,
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
                                <SelectField
                                    label="Project Type"
                                    options={projectTypes}
                                    value={data.project_type_id}
                                    onValueChange={(value) => setData('project_type_id', value || '')}
                                    placeholder="Select project type..."
                                />
                                {errors.project_type_id && (
                                    <p className="text-sm text-destructive">{errors.project_type_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <SelectField
                                    label="Environment"
                                    options={environments}
                                    value={data.environment_id}
                                    onValueChange={(value) => setData('environment_id', value || '')}
                                    placeholder="Select environment..."
                                />
                                {errors.environment_id && (
                                    <p className="text-sm text-destructive">{errors.environment_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <SelectField
                                    label="Status"
                                    options={statuses}
                                    value={data.status_id}
                                    onValueChange={(value) => setData('status_id', value || '')}
                                    placeholder="Select status..."
                                />
                                {errors.status_id && (
                                    <p className="text-sm text-destructive">{errors.status_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <SelectField
                                    label="Database"
                                    options={databases}
                                    value={data.database_id}
                                    onValueChange={(value) => setData('database_id', value || '')}
                                    placeholder="Select database..."
                                />
                                {errors.database_id && (
                                    <p className="text-sm text-destructive">{errors.database_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <MultiSelect
                                    label="Programming Languages"
                                    options={programmingLanguages}
                                    value={data.programming_language_ids}
                                    onChange={(values) => setData('programming_language_ids', values)}
                                    placeholder="Select programming languages"
                                />
                                {errors.programming_language_ids && (
                                    <p className="text-sm text-destructive">{errors.programming_language_ids}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <MultiSelect
                                    label="Frameworks"
                                    options={frameworks}
                                    value={data.framework_ids}
                                    onChange={(values) => setData('framework_ids', values)}
                                    placeholder="Select frameworks"
                                />
                                {errors.framework_ids && (
                                    <p className="text-sm text-destructive">{errors.framework_ids}</p>
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
                                    Live URL (Optional)
                                </label>
                                <input
                                    id="live_url"
                                    type="text"
                                    value={data.live_url}
                                    onChange={(e) => setData('live_url', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="https://example.com (optional)"
                                />
                                {errors.live_url && (
                                    <p className="text-sm text-destructive">{errors.live_url}</p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="image_url" className="text-sm font-medium">
                                    Image URL or File Path
                                </label>
                                <input
                                    id="image_url"
                                    type="text"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="https://example.com/image.jpg or /path/to/image.jpg"
                                />
                                {errors.image_url && (
                                    <p className="text-sm text-destructive">{errors.image_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_private"
                                        checked={data.is_private}
                                        onCheckedChange={(checked) => setData('is_private', checked === true)}
                                    />
                                    <label htmlFor="is_private" className="text-sm font-medium cursor-pointer">
                                        Private Project
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Private projects are only visible to you.
                                </p>
                                {errors.is_private && (
                                    <p className="text-sm text-destructive">{errors.is_private}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_pinned"
                                        checked={data.is_pinned}
                                        onCheckedChange={(checked) => setData('is_pinned', checked === true)}
                                    />
                                    <label htmlFor="is_pinned" className="text-sm font-medium cursor-pointer">
                                        Pin Project
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Pinned projects can be displayed in a featured section with custom order.
                                </p>
                                {errors.is_pinned && (
                                    <p className="text-sm text-destructive">{errors.is_pinned}</p>
                                )}
                            </div>

                            {data.is_pinned && (
                                <div className="space-y-2">
                                    <label htmlFor="pin_order" className="text-sm font-medium">
                                        Pin Order
                                    </label>
                                    <input
                                        id="pin_order"
                                        type="number"
                                        min="1"
                                        value={data.pin_order || ''}
                                        onChange={(e) => setData('pin_order', e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="Enter display order (1, 2, 3...)"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty to auto-assign the next available order.
                                    </p>
                                    {errors.pin_order && (
                                        <p className="text-sm text-destructive">{errors.pin_order}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tags
                            </label>
                            <TagInput
                                value={data.tags}
                                onChange={(tags) => setData('tags', tags)}
                                placeholder="Type and press space to add tags..."
                            />
                            <p className="text-xs text-muted-foreground">
                                Type a tag and press space or enter to add it. Press backspace to remove the last tag.
                            </p>
                            {errors.tags && (
                                <p className="text-sm text-destructive">{errors.tags}</p>
                            )}
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
