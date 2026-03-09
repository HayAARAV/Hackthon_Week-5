export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.02em', marginBottom: '.5rem' }}>
                HACK<span style={{ color: 'var(--orange)' }}>BATTLE</span> <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '1rem' }}>2026</span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: '.4rem' }}>
                Organised by <strong style={{ color: 'var(--text)' }}>Ignite Club</strong> · Vishveshwarya Group of Institutions
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: '.4rem' }}>
                Built by <strong style={{ color: 'var(--orange)' }}>Team BugByte</strong>
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '.75rem', marginTop: '1rem' }}>
                18th–19th March 2026 · 24 Hours · Ignite Club HQ
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '.72rem', marginTop: '.5rem', fontFamily: 'DM Mono,monospace', letterSpacing: '.05em' }}>
                bugbytex@gmail.com
            </p>
        </footer>
    )
}
