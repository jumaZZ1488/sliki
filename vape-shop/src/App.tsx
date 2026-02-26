import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  favorite: boolean;
};

type CartItem = Product & { qty: number };

export default function App() {
  const [screen, setScreen] = useState<
    "shop" | "cart" | "admin" | "favorites" | "settings"
  >("shop");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [deliveryType, setDeliveryType] = useState("");

  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [products, setProducts] = useState<Product[]>(
    JSON.parse(localStorage.getItem("products") || "null") || [
      {
        id: 1,
        name: "Elf Bar Watermelon",
        price: 45,
        image:
          "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?q=80&w=900",
        description: "Освежающий арбуз",
        stock: 10,
        favorite: false,
      },
    ]
  );

  const [cart, setCart] = useState<CartItem[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert("Нет в наличии");

    const exist = cart.find((i) => i.id === product.id);

    if (exist) {
      setCart(
        cart.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const changeQty = (id: number, delta: number) => {
    setCart(
      cart
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const toggleFavorite = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      )
    );
  };

  const updateProduct = (id: number, field: string, value: any) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]:
                field === "price" || field === "stock"
                  ? Number(value)
                  : value,
            }
          : p
      )
    );
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        name: "",
        price: 0,
        image: "",
        description: "",
        stock: 0,
        favorite: false,
      },
    ]);
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // ✅ ДОБАВЛЕНО — ОФОРМИТЬ ЗАКАЗ
  const handleCheckout = () => {
    if (!deliveryType) {
      alert("Выберите способ доставки");
      return;
    }

    alert("Заказ оформлен ✅");
    setCart([]);
    setDeliveryType("");
  };

  const handleAdminLogin = () => {
    if (adminLogin === "admin11" && adminPassword === "1234") {
      setIsAdminAuth(true);
    } else {
      alert("Неверный логин или пароль");
    }
  };

  const bg = theme === "dark" ? "#0f172a" : "#f1f5f9";
  const card = theme === "dark" ? "#1e293b" : "#ffffff";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        color: theme === "dark" ? "white" : "black",
        padding: 20,
        paddingBottom: 120,
      }}
    >
      {/* SHOP */}
      {screen === "shop" &&
        products.map((p) => (
          <div
            key={p.id}
            style={{
              background: card,
              padding: 20,
              borderRadius: 20,
              marginBottom: 20,
            }}
          >
            <img
              src={p.image}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 15,
              }}
            />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>{p.price} zł</p>
            <p>В наличии: {p.stock}</p>

            <button onClick={() => addToCart(p)}>🛒</button>
            <button onClick={() => toggleFavorite(p.id)}>
              {p.favorite ? "❤️" : "🤍"}
            </button>
          </div>
        ))}

      {/* FAVORITES */}
      {screen === "favorites" && (
        <div>
          {products.filter((p) => p.favorite).length === 0 && (
            <p>Нет избранных товаров</p>
          )}
          {products
            .filter((p) => p.favorite)
            .map((p) => (
              <div
                key={p.id}
                style={{
                  background: card,
                  padding: 20,
                  borderRadius: 20,
                  marginBottom: 20,
                }}
              >
                <img
                  src={p.image}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 15,
                  }}
                />
                <h3>{p.name}</h3>
                <p>{p.price} zł</p>
                <button onClick={() => addToCart(p)}>🛒</button>
              </div>
            ))}
        </div>
      )}

      {/* CART */}
      {screen === "cart" && (
        <div>
          {cart.length === 0 && <p>Корзина пуста</p>}
          {cart.map((item) => (
            <div key={item.id} style={{ background: card, padding: 20, borderRadius: 20, marginBottom: 20 }}>
              <img src={item.image} style={{ width: 100 }} />
              <h3>{item.name}</h3>
              <p>{item.price} zł × {item.qty}</p>
              <button onClick={() => changeQty(item.id, 1)}>+</button>
              <button onClick={() => changeQty(item.id, -1)}>-</button>
            </div>
          ))}
          {cart.length > 0 && (
            <>
              <h2>Итого: {total} zł</h2>
              <h3>Выберите способ доставки:</h3>

              <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                <option value="">Выбрать</option>
                <option value="inpost">InPost</option>
                <option value="courier">Курьер</option>
                <option value="pickup">Самовывоз</option>
              </select>

              <br /><br />

              {/* ✅ КНОПКА */}
              <button
                onClick={handleCheckout}
                style={{
                  background: "green",
                  color: "white",
                  padding: 12,
                  borderRadius: 15,
                  fontSize: 16,
                }}
              >
                ✅ Оформить заказ
              </button>
            </>
          )}
        </div>
      )}

      {/* SETTINGS */}
      {screen === "settings" && (
        <div>
          <h2>Настройки</h2>
          <button onClick={() => setTheme("light")}>Светлая тема</button>
          <button onClick={() => setTheme("dark")}>Тёмная тема</button>
        </div>
      )}

      {/* ADMIN */}
      {screen === "admin" && (
        <div>
          {!isAdminAuth ? (
            <div style={{ background: card, padding: 20, borderRadius: 20 }}>
              <h2>Вход в админ панель</h2>
              <input
                placeholder="Логин"
                value={adminLogin}
                onChange={(e) => setAdminLogin(e.target.value)}
              />
              <br /><br />
              <input
                type="password"
                placeholder="Пароль"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <br /><br />
              <button onClick={handleAdminLogin}>Войти</button>
            </div>
          ) : (
            <>
              <h2>Админ панель</h2>
              <button onClick={addProduct}>➕ Добавить новый товар</button>

              {products.map((p) => (
                <div key={p.id} style={{ background: card, padding: 20, borderRadius: 20, marginTop: 20 }}>
                  <p>Название товара:</p>
                  <input value={p.name} onChange={(e) => updateProduct(p.id, "name", e.target.value)} />

                  <p>Ссылка на фото:</p>
                  <input value={p.image} onChange={(e) => updateProduct(p.id, "image", e.target.value)} />

                  <p>Цена:</p>
                  <input value={p.price} onChange={(e) => updateProduct(p.id, "price", e.target.value)} />

                  <p>Наличие:</p>
                  <input value={p.stock} onChange={(e) => updateProduct(p.id, "stock", e.target.value)} />

                  <p>Описание:</p>
                  <textarea value={p.description} onChange={(e) => updateProduct(p.id, "description", e.target.value)} />

                  <br />
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{ marginTop: 10, background: "red", color: "white", padding: 8, borderRadius: 10 }}
                  >
                    🗑 Удалить товар
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* NAV */}
      <div style={{ position: "fixed", bottom: 20, left: 20, right: 20, display: "flex", justifyContent: "space-around", background: "rgba(255,255,255,0.1)", padding: 15, borderRadius: 30 }}>
        <button onClick={() => setScreen("shop")}>🏠</button>
        <button onClick={() => setScreen("favorites")}>❤️</button>
        <button onClick={() => setScreen("cart")}>🛒 {cart.length}</button>
        <button onClick={() => setScreen("settings")}>⚙️</button>
        <button onClick={() => setScreen("admin")}>👑</button>
      </div>
    </div>
  );
}