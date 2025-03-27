import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const ProductList = ({ products, loading, error, onAdd, onRefresh }) => {
  const navigate = useNavigate();
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [displayCount, setDisplayCount] = useState(9);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleProducts(products.slice(0, displayCount));
  }, [products, displayCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        if (!loadingMore && visibleProducts.length < products.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => prev + 9);
            setLoadingMore(false);
          }, 500);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, visibleProducts.length, products.length]);
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        {error}
        <button className="refresh-button" onClick={onRefresh}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2 className="page-title">Products</h2>
        <button className="btn-primary" onClick={onAdd}>
          Add New Product
        </button>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          <button className="btn-primary" onClick={onAdd}>
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={(e) => {
                e.preventDefault();
                if (product && product.id) {
                  navigate(`/product/${product.id}`);
                } else {
                  console.error("Invalid product data");
                }
              }}
            >
              <div className="product-image">
                <img
                  src={
                    product.imageUrl ||
                    product.image_url ||
                    "/default-product.png"
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-product.png";
                  }}
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-stock">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div className="product-actions">
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product && product.id) {
                      navigate(`/product/${product.id}`);
                    } else {
                      console.error("Invalid product data");
                    }
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          {loadingMore && (
            <div className="loading-more">
              <div className="spinner"></div>
              <p>Loading more products...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
