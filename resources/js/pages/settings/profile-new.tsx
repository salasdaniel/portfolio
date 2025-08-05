import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ColorPicker from '@/components/ColorPicker';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface User {
    id: number;
    name: string;
    username?: string;
    email: string;
    email_verified_at?: string | null;
    phone?: string;
    location?: string;
    born_date?: string;
    description?: string;
    profile_image?: string;
    cv_file?: string;
    theme_color: string;
    programming_language_skills?: Array<{
        id: number;
        name: string;
        pivot: {
            description?: string;
            experience_level: string;
        };
    }>;
    framework_skills?: Array<{
        id: number;
        name: string;
        pivot: {
            description?: string;
            experience_level: string;
        };
    }>;
    other_technologies?: Array<{
        id: number;
        name: string;
        description?: string;
        experience_level: number;
        category?: string;
    }>;
}

interface Props {
    user: User;
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({ user, mustVerifyEmail }: Props) {
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
        user.profile_image ? `/storage/${user.profile_image}` : null
    );
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const { data, setData, errors } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        born_date: user.born_date || '',
        description: user.description || '',
        theme_color: user.theme_color || '#3b82f6',
    });

    // Separate state for files and complex data
    const [profileImage, setProfileImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setProfileImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        setRecentlySuccessful(false);
        
        // Create FormData manually to properly handle file upload
        const formData = new FormData();
        
        // Add all the form fields
        formData.append('name', data.name as string);
        formData.append('username', data.username as string);
        formData.append('email', data.email as string);
        formData.append('phone', data.phone as string);
        formData.append('location', data.location as string);
        formData.append('born_date', data.born_date as string);
        formData.append('description', data.description as string);
        formData.append('theme_color', data.theme_color as string);
        
        // Add the profile image if one was selected
        if (profileImage) {
            formData.append('profile_image', profileImage);
        }
        
        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            formData.append('_token', csrfToken);
        }
        
        // Submit with fetch instead of Inertia's post to handle file upload properly
        fetch('/settings/profile', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then(response => {
            setProcessing(false);
            if (response.ok) {
                setRecentlySuccessful(true);
                // Clear the file input and reset preview if new image was uploaded
                if (profileImage) {
                    setProfileImage(null);
                    // Update preview with new image path
                    response.json().then(data => {
                        if (data.user && data.user.profile_image) {
                            setProfileImagePreview(`/storage/${data.user.profile_image}`);
                        }
                    }).catch(() => {
                        // If JSON parsing fails, just reload to get updated data
                        window.location.reload();
                    });
                }
                // Hide success message after 3 seconds
                setTimeout(() => setRecentlySuccessful(false), 3000);
            } else {
                console.error('Error uploading profile');
            }
        })
        .catch(error => {
            setProcessing(false);
            console.error('Error:', error);
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* Basic Information */}
                    <div>
                        <HeadingSmall title="Personal Information" />
                        <form onSubmit={submit} className="mt-6 space-y-6">
                            
                            {/* Profile Image */}
                            <div className="space-y-2">
                                <Label>Profile Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                        {profileImagePreview ? (
                                            <img
                                                src={profileImagePreview}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-muted-foreground">
                                                {data.name ? (data.name as string).charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            id="profile-image-input"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => {
                                                const input = document.getElementById('profile-image-input') as HTMLInputElement;
                                                input?.click();
                                            }}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Image
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            JPG, PNG or GIF. Max 2MB.
                                        </p>
                                    </div>
                                </div>
                                <InputError message={undefined} />
                            </div>

                            {/* Basic Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name as string}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={data.username as string}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="@username"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email as string}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone as string}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location as string}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="City, Country"
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="born_date">Born Date</Label>
                                    <Input
                                        id="born_date"
                                        type="date"
                                        value={data.born_date as string}
                                        onChange={(e) => setData('born_date', e.target.value)}
                                    />
                                    <InputError message={errors.born_date} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Bio/Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description as string}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Theme Color */}
                            <ColorPicker
                                label="Theme Color"
                                value={data.theme_color as string}
                                onChange={(color: string) => setData('theme_color', color)}
                            />

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Profile'}
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600">Profile saved successfully!</p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    {/* Email Verification Notice */}
                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                Your email address is unverified. Please check your email for a verification link.
                            </p>
                        </div>
                    )}

                    {/* Delete Account */}
                    <div className="pt-6 border-t">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
