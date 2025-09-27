
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SimpleNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-[oklch(from_var(--background)_l_c_h_/_80%)] backdrop-blur-sm shadow-xl text-sm py-4">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">         
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-2xl text-[var(--foreground)] hover:text-[var(--primary)] transition focus:outline-none"
          aria-label="SoSweet"
        >
          <span className="text-3xl font-extrabold text-[var(--primary)]">S</span> 
          <span className="tracking-wider">SoSweet</span>
        </Link>
        <div className="flex flex-row items-center gap-8">
          <Link 
            to="/" 
            className="font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
          >
            Sweets
          </Link>
          {user ? (
            <>
              <span className="font-semibold text-[var(--foreground)] hidden sm:inline">{user}</span>
              <button
                onClick={logout}
                className="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)] transition shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)] transition shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default SimpleNavbar;
