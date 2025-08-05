import { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';

interface PublicLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function PublicLayout({ children, title = 'DevPortfolio' }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Head title={title} />
            
            {/* Header */}
            <header className="relative z-10">
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-black font-bold text-sm">D</span>
                            </div>
                            <span className="text-white text-xl font-bold">DevPortfolio</span>
                        </div>

                        {/* Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a 
                                href={route('home')} 
                                className="text-white hover:text-green-400 transition-colors duration-200"
                            >
                                Home
                            </a>
                            <a 
                                href={route('login')} 
                                className="text-white hover:text-green-400 transition-colors duration-200"
                            >
                                Sign In
                            </a>
                            <a 
                                href={route('register')} 
                                className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
                            >
                                Sign Up
                            </a>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button className="text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10">
                {children}
            </main>

            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
}
