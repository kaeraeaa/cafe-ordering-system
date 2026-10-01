import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import { useState } from "react";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    if (!user) {
      navigate("/login?redirect=/cart");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity }))
        })
      });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <section className="section">
        <div className="container empty-state large">
          <div className="empty-icon">🛍</div>
          <h1>Кошик порожній</h1>
          <p>Додай улюблену каву або десерт, щоб оформити замовлення.</p>
          <Link to="/menu" className="primary-button">Перейти до меню</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-heading">
          <span className="eyebrow dark">YOUR ORDER</span>
          <h1>Кошик</h1>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80"} alt={item.name} />
                <div className="cart-item-main">
                  <span className="category-label">{item.category?.name || "Café Aura"}</span>
                  <h3>{item.name}</h3>
                  <p>{Number(item.price).toFixed(0)} ₴</p>
                </div>
                <div className="quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <strong className="line-total">{(Number(item.price) * item.quantity).toFixed(0)} ₴</strong>
                <button className="remove-button" onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            ))}
          </div>

          <aside className="summary-card">
            <h3>Підсумок</h3>
            <div className="summary-line"><span>Товари</span><strong>{total.toFixed(0)} ₴</strong></div>
            <div className="summary-line"><span>Самовивіз</span><strong>Безкоштовно</strong></div>
            <div className="summary-total"><span>Разом</span><strong>{total.toFixed(0)} ₴</strong></div>
            {error && <div className="mini-error">{error}</div>}
            <button className="primary-button full" onClick={checkout} disabled={submitting}>
              {submitting ? "Оформлення..." : user ? "Оформити замовлення" : "Увійти та замовити"}
            </button>
            <button className="text-button" onClick={clearCart}>Очистити кошик</button>
          </aside>
        </div>
      </div>
    </section>
  );
}
