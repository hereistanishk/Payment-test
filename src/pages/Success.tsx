import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Success() {
  const { clearCart } = useCart();

  // Clear cart upon successful checkout
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
      </motion.div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Payment Successful!</h1>
      <p className="text-gray-500 mb-8 text-lg">
        Thank you for your purchase. We'll send you an email with your order details shortly.
      </p>
      
      <Link
        to="/"
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-medium transition-colors"
      >
        Continue Shopping <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
