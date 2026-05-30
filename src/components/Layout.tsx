import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Layout() {
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 transition-opacity hover:opacity-80">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">QuickCart</span>
          </Link>

          <nav>
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-slate-900 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} QuickCart. Built for demonstration.</p>
        </div>
      </footer>
    </div>
  );
}
