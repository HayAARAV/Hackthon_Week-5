import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const { pathname } = useLocation()
    const isHome = pathname === '/'
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false)

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: 'rgba(10,10,15,.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,.05)',
            }}>
                {/* Logo */}
                <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-.02em' }}>
                        HACK<span style={{ color: 'var(--orange)' }}>BATTLE</span>
                        <span style={{ fontFamily: 'DM Mono,monospace', fontWeight: 400, fontSize: '.65rem', color: 'var(--muted)', marginLeft: 5 }}>2026</span>
                    </span>
                </Link>

                {/* Desktop links */}
                {isHome && (
                    <div className="nav-desktop-links">
                        {['Tracks', 'Schedule', 'FAQ'].map(label => (
                            <a key={label} href={`#${label.toLowerCase()}`} style={{ fontFamily: 'DM Mono,monospace', fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', transition: 'color .2s' }}
                                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                                onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
                                {label}
                            </a>
                        ))}
                    </div>
                )}

                {/* Desktop CTA */}
                <div className="nav-desktop-links">
                    <Link to="/register" className="btn-primary" style={{ padding: '9px 18px', fontSize: '.8rem' }}>
                        Register Now →
                    </Link>
                </div>

                {/* Hamburger */}
                <button
                    className="nav-hamburger"
                    onClick={() => setOpen(o => !o)}
                    aria-label="Toggle menu"
                    style={{
                        background: 'none', border: 'none', color: 'var(--text)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        gap: 5, padding: 4,
                    }}>
                    <span style={{ display: 'block', width: 22, height: 2, background: open ? 'var(--orange)' : 'var(--text)', transition: 'transform .25s, opacity .25s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
                    <span style={{ display: 'block', width: 22, height: 2, background: open ? 'var(--orange)' : 'var(--text)', transition: 'opacity .25s', opacity: open ? 0 : 1 }} />
                    <span style={{ display: 'block', width: 22, height: 2, background: open ? 'var(--orange)' : 'var(--text)', transition: 'transform .25s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
                </button>
            </nav>

            {/* Mobile drawer */}
            <div style={{
                position: 'fixed', top: 61, left: 0, right: 0, zIndex: 99,
                background: 'rgba(10,10,15,.97)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border)',
                padding: open ? '1.25rem' : '0 1.25rem',
                maxHeight: open ? 400 : 0,
                overflow: 'hidden',
                transition: 'max-height .35s ease, padding .2s ease',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {isHome && ['Tracks', 'Schedule', 'FAQ'].map(label => (
                        <a key={label} href={`#${label.toLowerCase()}`} onClick={close}
                            style={{ fontFamily: 'DM Mono,monospace', fontSize: '.82rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', padding: '4px 0' }}>
                            {label}
                        </a>
                    ))}
                    <Link to="/register" className="btn-primary" onClick={close} style={{ justifyContent: 'center', marginTop: '.25rem' }}>
                        Register Now →
                    </Link>
                </div>
            </div>
        </>
    )
}
