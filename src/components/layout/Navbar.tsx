import React, { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'Best Practices', href: '/best-practices' },
  { label: 'Guides', href: '/guides' },
  { label: 'Videos', href: '/videos' },
  { label: 'Teams', href: '/teams' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <nav className="sticky top-0 z-50 h-14 bg-bg-primary/95 backdrop-blur-md border-b border-border-default">
      <div className="max-w-container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1.5 text-white font-bold text-lg hover:opacity-90 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-yellow">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          roadmap.sh
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                currentPath.startsWith(link.href)
                  ? 'text-white font-medium'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <a 
            href="/signup" 
            className="px-3 py-1.5 text-xs font-medium bg-accent-yellow text-gray-900 rounded-full hover:bg-yellow-300 transition-colors"
          >
            Subscribe
          </a>
          <a 
            href="/login" 
            className="text-sm text-text-secondary hover:text-white transition-colors"
          >
            Login
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-bg-primary z-40 animate-fade-in">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-lg py-2 border-b border-border-default transition-colors ${
                  currentPath.startsWith(link.href)
                    ? 'text-white font-medium'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <a 
                href="/signup" 
                className="w-full text-center py-3 text-sm font-medium bg-accent-yellow text-gray-900 rounded-md hover:bg-yellow-300 transition-colors"
              >
                Subscribe
              </a>
              <a 
                href="/login" 
                className="w-full text-center py-3 text-sm text-text-secondary border border-border-default rounded-md hover:text-white hover:border-border-hover transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
