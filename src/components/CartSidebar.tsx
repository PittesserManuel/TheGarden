'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [showCheckout, setShowCheckout] = useState(false);

  const handleOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setShowCheckout(false);
      setIsCartOpen(false);
    }, 3000);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-garden-800 text-white">
          <h2 className="text-xl font-serif font-bold">Ihr Warenkorb</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-white/80 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        {orderPlaced ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-serif font-bold text-garden-800 mb-2">Bestellung aufgegeben!</h3>
              <p className="text-gray-600">Vielen Dank! Ihre Bestellung wird vorbereitet.</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Ihr Warenkorb ist leer</p>
              <p className="text-gray-400 mt-2">Fügen Sie Gerichte aus unserer Speisekarte hinzu</p>
            </div>
          </div>
        ) : !showCheckout ? (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-garden-700 font-semibold text-sm">&euro; {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      className="w-7 h-7 rounded-full bg-garden-100 hover:bg-garden-200 text-garden-800 flex items-center justify-center text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 text-lg"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Gesamt:</span>
                <span className="font-bold text-garden-800 text-xl">&euro; {totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-garden-600 hover:bg-garden-700 text-white py-3 rounded-xl font-semibold text-lg transition-all hover:shadow-lg"
              >
                Zur Kasse
              </button>
              <button
                onClick={clearCart}
                className="w-full text-gray-500 hover:text-red-500 py-2 text-sm transition-colors"
              >
                Warenkorb leeren
              </button>
            </div>
          </>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleOrder} className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold">Bestelldetails</h3>

            {/* Order Type */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  orderType === 'pickup' ? 'bg-garden-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Abholung
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  orderType === 'delivery' ? 'bg-garden-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Lieferung
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required type="text" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
              <input required type="tel" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
            </div>

            {orderType === 'delivery' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieferadresse *</label>
                <textarea required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" rows={2} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anmerkungen</label>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" rows={2} placeholder="Allergien, Sonderwünsche..." />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{quantity}x {item.name}</span>
                  <span className="font-medium">&euro; {(item.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              {orderType === 'delivery' && (
                <div className="flex justify-between text-sm text-gray-500 pt-1 border-t">
                  <span>Liefergebühr</span>
                  <span>&euro; 3.50</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Gesamt</span>
                <span className="text-garden-800">&euro; {(totalPrice + (orderType === 'delivery' ? 3.50 : 0)).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full bg-garden-600 hover:bg-garden-700 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
              >
                Bestellung aufgeben
              </button>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
              >
                Zurück zum Warenkorb
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
