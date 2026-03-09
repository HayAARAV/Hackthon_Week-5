import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ registrationId: '', email: '' })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const regId = form.registrationId.trim()
        const email = form.email.trim()

        if (!regId || !email) {
            toast.error('Both Registration ID and Email are required')
            return
        }

        setSubmitting(true)
        try {
            const { data } = await axios.post('/api/login', {
                registrationId: regId,
                email: email
            })

            if (data.success && data.team) {
                toast.success('Login successful!')
                sessionStorage.setItem('teamAuth', JSON.stringify({
                    registrationId: regId,
                    email: email
                }))
                // Navigate without pushing raw state, rely on the dashboard to verify the session
                navigate('/dashboard')
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to login. Please check credentials.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main style={{ minHeight: '100vh', padding: 'clamp(5rem,10vw,8rem) clamp(1rem,4vw,2rem) 3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: 460, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Team portal</div>
                    <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', marginBottom: '.5rem' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
                        Enter your Registration ID and Team Lead's email to view your dashboard.
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div className="form-group">
                            <label className="form-label">Registration ID</label>
                            <input
                                className="form-input"
                                placeholder="e.g. HB2026-0001"
                                value={form.registrationId}
                                onChange={e => setForm({ ...form, registrationId: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Team Lead Email</label>
                            <input
                                className="form-input"
                                type="email"
                                placeholder="lead@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '14px' }}>
                            {submitting ? <span className="spinner" style={{ borderTopColor: '#fff', width: 16, height: 16 }} /> : 'Login →'}
                        </button>

                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.85rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Haven't registered yet? </span>
                    <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>Register Now</Link>
                </div>
            </div>
        </main>
    )
}
