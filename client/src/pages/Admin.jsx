import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import NotFound from './NotFound'

const REG_OPEN = new Date('2026-03-01T00:00:00+05:30')
const REG_CLOSE = new Date('2026-03-17T23:59:59+05:30')

function RegStatusBadge() {
    const now = new Date()
    const open = now >= REG_OPEN && now <= REG_CLOSE
    return (
        <span style={{ padding: '4px 12px', borderRadius: 100, fontFamily: 'DM Mono,monospace', fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', background: open ? 'rgba(6,214,160,.12)' : 'rgba(255,71,87,.12)', color: open ? 'var(--green)' : 'var(--red)', border: `1px solid ${open ? 'rgba(6,214,160,.3)' : 'rgba(255,71,87,.3)'}` }}>
            {open ? '● OPEN' : '● CLOSED'}
        </span>
    )
}

export default function Admin() {
    const { token } = useParams()
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(true)
    const [teams, setTeams] = useState([])
    const [stats, setStats] = useState(null)
    const [search, setSearch] = useState('')
    const [trackFilter, setFilter] = useState('')
    const [expandedId, setExpanded] = useState(null)
    const [lastRefresh, setLast] = useState(null)

    const fetchData = useCallback(async () => {
        try {
            const [teamsRes, statsRes] = await Promise.all([
                axios.get(`/api/admin/${token}`),
                axios.get(`/api/admin/${token}/stats`),
            ])
            setTeams(teamsRes.data.teams || [])
            setStats(statsRes.data)
            setLast(new Date())
        } catch (err) {
            if (err?.response?.status === 404) setNotFound(true)
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        fetchData()
        const id = setInterval(fetchData, 60000)
        return () => clearInterval(id)
    }, [fetchData])

    if (notFound) return <NotFound />

    if (loading) return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                <p style={{ color: 'var(--muted)', marginTop: '1rem', fontFamily: 'DM Mono,monospace', fontSize: '.78rem' }}>Loading dashboard...</p>
            </div>
        </main>
    )

    // ── Filter teams ──
    const filtered = teams.filter(t => {
        const q = search.toLowerCase()
        const matchSearch = !q || t.teamName.toLowerCase().includes(q) ||
            t.members.some(m => m.rollNo.toLowerCase().includes(q) || m.name.toLowerCase().includes(q))
        const matchTrack = !trackFilter || t.track === trackFilter
        return matchSearch && matchTrack
    })

    const tracks = [...new Set(teams.map(t => t.track))]

    return (
        <main style={{ minHeight: '100vh', padding: 'clamp(4rem,8vw,5rem) clamp(1rem,3vw,1.5rem) 3rem' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                        <div className="section-label" style={{ marginBottom: '.25rem' }}>🔐 Admin Dashboard</div>
                        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem,4vw,1.8rem)' }}>HackBattle 2026 — Registrations</h1>
                        {lastRefresh && (
                            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', color: 'var(--muted)', marginTop: '.25rem' }}>
                                Last updated: {lastRefresh.toLocaleTimeString()} — auto-refreshes every 60s
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <RegStatusBadge />
                        <a href={`${import.meta.env.VITE_API_URL || ''}/api/admin/${token}/export`} className="btn-primary" style={{ fontSize: '.82rem', padding: '10px 18px' }} target="_blank" rel="noreferrer">
                            ⬇ Export CSV
                        </a>
                    </div>
                </div>

                {/* Stats cards */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,160px),1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--orange)', lineHeight: 1 }}>{stats.totalTeams}</div>
                            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 6 }}>Total Teams</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--yellow)', lineHeight: 1 }}>{stats.totalParticipants}</div>
                            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 6 }}>Total Participants</div>
                        </div>
                        {Object.entries(stats.trackCounts || {}).map(([track, count]) => (
                            <div key={track} className="card" style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--green)', lineHeight: 1 }}>{count}</div>
                                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.6rem', letterSpacing: '.08em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 6 }}>{track}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search & Filter */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <input className="form-input" placeholder="🔍  Search by team name or roll number..." style={{ flex: 1, minWidth: 220 }}
                        value={search} onChange={e => setSearch(e.target.value)} />
                    <select className="form-select" style={{ width: 'auto', minWidth: 180, flexShrink: 0 }} value={trackFilter} onChange={e => setFilter(e.target.value)}>
                        <option value="">All Tracks</option>
                        {tracks.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button className="btn-outline" onClick={fetchData} style={{ padding: '10px 18px', fontSize: '.82rem' }}>↻ Refresh</button>
                </div>

                {/* Teams count */}
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.72rem', color: 'var(--muted)', marginBottom: '.75rem' }}>
                    Showing {filtered.length} of {teams.length} teams
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                        {teams.length === 0 ? 'No registrations yet.' : 'No teams match your search.'}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Reg. ID</th>
                                    <th>Team Name</th>
                                    <th>Track</th>
                                    <th>Problem Statement</th>
                                    <th>Team Lead</th>
                                    <th>Members</th>
                                    <th>Registered At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(t => {
                                    const lead = t.members.find(m => m.isLead) || t.members[0]
                                    const extras = t.members.filter(m => !m.isLead)
                                    const expanded = expandedId === t._id
                                    return (
                                        <tr key={t._id} onClick={() => setExpanded(expanded ? null : t._id)} style={{ cursor: 'pointer' }}>
                                            <td><code style={{ fontFamily: 'DM Mono,monospace', color: 'var(--orange)', fontSize: '.78rem' }}>{t.registrationId}</code></td>
                                            <td style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>{t.teamName}</td>
                                            <td><span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.72rem', color: 'var(--muted)' }}>{t.track}</span></td>
                                            <td style={{ maxWidth: 220 }}>
                                                <div style={{ color: expanded ? 'var(--text)' : 'var(--muted)', fontSize: '.82rem', lineHeight: 1.5, cursor: 'pointer' }}>
                                                    {expanded ? t.problemStatement : `${t.problemStatement.slice(0, 80)}${t.problemStatement.length > 80 ? '...' : ''}`}
                                                </div>
                                                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', color: 'var(--orange)' }}>{expanded ? '▲ collapse' : '▼ expand'}</span>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '.82rem', fontWeight: 600 }}>{lead?.name}</div>
                                                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: 'var(--muted)' }}>{lead?.rollNo}</div>
                                                {lead?.email && <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{lead?.email}</div>}
                                                {lead?.phone && <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: 'var(--muted)' }}>{lead?.phone}</div>}
                                            </td>
                                            <td>
                                                {extras.map((m, i) => (
                                                    <div key={i} style={{ marginBottom: '.3rem' }}>
                                                        <span style={{ fontSize: '.82rem' }}>{m.name}</span>
                                                        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: 'var(--muted)', marginLeft: 6 }}>{m.rollNo}</span>
                                                    </div>
                                                ))}
                                                {extras.length === 0 && <span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>—</span>}
                                            </td>
                                            <td style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                                                {new Date(t.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    )
}
