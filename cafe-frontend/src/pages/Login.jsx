import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      const redirect = new URLSearchParams(location.search).get("redirect");
      navigate(redirect || "/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="З поверненням" subtitle="Увійди, щоб керувати замовленнями.">
      <form className="auth-form" onSubmit={submit}>
        {error && <div className="error-box">{error}</div>}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@example.com" required /></label>
        <label>Пароль<input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="••••••••" required /></label>
        <button className="primary-button full" disabled={loading}>{loading ? "Вхід..." : "Увійти"}</button>
        <p className="auth-switch">Ще немає акаунта? <Link to="/register">Зареєструватися</Link></p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">A</div>
        <span className="eyebrow dark">CAFÉ AURA</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
