import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const Dashboard = () => {
    const [message, setMessage] = useState<string>('Loading...');

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/api/protected', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(err => setMessage('Error: ' + err.message));
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <p>{message}</p>
        </div>
    );
};

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

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
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
