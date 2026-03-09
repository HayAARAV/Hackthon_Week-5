import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', textAlign: 'center' }}>
            <div>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '5rem', fontWeight: 700, color: 'var(--border)', marginBottom: '1rem', lineHeight: 1 }}>404</div>
                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.6rem', marginBottom: '.75rem' }}>Page Not Found</h1>
                <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '.9rem' }}>The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn-primary">← Back to Home</Link>
            </div>
        </main>
    )
}
