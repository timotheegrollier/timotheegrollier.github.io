import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.scss';

export default function Layout() {
    return (
        <div className="layout">
            <Navbar />
            <main className="layout__main">
                <Outlet />
            </main>
            <footer className="layout__footer">
                <p className="layout__footer-line">© {new Date().getFullYear()} Timothée Grollier</p>
                <p className="layout__footer-meta">Développeur Full-Stack • React, Symfony, TypeScript</p>
            </footer>
        </div>
    );
}
