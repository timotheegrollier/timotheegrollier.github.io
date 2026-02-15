import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.scss';

const navItems = [
    { path: '/', label: 'Accueil', key: '01' },
    { path: '/projets', label: 'Projets', key: '02' },
    { path: '/competences', label: 'Compétences', key: '03' },
    { path: '/contact', label: 'Contact', key: '04' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 8);
                ticking = false;
            });
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isMobileOpen]);

    useEffect(() => {
        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener('keydown', onEscape);
        return () => window.removeEventListener('keydown', onEscape);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
            <div className="navbar__inner">
                <NavLink to="/" className="navbar__logo" id="nav-logo">
                    <span className="navbar__logo-mark">TG</span>
                    <span className="navbar__logo-text">Timothée Grollier</span>
                </NavLink>

                <button
                    className={`navbar__hamburger ${isMobileOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setIsMobileOpen((prev) => !prev)}
                    aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={isMobileOpen}
                    aria-controls="nav-links"
                    id="nav-hamburger"
                >
                    <span />
                    <span />
                    <span />
                </button>

                <button
                    className={`navbar__backdrop ${isMobileOpen ? 'navbar__backdrop--open' : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                    aria-label="Fermer le menu mobile"
                />

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
                                <span className="navbar__link-key">{item.key}</span>
                                <span className="navbar__link-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
