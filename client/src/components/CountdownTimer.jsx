import { useState, useEffect } from 'react'

// Target: 18th March 2026, 11:00 AM IST
const TARGET = new Date('2026-03-18T11:00:00+05:30')

function pad(n) { return String(n).padStart(2, '0') }

export default function CountdownTimer() {
    const [time, setTime] = useState(null)
    const [live, setLive] = useState(false)

    useEffect(() => {
        function tick() {
            const diff = TARGET - new Date()
            if (diff <= 0) { setLive(true); return }
            setTime({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            })
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    if (live) return (
        <div style={{ color: 'var(--orange)', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-.02em' }}>
            🔴 HACKATHON IS LIVE!
        </div>
    )

    const units = time ? [
        { val: pad(time.d), lbl: 'DAYS' },
        { val: pad(time.h), lbl: 'HRS' },
        { val: pad(time.m), lbl: 'MIN' },
        { val: pad(time.s), lbl: 'SEC' },
    ] : [
        { val: '--', lbl: 'DAYS' },
        { val: '--', lbl: 'HRS' },
        { val: '--', lbl: 'MIN' },
        { val: '--', lbl: 'SEC' },
    ]

    return (
        <div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.6rem', textAlign: 'center' }}>
                Hackathon starts in
            </div>
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', alignItems: 'center' }}>
                {units.map((u, i) => (
                    <div key={u.lbl} style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <div style={{
                                fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.8rem',
                                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
                                padding: '.3rem .9rem', minWidth: 58, textAlign: 'center', lineHeight: 1,
                                transition: 'all .1s',
                            }}>{u.val}</div>
                            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.6rem', letterSpacing: '.1em', color: 'var(--muted)' }}>{u.lbl}</div>
                        </div>
                        {i < 3 && <div style={{ fontSize: '1.4rem', color: 'var(--orange)', fontWeight: 700, paddingBottom: 12, animation: 'pulse 1.5s infinite' }}>:</div>}
                    </div>
                ))}
            </div>
        </div>
    )
}
