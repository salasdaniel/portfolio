import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagInput } from '@/components/ui/tag-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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

interface Props {
    programmingLanguages: ProgrammingLanguage[];
    frameworks: Framework[];
    environments: Environment[];
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
    {
        title: 'Create',
        href: '/projects/create',
    },
];

export default function Create({ programmingLanguages, frameworks, environments }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        programming_language_ids: [] as number[],
        framework_ids: [] as number[],
        environment_id: '',
        tags: [] as string[],
        repo_url: '',
        live_url: '',
        image_url: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/projects">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create New Project</h1>
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
                                <label htmlFor="environment_id" className="text-sm font-medium">
                                    Environment
                                </label>
                                <Select
                                    value={data.environment_id}
                                    onValueChange={(value) => setData('environment_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select environment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {environments.map((env) => (
                                            <SelectItem key={env.id} value={env.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    {env.color && (
                                                        <span
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: env.color }}
                                                        />
                                                    )}
                                                    {env.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.environment_id && (
                                    <p className="text-sm text-destructive">{errors.environment_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Programming Languages
                                </label>
                                <MultiSelect
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
                                <label className="text-sm font-medium">
                                    Frameworks
                                </label>
                                <MultiSelect
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

                            <div className="space-y-2 md:col-span-2">
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
                                {processing ? 'Creating...' : 'Create Project'}
                            </Button>
                            <Link href="/projects">
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
