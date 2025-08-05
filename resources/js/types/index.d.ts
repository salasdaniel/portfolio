import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Status {
    id: number;
    name: string;
    color?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Database {
    id: number;
    name: string;
    type?: string;
    icon?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface UserEducation {
    id?: number;
    institution: string;
    degree: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
    sort_order: number;
}

export interface UserExperience {
    id?: number;
    position: string;
    company: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
    sort_order: number;
}

export interface UserSkill {
    id?: number;
    title: string;
    description?: string;
    icon?: string;
    sort_order: number;
}

export interface Project {
    id: number;
    title: string;
    description?: string;
    technologies?: string;
    github_url?: string;
    demo_url?: string;
    image_url?: string;
    is_private: boolean;
    created_at: string;
    updated_at: string;
}

export interface TechnologySkill {
    id: number;
    name: string;
}

export interface OtherTechnology {
    name: string;
    sort_order: number;
}
