import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="section">
      <div className="container profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <span className="eyebrow dark">PERSONAL ACCOUNT</span>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className="role-badge">{user?.role === "ADMIN" ? "Адміністратор" : "Клієнт"}</span>
        </div>
        <div className="profile-content">
          <span className="eyebrow dark">МІЙ КАБІНЕТ</span>
          <h2>Все під рукою</h2>
          <div className="profile-links">
            <Link to="/orders" className="profile-link"><span>01</span><div><strong>Історія замовлень</strong><p>Переглянути свої замовлення та їхні статуси.</p></div>→</Link>
            <Link to="/menu" className="profile-link"><span>02</span><div><strong>Зробити нове замовлення</strong><p>Повернутися до меню Café Aura.</p></div>→</Link>
            {user?.role === "ADMIN" && <Link to="/admin" className="profile-link"><span>03</span><div><strong>Адмін-панель</strong><p>Керувати меню та замовленнями.</p></div>→</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
