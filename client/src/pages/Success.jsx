import { useLocation, Link } from 'react-router-dom'

export default function Success() {
    const { state } = useLocation()

    if (!state) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--muted)' }}>No registration data found.</p>
                    <Link to="/register" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Register Now</Link>
                </div>
            </main>
        )
    }

    const { registrationId, team } = state
    const lead = team?.members?.find(m => m.isLead) || team?.members?.[0]

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
            <div style={{ maxWidth: 560, width: '100%' }}>
                {/* Success badge */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                    <div className="section-label" style={{ justifyContent: 'center' }}>Registration Complete</div>
                    <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2rem,5vw,2.8rem)', lineHeight: 1.1, marginTop: '.5rem' }}>
                        You're In,<br /><span style={{ color: 'var(--orange)' }}>HackBattle 2026!</span>
                    </h1>
                </div>

                {/* Reg ID card */}
                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,92,26,.06)', border: '1px solid rgba(255,92,26,.25)', borderRadius: 16, marginBottom: '1.5rem' }}>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', letterSpacing: '.15em', color: 'var(--muted)', marginBottom: '.5rem', textTransform: 'uppercase' }}>Your Registration ID</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--orange)', letterSpacing: '-.02em' }}>{registrationId}</div>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.72rem', color: 'var(--muted)', marginTop: '.5rem' }}>Save this ID for event day</div>
                </div>

                {/* Team details */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--orange)', marginBottom: '1rem' }}>Team Details</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}>
                            <span style={{ color: 'var(--muted)' }}>Team Name</span>
                            <span style={{ fontWeight: 600 }}>{team?.teamName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}>
                            <span style={{ color: 'var(--muted)' }}>Track</span>
                            <span style={{ fontWeight: 600 }}>{team?.track}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '.75rem' }}>
                            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '.5rem', textTransform: 'uppercase' }}>Members</div>
                            {team?.members?.map((m, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '.35rem' }}>
                                    <span style={{ color: m.isLead ? 'var(--orange)' : 'var(--text)' }}>{m.isLead ? '👑 ' : ''}{m.name}</span>
                                    <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.75rem', color: 'var(--muted)' }}>{m.rollNo}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Email note */}
                {lead?.email && (
                    <div style={{ padding: '.75rem 1rem', background: 'rgba(6,214,160,.06)', border: '1px solid rgba(6,214,160,.2)', borderRadius: 8, marginBottom: '1.5rem', fontSize: '.82rem', color: 'var(--green)' }}>
                        📧 Confirmation email sent to <strong>{lead.email}</strong>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--muted)', fontSize: '.82rem' }}>
                    Event: <strong style={{ color: 'var(--text)' }}>18th March 2026, 11:00 AM</strong> · Vishveshwarya Group of Institutions
                </div>

                <Link to="/" className="btn-outline" style={{ display: 'flex', justifyContent: 'center' }}>← Back to Home</Link>
            </div>
        </main>
    )
}
