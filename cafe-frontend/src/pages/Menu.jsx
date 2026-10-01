import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (categoryId) query.set("categoryId", categoryId);
      if (search.trim()) query.set("search", search.trim());
      const data = await apiFetch(`/products?${query.toString()}`);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiFetch("/products/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 250);
    return () => clearTimeout(timer);
  }, [categoryId, search]);

  const title = useMemo(
    () => categoryId ? categories.find((c) => String(c.id) === String(categoryId))?.name || "Меню" : "Меню",
    [categoryId, categories]
  );

  return (
    <section className="section menu-page">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow dark">CAFE AURA MENU</span>
          <h1>{title}</h1>
          <p>Обери щось смачне та додай до кошика.</p>
        </div>

        <div className="menu-toolbar">
          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук у меню..."
            />
          </div>
          <div className="category-tabs">
            <button className={!categoryId ? "active" : ""} onClick={() => setCategoryId("")}>Усе</button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={String(category.id) === String(categoryId) ? "active" : ""}
                onClick={() => setCategoryId(String(category.id))}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading && <Loader />}
        {error && <div className="error-box">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">☕</div>
            <h3>Нічого не знайдено</h3>
            <p>Спробуй інший запит або категорію.</p>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </section>
  );
}
