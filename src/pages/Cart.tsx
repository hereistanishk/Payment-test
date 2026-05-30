import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setError(null);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during checkout.');
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <Trash2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200"
            >
              <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                <div className="font-medium text-gray-900">${item.price.toFixed(2)}</div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-white rounded text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-white rounded text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="sm:ml-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 mt-3 font-semibold text-gray-900 text-base">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white p-3.5 rounded-xl font-medium transition-colors"
            >
              {isCheckingOut ? (
                'Processing...'
              ) : (
                <>
                  Checkout <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Secure payment processed by Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
