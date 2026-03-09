import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const TRACKS = ['Healthcare', 'Agriculture', 'Finance', 'Artificial Intelligence', 'Student Innovation']
const ROLL_REGEX = /^[0-9]{4}[a-zA-Z]{2,5}[0-9]{3}$/

// Registration is open 01–17 March 2026
const REG_OPEN = new Date('2026-03-01T00:00:00+05:30')
const REG_CLOSE = new Date('2026-03-17T23:59:59+05:30')

function isRegOpen() {
    const now = new Date()
    return now >= REG_OPEN && now <= REG_CLOSE
}

const emptyMember = () => ({ name: '', rollNo: '', email: '', phone: '', isLead: false })

export default function Register() {
    const navigate = useNavigate()
    const regOpen = isRegOpen()

    const [form, setForm] = useState({
        teamName: '', track: '', problemStatement: '',
        members: [{ ...emptyMember(), isLead: true }],
    })
    const [rollStatus, setRollStatus] = useState({}) // { idx: 'checking'|'taken'|'free'|'invalid' }
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    // ── Field handlers ─────────────────────────────────────────────────────
    const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

    const setMemberField = (idx, key, val) => {
        setForm(f => {
            const members = [...f.members]
            members[idx] = { ...members[idx], [key]: key === 'rollNo' ? val.toUpperCase() : val }
            return { ...f, members }
        })
    }

    const addMember = () => {
        if (form.members.length >= 4) return
        setForm(f => ({ ...f, members: [...f.members, emptyMember()] }))
    }

    const removeMember = idx => {
        setForm(f => ({ ...f, members: f.members.filter((_, i) => i !== idx) }))
        setRollStatus(s => { const n = { ...s }; delete n[idx]; return n })
    }

    // ── Roll number blur check ─────────────────────────────────────────────
    const checkRoll = useCallback(async (idx, roll) => {
        if (!roll) return
        if (!ROLL_REGEX.test(roll)) {
            setRollStatus(s => ({ ...s, [idx]: 'invalid' }))
            return
        }
        // Check within team
        const others = form.members.filter((_, i) => i !== idx).map(m => m.rollNo)
        if (others.includes(roll)) {
            setRollStatus(s => ({ ...s, [idx]: 'taken' }))
            return
        }
        setRollStatus(s => ({ ...s, [idx]: 'checking' }))
        try {
            const { data } = await axios.get(`/api/check-roll/${roll}`)
            setRollStatus(s => ({ ...s, [idx]: data.taken ? 'taken' : 'free' }))
        } catch {
            setRollStatus(s => ({ ...s, [idx]: 'free' })) // allow on error
        }
    }, [form.members])

    // ── Validation ─────────────────────────────────────────────────────────
    const validate = () => {
        const e = {}
        if (!form.teamName.trim()) e.teamName = 'Team name is required.'
        else if (form.teamName.trim().length < 3) e.teamName = 'Min 3 characters.'
        else if (form.teamName.trim().length > 50) e.teamName = 'Max 50 characters.'
        if (!form.track) e.track = 'Please select a track.'
        if (!form.problemStatement.trim()) e.ps = 'Problem statement is required.'
        else if (form.problemStatement.trim().length < 100) e.ps = `Min 100 characters (currently ${form.problemStatement.trim().length}).`
        else if (form.problemStatement.trim().length > 500) e.ps = 'Max 500 characters.'

        const lead = form.members[0]
        if (!lead.name.trim()) e.m0name = 'Team lead name is required.'
        if (!lead.rollNo) e.m0roll = 'Team lead roll number is required.'
        else if (!ROLL_REGEX.test(lead.rollNo)) e.m0roll = 'Invalid format. E.g. 0245CDS005'
        if (!lead.email.trim()) e.m0email = 'Team lead email is required.'
        if (!lead.phone.trim() || !/^\d{10}$/.test(lead.phone.trim())) e.m0phone = 'Valid 10-digit phone required.'

        for (let i = 1; i < form.members.length; i++) {
            const m = form.members[i]
            if (!m.name.trim()) e[`m${i}name`] = 'Member name is required.'
            if (!m.rollNo) e[`m${i}roll`] = 'Roll number is required.'
            else if (!ROLL_REGEX.test(m.rollNo)) e[`m${i}roll`] = 'Invalid format. E.g. 0245CDS005'
            if (rollStatus[i] === 'taken') e[`m${i}roll`] = 'This roll number is already registered.'
        }
        if (rollStatus[0] === 'taken') e.m0roll = 'This roll number is already registered.'
        return e
    }

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async e => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) {
            setErrors(errs);
            toast.error('Please fix the errors in the form.');
            return;
        }
        setErrors({})
        setSubmitError('')
        setSubmitting(true)
        try {
            const { data } = await axios.post('/api/register', {
                teamName: form.teamName.trim(),
                track: form.track,
                problemStatement: form.problemStatement.trim(),
                members: form.members.map((m, i) => ({ ...m, isLead: i === 0 })),
            })
            toast.success('Registration successful!')
            navigate('/success', { state: data })
        } catch (err) {
            const errorMsg = err?.response?.data?.error || 'Registration failed. Please try again.'
            setSubmitError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setSubmitting(false)
        }
    }

    const psLen = form.problemStatement.trim().length
    const psOk = psLen >= 100 && psLen <= 500

    if (!regOpen) {
        const now = new Date()
        const closed = now > REG_CLOSE
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
                <div style={{ textAlign: 'center', maxWidth: 480 }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{closed ? '🔒' : '⏳'}</div>
                    <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', marginBottom: '1rem' }}>
                        {closed ? 'Registration Closed' : 'Registration Not Open Yet'}
                    </h1>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
                        {closed
                            ? 'Registration for HackBattle 2026 has closed on 17th March 2026.'
                            : 'Registration opens on 13th March 2026. Come back then!'}
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main style={{ minHeight: '100vh', padding: 'clamp(5rem,10vw,6rem) clamp(1rem,4vw,2rem) 3rem' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <div className="section-label" style={{ marginBottom: '1rem' }}>Register</div>
                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', marginBottom: '.5rem' }}>
                    HackBattle 2026 — Team Registration
                </h1>
                <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '.9rem' }}>
                    Registration closes <strong style={{ color: 'var(--orange)' }}>17th March, 11:59 PM</strong>. Fill all details carefully.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* ── Team Info Card ── */}
                    <div className="card">
                        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--orange)' }}>Team Information</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            <div className="form-group">
                                <label className="form-label">Team Name *</label>
                                <input className={`form-input${errors.teamName ? ' error' : ''}`} placeholder="e.g. Team Alpha" maxLength={50}
                                    value={form.teamName} onChange={e => setField('teamName', e.target.value)} />
                                {errors.teamName && <span className="form-error">{errors.teamName}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Track *</label>
                                <select className={`form-select${errors.track ? ' error' : ''}`} value={form.track} onChange={e => setField('track', e.target.value)}>
                                    <option value="">Select a track...</option>
                                    {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {errors.track && <span className="form-error">{errors.track}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Problem Statement * ({psLen}/500)</label>
                                <textarea className={`form-textarea${errors.ps ? ' error' : psOk ? ' success' : ''}`}
                                    placeholder="Describe the problem you're solving and your approach... (min 100 characters)"
                                    value={form.problemStatement} onChange={e => setField('problemStatement', e.target.value)}
                                    style={{ minHeight: 130 }} rows={5} />
                                {errors.ps && <span className="form-error">{errors.ps}</span>}
                                {!errors.ps && psLen > 0 && (
                                    <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: psOk ? 'var(--green)' : 'var(--muted)' }}>
                                        {psOk ? '✓ Good length' : psLen < 100 ? `${100 - psLen} more characters needed` : 'Too long'}
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ── Members ── */}
                    <div className="card">
                        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--orange)' }}>
                            Team Members ({form.members.length}/4)
                        </h2>

                        {form.members.map((m, idx) => (
                            <div key={idx} style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,.025)', borderRadius: 10, border: '1px solid var(--border)', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.72rem', letterSpacing: '.1em', color: idx === 0 ? 'var(--orange)' : 'var(--muted)', textTransform: 'uppercase' }}>
                                        {idx === 0 ? '👑 Team Lead' : `Member ${idx + 1}`}
                                    </span>
                                    {idx > 0 && (
                                        <button type="button" onClick={() => removeMember(idx)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.1rem', cursor: 'pointer', padding: '2px 6px' }}>✕</button>
                                    )}
                                </div>

                                <div className="member-grid">
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Full Name *</label>
                                        <input className={`form-input${errors[`m${idx}name`] ? ' error' : ''}`} placeholder="Full Name"
                                            value={m.name} onChange={e => setMemberField(idx, 'name', e.target.value)} />
                                        {errors[`m${idx}name`] && <span className="form-error">{errors[`m${idx}name`]}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Roll Number *</label>
                                        <div style={{ position: 'relative' }}>
                                            <input className={`form-input${errors[`m${idx}roll`] || rollStatus[idx] === 'taken' || rollStatus[idx] === 'invalid' ? ' error' : rollStatus[idx] === 'free' ? ' success' : ''}`}
                                                placeholder="e.g. 0245CDS005" maxLength={12}
                                                value={m.rollNo}
                                                onChange={e => { setMemberField(idx, 'rollNo', e.target.value); setRollStatus(s => { const n = { ...s }; delete n[idx]; return n }) }}
                                                onBlur={e => checkRoll(idx, e.target.value.toUpperCase())}
                                                style={{ paddingRight: 36 }}
                                            />
                                            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                                                {rollStatus[idx] === 'checking' && <span className="spinner" />}
                                                {rollStatus[idx] === 'free' && <span style={{ color: 'var(--green)' }}>✓</span>}
                                                {rollStatus[idx] === 'taken' && <span style={{ color: 'var(--red)' }}>✕</span>}
                                                {rollStatus[idx] === 'invalid' && <span style={{ color: 'var(--red)', fontSize: '.75rem' }}>!</span>}
                                            </span>
                                        </div>
                                        {rollStatus[idx] === 'taken' && <span className="form-error">Roll number already registered in another team</span>}
                                        {rollStatus[idx] === 'free' && !errors[`m${idx}roll`] && <span className="form-success">✓ Roll number available</span>}
                                        {rollStatus[idx] === 'invalid' && <span className="form-error">Invalid format. Use: 0245CDS005</span>}
                                        {errors[`m${idx}roll`] && !rollStatus[idx] && <span className="form-error">{errors[`m${idx}roll`]}</span>}
                                    </div>

                                    {idx === 0 && (
                                        <>
                                            <div className="form-group">
                                                <label className="form-label">Email *</label>
                                                <input className={`form-input${errors.m0email ? ' error' : ''}`} type="email" placeholder="lead@email.com"
                                                    value={m.email} onChange={e => setMemberField(idx, 'email', e.target.value)} />
                                                {errors.m0email && <span className="form-error">{errors.m0email}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Phone *</label>
                                                <input className={`form-input${errors.m0phone ? ' error' : ''}`} type="tel" placeholder="10-digit number"
                                                    value={m.phone} onChange={e => setMemberField(idx, 'phone', e.target.value)} />
                                                {errors.m0phone && <span className="form-error">{errors.m0phone}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        {form.members.length < 4 && (
                            <button type="button" onClick={addMember} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px dashed var(--border)', borderRadius: 8, color: '#fff', fontFamily: 'DM Mono,monospace', fontSize: '.78rem', letterSpacing: '.1em', cursor: 'pointer', transition: 'border-color .2s, color .2s' }}
                                onMouseEnter={e => { e.target.style.borderColor = 'var(--orange)'; e.target.style.color = 'var(--orange)' }}
                                onMouseLeave={e => { e.target.style.borderColor = ''; e.target.style.color = '#fff' }}>
                                + ADD MEMBER ({form.members.length}/4)
                            </button>
                        )}
                    </div>

                    {/* ── Submit ── */}
                    {submitError && (
                        <div style={{ padding: '1rem', background: 'rgba(255,71,87,.1)', border: '1px solid rgba(255,71,87,.3)', borderRadius: 8, color: 'var(--red)', fontSize: '.88rem' }}>
                            {submitError}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }}>
                        {submitting ? <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Registering...</> : 'Submit Registration →'}
                    </button>

                </form>
            </div>
        </main>
    )
}
