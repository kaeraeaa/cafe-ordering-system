import { useState } from "react";
import { useCart } from "../context/CartContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const image = product.imageUrl || fallbackImage;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={image} alt={product.name} className="product-image" />
        {!product.isAvailable && <span className="sold-badge">Немає</span>}
      </div>
      <div className="product-info">
        <div className="product-topline">
          <span className="category-label">{product.category?.name || "Кава"}</span>
          <span className="price">{Number(product.price).toFixed(0)} ₴</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description || "Смачний напій від Café Aura."}</p>
        <button
          className="add-button"
          disabled={!product.isAvailable}
          onClick={handleAdd}
        >
          {added ? "Додано ✓" : product.isAvailable ? "Додати до кошика" : "Недоступно"}
        </button>
      </div>
    </article>
  );
}
