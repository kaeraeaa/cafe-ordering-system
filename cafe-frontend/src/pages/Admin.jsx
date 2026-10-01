import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import Loader from "../components/Loader";

const statuses = ["NEW", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
const statusLabels = { NEW:"Нове", CONFIRMED:"Підтверджено", PREPARING:"Готується", READY:"Готово", COMPLETED:"Виконано", CANCELLED:"Скасовано" };

const blank = { name: "", description: "", price: "", imageUrl: "", categoryId: "", isAvailable: true };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [p, c, o] = await Promise.all([
        apiFetch("/products"),
        apiFetch("/products/categories"),
        apiFetch("/orders")
      ]);
      setProducts(p); setCategories(c); setOrders(o);
      if (!form.categoryId && c[0]) setForm((f) => ({ ...f, categoryId: String(c[0].id) }));
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl || "",
      isAvailable: Boolean(form.isAvailable)
    };
    try {
      if (editing) {
        await apiFetch(`/products/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Товар оновлено.");
      } else {
        await apiFetch("/products", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Товар додано.");
      }
      setForm({ ...blank, categoryId: form.categoryId });
      setEditing(null);
      await load();
    } catch (err) { setError(err.message); }
  };

  const editProduct = (p) => {
    setEditing(p.id);
    setForm({ name:p.name, description:p.description || "", price:p.price, imageUrl:p.imageUrl || "", categoryId:String(p.categoryId), isAvailable:p.isAvailable });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Видалити або приховати цей товар?")) return;
    try { await apiFetch(`/products/${id}`, { method: "DELETE" }); await load(); setMessage("Зміни збережено."); }
    catch (err) { setError(err.message); }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch (err) { setError(err.message); }
  };

  return (
    <section className="section admin-page">
      <div className="container">
        <div className="admin-header">
          <div><span className="eyebrow dark">CAFÉ AURA ADMIN</span><h1>Адмін-панель</h1><p>Керування меню та замовленнями.</p></div>
          <div className="admin-tabs"><button className={tab==="products"?"active":""} onClick={()=>setTab("products")}>Меню</button><button className={tab==="orders"?"active":""} onClick={()=>setTab("orders")}>Замовлення</button></div>
        </div>

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}
        {loading ? <Loader /> : tab === "products" ? (
          <div className="admin-grid">
            <form className="admin-form card-panel" onSubmit={saveProduct}>
              <div className="panel-heading"><h2>{editing ? "Редагувати товар" : "Новий товар"}</h2>{editing && <button type="button" className="text-button" onClick={()=>{setEditing(null);setForm({...blank,categoryId:categories[0]?.id||""})}}>Скасувати</button>}</div>
              <label>Назва<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></label>
              <label>Опис<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows="3" /></label>
              <div className="form-row"><label>Ціна, ₴<input type="number" min="1" step="1" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></label><label>Категорія<select value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} required>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
              <label>Посилання на фото<input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://..." /></label>
              <label className="check-label"><input type="checkbox" checked={form.isAvailable} onChange={e=>setForm({...form,isAvailable:e.target.checked})} /> Доступний для замовлення</label>
              <button className="primary-button full">{editing ? "Зберегти зміни" : "Додати товар"}</button>
            </form>

            <div className="card-panel">
              <div className="panel-heading"><h2>Товари ({products.length})</h2></div>
              <div className="admin-products">
                {products.map(p=><div className="admin-product" key={p.id}><img src={p.imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80"} alt="" /><div><strong>{p.name}</strong><span>{Number(p.price).toFixed(0)} ₴ · {p.category?.name}</span></div><span className={p.isAvailable ? "dot available" : "dot"}></span><button onClick={()=>editProduct(p)}>Змінити</button><button className="danger-text" onClick={()=>deleteProduct(p.id)}>Видалити</button></div>)}
              </div>
            </div>
          </div>
        ) : (
          <div className="card-panel">
            <div className="panel-heading"><h2>Замовлення ({orders.length})</h2></div>
            <div className="admin-orders">
              {orders.map(order=><div className="admin-order" key={order.id}><div><span className="category-label">№{order.id} · {order.user?.name}</span><h3>{new Date(order.createdAt).toLocaleString("uk-UA")}</h3><p>{order.items.map(i=>`${i.product?.name} × ${i.quantity}`).join(", ")}</p></div><strong>{Number(order.total).toFixed(0)} ₴</strong><select value={order.status} onChange={e=>updateStatus(order.id,e.target.value)}>{statuses.map(s=><option key={s} value={s}>{statusLabels[s]}</option>)}</select></div>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
