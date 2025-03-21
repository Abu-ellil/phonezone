import React from "react";
import "./Products.css";

const ProductList = ({
  products,
  loading,
  error,
  onEdit,
  onAdd,
  onRefresh,
}) => {
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

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          <button className="btn-primary" onClick={onAdd}>
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.imageUrl && (
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
              )}
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-stock">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => onEdit(product)}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
