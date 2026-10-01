import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const heroImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=85";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <img src={heroImage} alt="Кава та затишний інтер'єр Café Aura" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="eyebrow">COFFEE · DESSERTS · MOMENTS</span>
          <h1>Твоя кава.<br /><em>Твій момент.</em></h1>
          <p>Обирай улюблені напої та десерти онлайн — ми приготуємо їх до твого приходу.</p>
          <div className="hero-buttons">
            <Link to="/menu" className="primary-button">Переглянути меню</Link>
            <a href="#about" className="secondary-button">Про Café Aura</a>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="container feature-grid">
          <div><span>01</span><strong>Свіжа кава</strong><p>Готуємо кожне замовлення після його оформлення.</p></div>
          <div><span>02</span><strong>Самовивіз</strong><p>Замовляй заздалегідь і забирай без очікування.</p></div>
          <div><span>03</span><strong>Просто онлайн</strong><p>Обери, замов, прийди — усе без зайвих кроків.</p></div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow dark">OUR FAVORITES</span>
            <h2>Улюблене меню</h2>
            <p>Класичні напої та десерти, до яких хочеться повертатися.</p>
          </div>

          {loading ? <Loader /> : (
            <div className="product-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="center-action">
            <Link to="/menu" className="outline-button">Дивитися все меню →</Link>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="container quote-inner">
          <span className="eyebrow dark">A LITTLE PAUSE</span>
          <blockquote>«Іноді для хорошого дня достатньо чашки хорошої кави.»</blockquote>
          <p>— Café Aura</p>
        </div>
      </section>
    </>
  );
}
