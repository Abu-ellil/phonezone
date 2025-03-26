import React, { useState, useEffect } from "react";
import "./Products.css";

const ProductFilter = ({ onFilterChange, products }) => {
  // Extract unique categories from products
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: { min: "", max: "" },
    inStock: "",
    searchTerm: "",
  });

  // Extract unique categories when products change
  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueCategories = [
        ...new Set(products.map((product) => product.category)),
      ].filter(Boolean);
      setCategories(uniqueCategories);
    }
  }, [products]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "min" || name === "max") {
      setFilters({
        ...filters,
        priceRange: {
          ...filters.priceRange,
          [name]: value,
        },
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters({
      category: "",
      priceRange: { min: "", max: "" },
      inStock: "",
      searchTerm: "",
    });
  };

  return (
    <div className="product-filter">
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="text"
            name="searchTerm"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group price-range">
          <input
            type="number"
            name="min"
            placeholder="Min Price"
            value={filters.priceRange.min}
            onChange={handleFilterChange}
            className="price-input"
            min="0"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            name="max"
            placeholder="Max Price"
            value={filters.priceRange.max}
            onChange={handleFilterChange}
            className="price-input"
            min="0"
          />
        </div>

        <div className="filter-group">
          <select
            name="inStock"
            value={filters.inStock}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Stock Status</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <button onClick={handleReset} className="btn-reset">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
