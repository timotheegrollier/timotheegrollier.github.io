import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.scss';

const navItems = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/projets', label: 'Projets', icon: '🚀' },
    { path: '/competences', label: 'Compétences', icon: '⚡' },
    { path: '/contact', label: 'Contact', icon: '✉️' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
            <div className="navbar__inner">
                <NavLink to="/" className="navbar__logo" id="nav-logo">
                    <span className="navbar__logo-symbol">&lt;</span>
                    TG
                    <span className="navbar__logo-symbol"> /&gt;</span>
                </NavLink>

                <button
                    className={`navbar__hamburger ${isMobileOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Menu"
                    id="nav-hamburger"
                >
                    <span />
                    <span />
                    <span />
                </button>

                <ul className={`navbar__links ${isMobileOpen ? 'navbar__links--open' : ''}`} id="nav-links">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                                }
                                end={item.path === '/'}
                                id={`nav-link-${item.label.toLowerCase()}`}
                            >
                                <span className="navbar__link-icon">{item.icon}</span>
                                <span className="navbar__link-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
