import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const Dashboard = () => (
    <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p>Welcome back.</p>
    </div>
);

const LoginPage = () => {
    const { login, error, loading, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        try {
            await login(email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to log in';
            setFormError(message);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="login-container">
            <h1 className="login-title">Sign In</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <label className="login-label">
                    Email
                    <input
                        className="login-input"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        required
                    />
                </label>
                <label className="login-label">
                    Password
                    <input
                        className="login-input"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </label>
                {(formError || error) && <p className="login-error">{formError ?? error}</p>}
                <button className="login-button" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/sign-up/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Signup failed');
            }
            // Redirect to login
            window.location.href = '/login';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input value={name} onChange={e => setName(e.target.value)} required />
                </label>
                <label>
                    Email
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>
                <label>
                    Confirm Password
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                </label>
                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Signing up…' : 'Sign Up'}</button>
            </form>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
