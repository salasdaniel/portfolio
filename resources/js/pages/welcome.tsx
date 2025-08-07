import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

interface User {
    id: number;
    name: string;
    profession?: string;
    username: string;
}

export default function Welcome() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Debounced search effect
    const searchUsers = useCallback(async () => {
        if (searchQuery.length < 2) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(`/search-users?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setUsers(data);
            setIsOpen(true);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setUsers([]);
            setIsOpen(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchUsers]);

    const selectUser = (user: User) => {
        router.visit(`/${user.username}`);
    };

    return (
        <PublicLayout title="DevPortfolio - Search for a DEV">
            <div className="flex items-center justify-center" style={{ backgroundColor: '#121212', height: 'calc(100vh - 80px)' }}>
                {/* Single Center Panel */}
                <div className="w-full max-w-md px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>
                            Find Your Next
                        </h1>
                        <h2 className="text-5xl font-bold mb-6" style={{ color: '#1db954' }}>
                            Developer
                        </h2>
                        <p className="text-lg leading-relaxed" style={{ color: '#535353' }}>
                            Discover talented developers and explore their amazing portfolios
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5" style={{ color: '#535353' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
                            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                            placeholder="Search by username..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none transition-all duration-200"
                            style={{ 
                                backgroundColor: '#212121', 
                                border: '1px solid #535353',
                                color: '#b3b3b3'
                            }}
                        />
                        {isLoading && (
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#1db954' }}></div>
                            </div>
                        )}

                        {/* Dropdown Results */}
                        {isOpen && users.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#212121'}}>
                                {users.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => selectUser(user)}
                                        className="w-full px-4 py-3 text-left transition-colors duration-200 border-b last:border-b-0 hover:opacity-80"
                                        style={{ 
                                            
                                            backgroundColor: 'transparent'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#535353'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1db954' }}>
                                                <span className="font-bold text-sm" style={{ color: '#121212' }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium" style={{ color: '#ffffff' }}>{user.name}</div>
                                                <div className="text-sm" style={{ color: '#cccccc' }}>@{user.username}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* No results */}
                        {isOpen && users.length === 0 && searchQuery.length >= 2 && !isLoading && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#212121' }}>
                                <div className="px-4 py-3 text-center" style={{ color: '#535353' }}>
                                    No developers found
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Auth Links */}
                    <div className="flex gap-4 ">
                        <a 
                            href={route('register')} 
                            className="flex-1 text-center px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90"
                            style={{ 
                                backgroundColor: '#1db954', 
                                color: '#121212',
                                border: '2px solid #1db954'
                            }}
                        >
                            Sign Up
                        </a>
                        <a 
                            href={route('login')} 
                            className="flex-1 text-center px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
                            style={{ 
                                border: '1px solid #1db954',
                                color: '#1db954',
                                backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1db954';
                                e.currentTarget.style.color = '#121212';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#1db954';
                            }}
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
                   