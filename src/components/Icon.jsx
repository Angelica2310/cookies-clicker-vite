import "../styles/Icon.css";

export default function Icon({ src, alt }) {
  return (
    <div className="icon-container">
      <img src={src} alt={alt} width="30px" />
    </div>
  );
}
