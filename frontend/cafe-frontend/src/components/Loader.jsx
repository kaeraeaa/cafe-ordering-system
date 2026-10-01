export default function Loader({ text = "Завантаження..." }) {
  return (
    <div className="loader-box">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}
