import { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';

interface PublicLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function PublicLayout({ children, title = 'DevPortfolio' }: PublicLayoutProps) {
    return (
        <div style={{ backgroundColor: '#121212' }}>
            <Head title={title} />
            
            {/* Main Content - max 100vh with navbar inside */}
            <main className="h-screen relative z-10 overflow-hidden">
                {/* Header inside main */}
                <header className="bg-transparent">
                    <div className="container mx-auto px-6 py-4">
                        <nav className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1db954' }}>
                                    <span className="font-bold text-sm" style={{ color: '#121212' }}>D</span>
                                </div>
                                <span className="text-xl font-bold" style={{ color: '#b3b3b3' }}>DevPortfolio</span>
                            </div>

                            {/* Navigation */}
                            <div className="hidden md:flex items-center space-x-8">
                             
                                
                                <a 
                                    href={route('login')} 
                                    className="transition-colors duration-200 hover:opacity-80"
                                    style={{ color: '#b3b3b3' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#1db954'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}
                                >
                                    Sign In
                                </a>
                                <a 
                                    href={route('register')} 
                                    className="px-6 py-2 rounded-full font-semibold transition-all duration-200 hover:opacity-90"
                                    style={{ 
                                        backgroundColor: '#1db954',
                                        color: '#121212',
                                        border: '2px solid #1db954'
                                    }}
                                >
                                    Sign Up
                                </a>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button style={{ color: '#b3b3b3' }}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Content area - takes remaining height */}
                <div className="flex-1 h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
