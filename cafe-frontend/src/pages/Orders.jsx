import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import Loader from "../components/Loader";

const statusLabels = {
  NEW: "Нове",
  CONFIRMED: "Підтверджено",
  PREPARING: "Готується",
  READY: "Готово",
  COMPLETED: "Виконано",
  CANCELLED: "Скасовано"
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/orders/my")
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="section-heading">
          <span className="eyebrow dark">ORDER HISTORY</span>
          <h1>Мої замовлення</h1>
        </div>
        {loading && <Loader />}
        {error && <div className="error-box">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="empty-state"><div className="empty-icon">☕</div><h3>Замовлень ще немає</h3><p>Обери щось смачне в меню.</p></div>
        )}
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-head">
                <div><span className="category-label">ЗАМОВЛЕННЯ №{order.id}</span><h3>{new Date(order.createdAt).toLocaleString("uk-UA")}</h3></div>
                <span className={`status status-${order.status.toLowerCase()}`}>{statusLabels[order.status] || order.status}</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id}><span>{item.product?.name || "Товар"} × {item.quantity}</span><strong>{(Number(item.price) * item.quantity).toFixed(0)} ₴</strong></div>
                ))}
              </div>
              <div className="order-total"><span>Разом</span><strong>{Number(order.total).toFixed(0)} ₴</strong></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
