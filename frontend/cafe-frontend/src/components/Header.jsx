import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">A</span>
          <span>
            <strong>Café Aura</strong>
            <small>coffee & desserts</small>
          </span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/" end>Головна</NavLink>
          <NavLink to="/menu">Меню</NavLink>
          {user && <NavLink to="/orders">Мої замовлення</NavLink>}
          {user?.role === "ADMIN" && <NavLink to="/admin">Адмін</NavLink>}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-chip">
                <span className="avatar">{user.name?.[0]?.toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
              </Link>
              <button className="icon-button" onClick={handleLogout} title="Вийти">↪</button>
            </div>
          ) : (
            <Link className="login-link" to="/login">Увійти</Link>
          )}

          <Link className="cart-button" to="/cart" aria-label="Кошик">
            <span>Кошик</span>
            {count > 0 && <b>{count}</b>}
          </Link>
        </div>
      </div>
    </header>
  );
}
