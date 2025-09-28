// Skip link component for accessibility
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      aria-label="Saltar al contenido principal"
    >
      Saltar al contenido principal
    </a>
  );
}