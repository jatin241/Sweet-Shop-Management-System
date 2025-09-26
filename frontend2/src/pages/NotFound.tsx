import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-candy">
      <div className="text-center glass-morphism p-8 rounded-2xl border border-white/20 shadow-candy max-w-md">
        <div className="text-6xl mb-4">🍭</div>
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! This sweet page doesn't exist
        </p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center justify-center rounded-lg bg-gradient-candy px-6 py-3 text-white font-semibold hover:bg-gradient-sunset transition-all bounce-transition"
        >
          Return to Sweet Shop
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
