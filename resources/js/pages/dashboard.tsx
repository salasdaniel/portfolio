import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FolderOpen, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Quick Actions */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link href="/projects" className="block">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                <FolderOpen className="h-8 w-8 mb-2 text-primary" />
                                <h3 className="font-semibold text-lg">Projects</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    View and manage your portfolio projects
                                </p>
                            </div>
                        </div>
                    </Link>
                    
                    <Link href="/projects/create" className="block">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                <Plus className="h-8 w-8 mb-2 text-primary" />
                                <h3 className="font-semibold text-lg">New Project</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    Add a new project to your portfolio
                                </p>
                            </div>
                        </div>
                    </Link>
                    
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <h3 className="font-semibold text-lg">Analytics</h3>
                            <p className="text-sm text-muted-foreground text-center">
                                Coming soon...
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Area */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Welcome to your Portfolio Dashboard</h2>
                        <p className="text-muted-foreground mb-6">
                            Manage your projects, track your progress, and showcase your work.
                        </p>
                        
                        <div className="flex gap-4">
                            <Link href="/projects">
                                <Button>
                                    <FolderOpen className="mr-2 h-4 w-4" />
                                    View Projects
                                </Button>
                            </Link>
                            <Link href="/projects/create">
                                <Button variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
