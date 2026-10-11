import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const initialProducts = [
    {
        id: 1,
        name: "Studio Laptop",
        price: 999,
        category: "Electronics",
        description: "A powerful everyday laptop with a vivid display.",
        color: "blue",
        icon: "▱"
    },
    {
        id: 2,
        name: "Wireless Mouse",
        price: 29,
        category: "Accessories",
        description: "Comfortable precision, at home or on the go.",
        color: "peach",
        icon: "◉"
    },
    {
        id: 3,
        name: "Mechanical Keyboard",
        price: 79,
        category: "Accessories",
        description: "Tactile keys for a more satisfying workflow.",
        color: "lavender",
        icon: "⌨"
    }
];

function ProductCard({ product, onAddToCart }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <article
            className={`product-card${isHovered ? " is-hovered" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`product-art ${product.color}`} aria-hidden="true">
                <span>{product.icon}</span>
                <span className="art-orbit"></span>
                <span className="product-number">{String(product.id).slice(-2).padStart(2, "0")}</span>
            </div>
            <div className="product-details">
                <div className="product-topline">
                    <span className="category-label">{product.category}</span>
                    <span className="product-rating">★ <span>4.9</span></span>
                </div>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">${Number(product.price).toFixed(2)}</span>
                    <button
                        className="cart-button"
                        type="button"
                        onClick={() => onAddToCart(product.id)}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <span aria-hidden="true">＋</span> Add to cart
                    </button>
                </div>
            </div>
        </article>
    );
}

function ProductForm({ onAddProduct }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: ""
    });

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData(current => ({ ...current, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const product = {
            name: formData.name.trim(),
            price: Number(formData.price),
            category: formData.category.trim()
        };

        if (!product.name || !product.category || !Number.isFinite(product.price) || product.price < 0) {
            return;
        }

        onAddProduct(product);
        setFormData({ name: "", price: "", category: "" });
    }

    return (
        <section className="add-panel" aria-labelledby="add-product-title">
            <div className="panel-icon" aria-hidden="true">↗</div>
            <span className="overline">GROW YOUR COLLECTION</span>
            <h2 id="add-product-title">Add a product</h2>
            <p className="panel-copy">A great find? Make it part of the lineup.</p>
            <form className="product-form" onSubmit={handleSubmit}>
                <label htmlFor="product-name">Product name</label>
                <input
                    id="product-name"
                    name="name"
                    placeholder="e.g. Studio headphones"
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength="80"
                    required
                />

                <label htmlFor="product-price">Price</label>
                <div className="price-input">
                    <span>$</span>
                    <input
                        id="product-price"
                        name="price"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <label htmlFor="product-category">Category</label>
                <input
                    id="product-category"
                    name="category"
                    placeholder="e.g. Audio"
                    value={formData.category}
                    onChange={handleInputChange}
                    maxLength="40"
                    required
                />

                <button className="submit-button" type="submit">
                    Add product <span aria-hidden="true">→</span>
                </button>
            </form>
            <div className="form-note"><span aria-hidden="true">✳</span> Added instantly. No page reload.</div>
        </section>
    );
}

function ProductList() {
    const [products, setProducts] = useState(initialProducts);
    const [cartCount, setCartCount] = useState(0);
    const [notice, setNotice] = useState("");

    function handleAddProduct(productDetails) {
        const product = {
            ...productDetails,
            id: Date.now(),
            description: "A fresh find, added to the collection.",
            color: ["mint", "blue", "peach", "lavender"][products.length % 4],
            icon: "✳"
        };
        setProducts(current => [...current, product]);
        setNotice(`${product.name} added to your products.`);
    }

    function handleAddToCart(productId) {
        const product = products.find(item => item.id === productId);
        setCartCount(count => count + 1);
        setNotice(`${product.name} added to your cart.`);
    }

    return (
        <>
            <header className="store-header">
                <a className="brand" href="/products.html" aria-label="Good Things home">
                    <span className="brand-mark">g.</span>
                    <span>goodthings<span className="brand-dot">.</span></span>
                </a>
                <nav aria-label="Main navigation">
                    <a className="nav-active" href="#products">Shop</a>
                    <a href="#add-product-title">Our collection</a>
                </nav>
                <div className="cart-summary" aria-live="polite" aria-label={`${cartCount} items in cart`}>
                    <span className="cart-icon" aria-hidden="true">▢</span>
                    <span>Cart</span>
                    <span className="cart-count">{cartCount}</span>
                </div>
            </header>

            <main className="store-main">
                <section className="store-hero">
                    <div className="hero-copy">
                        <span className="overline"><span className="sparkle">✳</span> THE EVERYDAY EDIT</span>
                        <h1>Good things,<br /><span>well chosen.</span></h1>
                        <p>A little collection of things that make everyday better. Pick a favorite, or add your own.</p>
                        <a href="#products" className="browse-link">Explore the collection <span aria-hidden="true">↓</span></a>
                    </div>
                    <div className="hero-art" aria-hidden="true">
                        <div className="sun-disc"></div>
                        <div className="hero-orbit orbit-one"></div>
                        <div className="hero-orbit orbit-two"></div>
                        <div className="hero-object laptop-object"><span></span></div>
                        <div className="hero-object mouse-object"></div>
                        <span className="hero-sparkle spark-one">✳</span>
                        <span className="hero-sparkle spark-two">✦</span>
                        <span className="hero-caption">Curated for your everyday</span>
                    </div>
                </section>

                <section className="collection" id="products" aria-labelledby="collection-title">
                    <div className="collection-heading">
                        <div>
                            <span className="overline">THE COLLECTION</span>
                            <h2 id="collection-title">Thoughtful essentials</h2>
                            <p>Useful, lovely, and ready for their next home.</p>
                        </div>
                        <span className="collection-count">{products.length} ITEMS</span>
                    </div>

                    <div className="store-layout">
                        <div className="products-area">
                            <div className="product-grid">
                                {products.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                            <p className="cart-feedback" role="status" aria-live="polite">{notice}</p>
                        </div>
                        <ProductForm onAddProduct={handleAddProduct} />
                    </div>
                </section>
            </main>

            <footer className="store-footer">
                <span>goodthings<span className="brand-dot">.</span></span>
                <span>Thoughtful things for everyday living.</span>
                <span>Made with care <span aria-hidden="true">✳</span></span>
            </footer>
        </>
    );
}

const root = document.getElementById("products-root");
if (!root) {
    throw new Error('React root element "#products-root" was not found.');
}

createRoot(root).render(<ProductList />);
