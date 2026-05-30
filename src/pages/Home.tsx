import React from 'react';
import { products } from '../data';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  const { addToCart } = useCart();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Featured Products</h1>
        <p className="text-gray-500 mt-2">Discover our carefully curated selection of premium items.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-slate-800 rounded-full lowercase tracking-wide">
                {product.category}
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="font-semibold text-gray-900 leading-tight">
                  {product.name}
                </h3>
                <span className="font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                {product.description}
              </p>
              
              <div className="mt-auto">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
