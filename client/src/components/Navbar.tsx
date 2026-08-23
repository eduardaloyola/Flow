import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">✓</span>
        <span>TaskFlow</span>
      </div>
      {user && (
        <div className="navbar__user">
          <span>Olá, {user.name.split(" ")[0]}</span>
          <button className="btn btn--ghost" onClick={logout}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
