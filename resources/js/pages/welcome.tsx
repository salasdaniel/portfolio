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
        router.visit(`/${user.name}`);
    };

    return (
        <PublicLayout title="DevPortfolio - Search for a DEV">
            <div className="container mx-auto px-6 py-20">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                        Search for a
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                            DEV
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                        Discover amazing developers and their portfolios.
                        <br />
                        Find inspiration, connect, and explore their work.
                    </p>

                    {/* Search Combobox */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
                                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                                placeholder="Search developers by username..."
                                className="w-full pl-14 pr-6 py-6 text-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                            {isLoading && (
                                <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Results */}
                        {isOpen && users.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                                {users.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => selectUser(user)}
                                        className="w-full px-6 py-4 text-left hover:bg-white/10 transition-colors duration-200 border-b border-white/10 last:border-b-0"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold text-lg">{user.name} - {user.username}</div>
                                                {user.profession && (
                                                    <div className="text-gray-300 text-sm">{user.profession}</div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* No results */}
                        {isOpen && users.length === 0 && searchQuery.length >= 2 && !isLoading && (
                            <div className="absolute z-50 w-full mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="px-6 py-4 text-center text-gray-300">
                                    No developers found with that username
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 space-y-4">
                        <p className="text-gray-300 text-lg">
                            Are you a developer? 
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href={route('register')} 
                                className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105"
                            >
                                Create Your Portfolio
                            </a>
                            <a 
                                href={route('login')} 
                                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-bold text-lg transition-all duration-200"
                            >
                                Sign In
                            </a>
                        </div>
                    </div>
                </div>

                {/* Feature highlights */}
                <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Professional Portfolios</h3>
                        <p className="text-gray-300">Showcase your skills, experience, and projects in a beautiful portfolio.</p>
                    </div>

                    <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Easy Discovery</h3>
                        <p className="text-gray-300">Find developers by their skills, location, or areas of expertise.</p>
                    </div>

                    <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Connect & Network</h3>
                        <p className="text-gray-300">Build your professional network and collaborate with talented developers.</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
                   