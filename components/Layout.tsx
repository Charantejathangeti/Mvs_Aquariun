
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Fish, ShoppingBag, ShieldCheck, LogOut, Lock } from 'lucide-react';
import { AuthService } from '../services/authService';

export const Layout: React.FC<{ children: React.ReactNode; cartCount: number; isAdmin: boolean; onLogout: () => void }> = ({ children, cartCount, isAdmin, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-deepSea text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Fish className="text-coralPop" size={32} />
            <span>Mvs_Aqua</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className={`hover:text-coralPop transition-colors ${location.pathname === '/' ? 'text-coralPop' : ''}`}>Shop</Link>
            
            {isAdmin && (
              <Link to="/admin/products/fish" className={`flex items-center gap-1 hover:text-coralPop transition-colors ${location.pathname.includes('/admin') ? 'text-coralPop' : ''}`}>
                <ShieldCheck size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            )}

            <Link to="/cart" className="relative group">
              <ShoppingBag size={28} className="text-white group-hover:text-coralPop transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-coralPop text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm bg-blue-900/50 hover:bg-blue-900 px-3 py-1 rounded transition-colors border border-blue-700">
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-sm border-t-4 border-coralPop">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Fish size={20} /> Mvs_Aqua
            </h4>
            <p className="mb-2">Your premium destination for exotic fish and high-quality aquarium supplies.</p>
            <p className="text-coralPop font-semibold">Dispatch Every MONDAY.</p>
          </div>
          <div className="text-right md:text-right">
            <h4 className="text-white font-bold text-lg mb-4">Contact Us</h4>
            <p>15 Line, Upadhyaya Nagar</p>
            <p>Tirupati, Andhra Pradesh 517507</p>
            <p className="mt-2 text-white font-bold">Call: +91 94902 55775</p>
            <p>WhatsApp: +91 6302382280</p>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-4 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Mvs_Aqua. All rights reserved.</p>
          
          {!isAdmin ? (
            <Link to="/login" className="flex items-center gap-1 hover:text-gray-300 mt-2 md:mt-0 transition-colors opacity-50 hover:opacity-100">
              <Lock size={12} /> Admin Login
            </Link>
          ) : (
            <span className="text-green-500 mt-2 md:mt-0">● Admin Session Active</span>
          )}
        </div>
      </footer>
    </div>
  );
};
