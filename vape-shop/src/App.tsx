import { useState } from 'react';
import { motion } from 'framer-motion';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

type CartItem = Product & { quantity: number };

export default function App() {
  const [screen, setScreen] = useState('catalog');
  const [category, setCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('');
  const [delivery, setDelivery] = useState('courier');
  const [locker, setLocker] = useState('');

  const products: Product[] = [
    {
      id: 1,
      name: 'Vape Premium',
      price: 59,
      category: 'liquid',
      image: 'https://picsum.photos/400?1',
    },
    {
      id: 2,
      name: 'Vape Strong',
      price: 69,
      category: 'liquid',
      image: 'https://picsum.photos/400?2',
    },
    {
      id: 3,
      name: 'Elf Bar 5000',
      price: 45,
      category: 'disposable',
      image: 'https://picsum.photos/400?3',
    },
  ];

  const addToCart = (product: Product) => {
    const exist = cart.find((i) => i.id === product.id);
    if (exist) {
      setCart(
        cart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const changeQty = (id: number, delta: number) => {
    setCart(
      cart
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const sendOrder = async () => {
    if (!address) return alert('Введите адрес');

    const order = { cart, total, address, delivery, locker };

    await fetch('http://localhost:5000/create_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    alert('Заказ оформлен!');
    setCart([]);
    setScreen('catalog');
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">🔥 Vape Shop</h1>
        <button
          onClick={() => setScreen('cart')}
          className="bg-green-600 px-4 py-2 rounded-xl"
        >
          🛒 {cart.length}
        </button>
      </div>

      {/* CATALOG */}
      {screen === 'catalog' && (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.05 }}
              className="bg-zinc-800 p-4 rounded-2xl"
            >
              <img
                src={p.image}
                className="rounded-xl h-60 w-full object-cover"
              />
              <h3 className="mt-4">{p.name}</h3>
              <p className="text-green-400 font-bold">{p.price} zł</p>
              <button
                onClick={() => addToCart(p)}
                className="mt-3 bg-green-600 w-full py-2 rounded-xl"
              >
                В корзину
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* CART */}
      {screen === 'cart' && (
        <div>
          <button onClick={() => setScreen('catalog')} className="mb-6">
            ← Назад
          </button>

          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 p-4 rounded-xl mb-4 flex justify-between"
            >
              <div>
                <h3>{item.name}</h3>
                <p>{item.price} zł</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => changeQty(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQty(item.id, 1)}>+</button>
              </div>
            </div>
          ))}

          <h2 className="text-xl mt-6">Итого: {total} zł</h2>

          {cart.length > 0 && (
            <button
              onClick={() => setScreen('checkout')}
              className="mt-6 bg-green-600 px-6 py-3 rounded-xl"
            >
              Оформить заказ
            </button>
          )}
        </div>
      )}

      {/* CHECKOUT */}
      {screen === 'checkout' && (
        <div>
          <button onClick={() => setScreen('cart')} className="mb-6">
            ← Назад
          </button>

          <input
            placeholder="Адрес доставки"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
          />

          <select
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
          >
            <option value="courier">Курьер</option>
            <option value="pickup">Самовывоз</option>
            <option value="inpost">InPost</option>
          </select>

          {delivery === 'inpost' && (
            <input
              placeholder="Код пачкомата"
              value={locker}
              onChange={(e) => setLocker(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
            />
          )}

          <h3 className="mb-4">Сумма: {total} zł</h3>

          <button
            onClick={sendOrder}
            className="bg-green-600 w-full py-3 rounded-xl"
          >
            Подтвердить заказ
          </button>
        </div>
      )}
    </div>
  );
}
