import { Link } from 'react-router-dom';
import './NotFound.scss';

export default function NotFound() {
    return (
        <section className="not-found" id="not-found">
            <div className="not-found__content">
                <h1 className="not-found__code">
                    <span>4</span>
                    <span className="not-found__zero">0</span>
                    <span>4</span>
                </h1>
                <h2 className="not-found__title">Page introuvable</h2>
                <p className="not-found__desc">
                    Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
                </p>
                <Link to="/" className="not-found__cta" id="not-found-home">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Retour à l'accueil
                </Link>
            </div>
        </section>
    );
}
