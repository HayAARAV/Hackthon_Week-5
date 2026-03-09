import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Dashboard() {
    const navigate = useNavigate()
    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verifySession = async () => {
            const authStr = sessionStorage.getItem('teamAuth')
            if (!authStr) {
                toast.error('Please login to access the dashboard.')
                navigate('/login')
                return
            }

            try {
                const { registrationId, email } = JSON.parse(authStr)
                // Use the same login endpoint to fetch fresh data
                const { data } = await axios.post('/api/login', { registrationId, email })

                if (data.success && data.team) {
                    setTeam(data.team)
                } else {
                    throw new Error('Invalid session')
                }
            } catch (err) {
                sessionStorage.removeItem('teamAuth')
                toast.error('Session expired. Please login again.')
                navigate('/login')
            } finally {
                // Minimum loading time for smooth skeleton animation
                setTimeout(() => setLoading(false), 800)
            }
        }

        verifySession()
    }, [navigate])

    const handleLogout = () => {
        sessionStorage.removeItem('teamAuth')
        toast('Logged out', { icon: '👋' })
        navigate('/login')
    }

    if (loading) {
        return (
            <main style={{ minHeight: '100vh', padding: 'clamp(5rem,10vw,6rem) clamp(1rem,4vw,2rem) 3rem' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div>
                            <div className="skeleton" style={{ width: 100, height: 16, marginBottom: 12 }}></div>
                            <div className="skeleton" style={{ width: 250, height: 40, marginBottom: 12 }}></div>
                            <div className="skeleton" style={{ width: 150, height: 16 }}></div>
                        </div>
                        <div className="skeleton" style={{ width: 90, height: 38, borderRadius: 10 }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <div className="skeleton" style={{ width: 140, height: 24 }}></div>
                                <div className="skeleton" style={{ width: 160, height: 24, borderRadius: 100 }}></div>
                            </div>
                            <div className="skeleton" style={{ width: '100%', height: 100, borderRadius: 8 }}></div>
                        </div>

                        <div className="card">
                            <div className="skeleton" style={{ width: 120, height: 24, marginBottom: '1.25rem' }}></div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                <div className="skeleton" style={{ width: '100%', height: 110, borderRadius: 12 }}></div>
                                <div className="skeleton" style={{ width: '100%', height: 75, borderRadius: 12 }}></div>
                                <div className="skeleton" style={{ width: '100%', height: 75, borderRadius: 12 }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (!team) return null

    const lead = team.members.find(m => m.isLead) || team.members[0]
    const others = team.members.filter(m => !m.isLead)

    return (
        <main style={{ minHeight: '100vh', padding: 'clamp(5rem,10vw,6rem) clamp(1rem,4vw,2rem) 3rem' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                        <div className="section-label" style={{ marginBottom: '.5rem' }}>Team Dashboard</div>
                        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>
                            {team.teamName}
                        </h1>
                        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', letterSpacing: '.1em', color: 'var(--muted)', marginTop: '.5rem', textTransform: 'uppercase' }}>
                            Reg ID: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{team.registrationId}</span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="btn-outline" style={{ fontSize: '.85rem', padding: '8px 16px' }}>
                        Log out
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Project Overview */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--orange)' }}>Project details</h2>
                            <span style={{ background: 'rgba(6,214,160,.1)', color: 'var(--green)', padding: '4px 10px', borderRadius: 100, fontSize: '.7rem', fontFamily: 'DM Mono,monospace', textTransform: 'uppercase', textAlign: 'right' }}>
                                Track: <span style={{ fontWeight: 700 }}>{team.track}</span>
                            </span>
                        </div>

                        <div>
                            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '.5rem', textTransform: 'uppercase' }}>Problem Statement</div>
                            <div style={{ color: 'var(--text)', fontSize: '.9rem', lineHeight: 1.6, background: 'rgba(255,255,255,.02)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border)' }}>
                                {team.problemStatement}
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="card">
                        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--orange)', marginBottom: '1.25rem' }}>Team Roster</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>

                            {/* Lead */}
                            <div style={{ padding: '1.25rem', background: 'rgba(255,92,26,.05)', border: '1px solid rgba(255,92,26,.2)', borderRadius: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>{lead.name}</span>
                                    <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', background: 'var(--orange)', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>👑 LEAD</span>
                                </div>
                                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.75rem', color: 'var(--muted)', marginBottom: '.5rem' }}>{lead.rollNo}</div>
                                <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{lead.email}</div>
                                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: 'var(--muted)', marginTop: 2 }}>{lead.phone}</div>
                            </div>

                            {/* Others */}
                            {others.map((m, i) => (
                                <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,.02)', border: '1px solid var(--border)', borderRadius: 12 }}>
                                    <div style={{ fontWeight: 600, marginBottom: '.5rem' }}>{m.name}</div>
                                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.75rem', color: 'var(--muted)' }}>{m.rollNo}</div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '.85rem', color: 'var(--muted)' }}>
                    Need to make changes? Contact the organizers at <a href="mailto:bugbytex@gmail.com" style={{ color: 'var(--orange)' }}>bugbytex@gmail.com</a>
                </div>

            </div>
        </main>
    )
}
