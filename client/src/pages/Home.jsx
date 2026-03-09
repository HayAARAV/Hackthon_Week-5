import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CountdownTimer from '../components/CountdownTimer'

const TRACKS = [
    { icon: '🏥', name: 'Healthcare', desc: 'AI diagnostics, patient management, health monitoring, telemedicine' },
    { icon: '🌾', name: 'Agriculture', desc: 'Smart farming, crop monitoring, supply chain, agri-tech innovations' },
    { icon: '💰', name: 'Finance', desc: 'Fintech, fraud detection, budgeting tools, blockchain applications' },
    { icon: '🤖', name: 'Artificial Intelligence', desc: 'ML models, NLP, computer vision, intelligent automation systems' },
    { icon: '💡', name: 'Student Innovation', desc: 'Open track — social impact, sustainability, education tech, any idea' },
]

const SCHEDULE = [
    { date: '13th March 2026', event: 'Registration Opens', highlight: false },
    { date: '17th March — 11:59 PM', event: 'Registration Closes', highlight: false },
    { date: '18th March — 11:00 AM', event: '🚀 Hackathon Goes Live', highlight: true },
    { date: '18th March (Night)', event: 'Hall remains open — participants may leave to rest', highlight: false },
    { date: '19th March — 9:00 AM', event: 'All participants must return', highlight: false },
    { date: '19th March — 11:00 AM', event: '🏁 Hackathon Ends — Final Submission', highlight: true },
    { date: '19th March — 12:00 PM', event: '🏆 Results Announcement', highlight: false },
]

const JUDGING = [
    { part: 'Part 1', name: 'Project Evaluation', marks: 40, breakdown: 'Problem relevance (10) + Tech quality (15) + Innovation (10) + Functionality (5)' },
    { part: 'Part 2', name: 'PPT Presentation', marks: 30, breakdown: 'Clarity (10) + Technical depth (10) + Communication (10)' },
    { part: 'Part 3', name: 'LinkedIn Video', marks: 30, breakdown: 'Live demo (10) + Explanation (10) + College tag (10)' },
]

const RULES = [
    'Team size: 1 to 4 members.',
    'All members must be currently enrolled students.',
    'Each roll number can only be registered in one team.',
    'Project must be built within the 24-hour window.',
    'Use of pre-existing codebases is not allowed.',
    'Open-source libraries and APIs are permitted.',
    'Teams must present their work at the end of the hackathon.',
    'Decision of the judges is final.',
]

const FAQS = [
    { q: 'Who can participate?', a: 'Any currently enrolled college student. Teams of 1–4 members from any branch/year are welcome.' },
    { q: 'Is it free to register?', a: 'Yes! Registration is completely free. No payment gateway involved.' },
    { q: 'Can I be in multiple teams?', a: 'No. Each roll number can only be part of one team. Duplicate roll numbers will be rejected.' },
    { q: 'What track should I pick?', a: 'Pick any of the 5 tracks that aligns with your project idea. The "Student Innovation" track is fully open-ended.' },
    { q: 'What do I need to submit?', a: 'Working code, a PPT presentation, and a LinkedIn video demo. Details will be shared before the event.' },
    { q: 'Will food be provided?', a: 'Yes. The venue will have access to canteen facilities. Participants are free to leave at night and return by 9 AM on 19th March.' },
    { q: 'Where is the event?', a: 'Vishveshwarya Group of Institutions campus. Exact hall/room details will be communicated via email after registration.' },
    { q: 'What if I face a technical issue during registration?', a: 'Email us at bugbytex@gmail.com or contact the Ignite Club team directly.' },
]

export default function Home() {
    const revealRefs = useRef([])

    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
            { threshold: 0.1 }
        )
        revealRefs.current.forEach(el => el && obs.observe(el))
        return () => obs.disconnect()
    }, [])

    const addRevealRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el) }

    return (
        <main>
            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <section style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                padding: 'clamp(5rem,10vw,6rem) clamp(1rem,5vw,2rem) 4rem', position: 'relative', overflow: 'hidden',
            }}>
                <div className="grid-bg" />
                <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,92,26,.14) 0%,transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

                <div className="animate-fadeDown" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--orange-dim)', border: '1px solid rgba(255,92,26,.3)', color: 'var(--orange)', fontFamily: 'DM Mono,monospace', fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 100, marginBottom: '2rem' }}>
                    <span style={{ fontSize: '.55rem' }}>◉</span>
                    Ignite Club · Vishveshwarya Group of Institutions
                </div>

                <h1 className="animate-fadeDown" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(3rem,10vw,7rem)', lineHeight: .95, letterSpacing: '-.03em', animationDelay: '.1s', marginBottom: '.5rem' }}>
                    Hack<br /><span style={{ WebkitTextStroke: '2px var(--orange)', color: 'transparent' }}>Battle</span>
                </h1>
                <div className="animate-fadeDown" style={{ fontFamily: 'DM Mono,monospace', fontSize: 'clamp(.9rem,2vw,1.1rem)', color: 'var(--orange)', letterSpacing: '.2em', animationDelay: '.15s', marginBottom: '.5rem' }}>2026</div>

                <p className="animate-fadeDown" style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(.95rem,2.5vw,1.2rem)', color: 'var(--muted)', fontWeight: 400, marginTop: '1.5rem', animationDelay: '.2s', maxWidth: 520, lineHeight: 1.7 }}>
                    24-hour inter-college hackathon.<br />Build something that matters. Ship. Win.
                </p>

                {/* Stats bar */}
                <div className="animate-fadeDown hero-stats-bar" style={{ display: 'flex', gap: 'clamp(1rem,4vw,2.5rem)', marginTop: '2.5rem', animationDelay: '.3s', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[['24', 'Hours'], ['5', 'Tracks'], ['4', 'Max Members'], ['18–19', 'March 2026']].map(([val, lbl], i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(.8rem,3vw,2.5rem)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <span className="hero-stat-val" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 'clamp(1.2rem,4vw,1.6rem)', color: 'var(--orange)' }}>{val}</span>
                                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{lbl}</span>
                            </div>
                            {i < 3 && <div style={{ width: 1, height: 32, background: 'var(--border)' }} />}
                        </div>
                    ))}
                </div>

                {/* Countdown */}
                <div className="animate-fadeDown" style={{ marginTop: '2.5rem', animationDelay: '.4s' }}>
                    <CountdownTimer />
                </div>

                {/* CTA */}
                <div className="animate-fadeDown" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', animationDelay: '.5s', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 400 }}>
                    <Link to="/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>Register Your Team →</Link>
                    <a href="#tracks" className="btn-outline" style={{ flex: 1, justifyContent: 'center', minWidth: 130 }}>Explore Tracks</a>
                </div>

                {/* Scroll indicator */}
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,var(--orange),transparent)', animation: 'pulse 2s infinite' }} />
                    <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', letterSpacing: '.15em', color: 'var(--muted)' }}>SCROLL</span>
                </div>
            </section>

            <div className="section-divider" />

            {/* ── TRACKS ───────────────────────────────────────────────────────── */}
            <section id="tracks" className="section-container reveal" ref={addRevealRef}>
                <div className="section-label">Tracks</div>
                <h2 className="section-title">Choose Your Domain</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,190px),1fr))', gap: '1rem' }}>
                    {TRACKS.map(t => {
                        const START_TIME = new Date('2026-03-18T11:00:00+05:30')
                        const isLive = new Date() >= START_TIME
                        return (
                            <div key={t.name} className="card" style={{ position: 'relative', overflow: 'hidden', transition: 'transform .3s,border-color .3s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,92,26,.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right,var(--orange),transparent)' }} />
                                <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{t.icon}</div>
                                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem' }}>{t.name}</h3>
                                <div style={{ position: 'relative' }}>
                                    <p style={{
                                        color: 'var(--muted)',
                                        fontSize: '.82rem',
                                        lineHeight: 1.6,
                                        filter: isLive ? 'none' : 'blur(5px)',
                                        userSelect: isLive ? 'auto' : 'none',
                                        pointerEvents: isLive ? 'auto' : 'none',
                                        transition: 'filter 0.5s'
                                    }}>
                                        {t.desc}
                                    </p>
                                    {!isLive && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            pointerEvents: 'none'
                                        }}>
                                            <span style={{
                                                fontFamily: 'DM Mono,monospace',
                                                fontSize: '.62rem',
                                                letterSpacing: '.05em',
                                                color: 'var(--orange)',
                                                background: 'rgba(255,92,26,0.1)',
                                                padding: '4px 10px',
                                                borderRadius: 100,
                                                border: '1px solid rgba(255,92,26,0.3)',
                                                backdropFilter: 'blur(4px)',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                Reveals 18 March
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <div className="section-divider" />

            {/* ── SCHEDULE ─────────────────────────────────────────────────────── */}
            <section id="schedule" className="section-container reveal" ref={addRevealRef}>
                <div className="section-label">Timeline</div>
                <h2 className="section-title">Key Dates</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {SCHEDULE.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.highlight ? 'var(--orange)' : 'var(--border)', border: s.highlight ? '2px solid var(--orange)' : '2px solid var(--muted)', flexShrink: 0, marginTop: 4, boxShadow: s.highlight ? '0 0 12px rgba(255,92,26,.5)' : 'none' }} />
                                {i < SCHEDULE.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
                            </div>
                            <div>
                                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 4 }}>{s.date}</div>
                                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: s.highlight ? 700 : 400, color: s.highlight ? 'var(--orange)' : 'var(--text)', fontSize: '.95rem' }}>{s.event}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="section-divider" />

            {/* ── JUDGING ──────────────────────────────────────────────────────── */}
            <section className="section-container reveal" ref={addRevealRef}>
                <div className="section-label">Judging</div>
                <h2 className="section-title">100 Points Breakdown</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '.75rem 1.5rem', background: 'var(--surface)', fontFamily: 'DM Mono,monospace', fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                        <span>Criteria</span><span>Marks</span>
                    </div>
                    {JUDGING.map(j => (
                        <div key={j.part} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--card)', transition: 'background .2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#16162a'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}>
                            <div>
                                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.65rem', color: 'var(--orange)', letterSpacing: '.08em', marginBottom: 3 }}>{j.part}</div>
                                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, marginBottom: 4 }}>{j.name}</div>
                                <div style={{ height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', maxWidth: 300 }}>
                                    <div style={{ height: '100%', width: `${j.marks}%`, background: 'linear-gradient(to right,var(--orange),var(--yellow))', borderRadius: 2 }} />
                                </div>
                                <div style={{ color: 'var(--muted)', fontSize: '.75rem', marginTop: 6 }}>{j.breakdown}</div>
                            </div>
                            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--orange)', paddingLeft: '1rem' }}>{j.marks}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(255,92,26,.08)', border: '1px solid rgba(255,92,26,.2)', borderRadius: '0 0 12px 12px', marginTop: -2 }}>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: 'var(--orange)', fontSize: '1.1rem' }}>100 pts</span>
                </div>
            </section>

            <div className="section-divider" />

            {/* ── RULES ────────────────────────────────────────────────────────── */}
            <section className="section-container reveal" ref={addRevealRef}>
                <div className="section-label">Rules</div>
                <h2 className="section-title">Participation Guidelines</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: '.75rem' }}>
                    {RULES.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: '1rem 1.25rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }}>
                            <span style={{ color: 'var(--orange)', fontFamily: 'DM Mono,monospace', fontSize: '.75rem', marginTop: 1, flexShrink: 0 }}>0{i + 1}</span>
                            <span style={{ fontSize: '.88rem', lineHeight: 1.6, color: 'var(--text)' }}>{r}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="section-divider" />

            {/* ── FAQ ──────────────────────────────────────────────────────────── */}
            <section id="faq" className="section-container reveal" ref={addRevealRef}>
                <div className="section-label">FAQ</div>
                <h2 className="section-title">Common Questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    {FAQS.map((f, i) => (
                        <details key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer' }}>
                            <summary style={{ padding: '1rem 1.25rem', fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '.95rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {f.q}
                                <span style={{ color: 'var(--orange)', fontSize: '1.1rem', fontFamily: 'DM Mono,monospace' }}>+</span>
                            </summary>
                            <div style={{ padding: '0 1.25rem 1rem', color: 'var(--muted)', fontSize: '.88rem', lineHeight: 1.7 }}>{f.a}</div>
                        </details>
                    ))}
                </div>
            </section>

            <div className="section-divider" />

            {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
            <section className="section-container reveal" ref={addRevealRef} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.68rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem' }}>Ready to compete?</div>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    Register before<br /><span style={{ color: 'var(--orange)' }}>17th March, 11:59 PM</span>
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '.95rem', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' }}>
                    Registration is free. All students from any college are welcome.
                </p>
                <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
                    Start Your Registration →
                </Link>
            </section>
        </main>
    )
}
