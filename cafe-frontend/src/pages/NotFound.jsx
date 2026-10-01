import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty-state large">
        <div className="empty-icon">404</div>
        <h1>Сторінку не знайдено</h1>
        <p>Схоже, такої сторінки в Café Aura немає.</p>
        <Link to="/" className="primary-button">На головну</Link>
      </div>
    </section>
  );
}
