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
                <p>
                    © {new Date().getFullYear()} Timothée Grollier — Fait avec{' '}
                    <span className="heart">♥</span> et React + TypeScript
                </p>
            </footer>
        </div>
    );
}
