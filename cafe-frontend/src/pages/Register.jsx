import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">A</div>
        <span className="eyebrow dark">CAFÉ AURA</span>
        <h1>Створити акаунт</h1>
        <p>Зареєструйся, щоб оформлювати замовлення онлайн.</p>
        <form className="auth-form" onSubmit={submit}>
          {error && <div className="error-box">{error}</div>}
          <label>Ім’я<input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Ваше ім’я" minLength="2" required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@example.com" required /></label>
          <label>Пароль<input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Мінімум 6 символів" minLength="6" required /></label>
          <button className="primary-button full" disabled={loading}>{loading ? "Створення..." : "Зареєструватися"}</button>
          <p className="auth-switch">Вже маєш акаунт? <Link to="/login">Увійти</Link></p>
        </form>
      </div>
    </section>
  );
}
