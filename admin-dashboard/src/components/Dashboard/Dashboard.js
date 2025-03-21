import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Sidebar from "./Sidebar";
import ProductList from "../Products/ProductList";
import ProductForm from "../Products/ProductForm";
import ProductFilter from "../Products/ProductFilter";
import "./Dashboard.css";

const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState("products");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: { min: "", max: "" },
    inStock: "",
    searchTerm: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
      setFilteredProducts(productsList);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveView("editProduct");
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setActiveView("addProduct");
  };

  const handleProductSaved = () => {
    fetchProducts();
    setActiveView("products");
  };

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);

      // Apply filters to products
      let filtered = [...products];

      // Filter by search term
      if (newFilters.searchTerm) {
        const searchLower = newFilters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower)
        );
      }

      // Filter by category
      if (newFilters.category) {
        filtered = filtered.filter(
          (product) => product.category === newFilters.category
        );
      }

      // Filter by price range
      if (newFilters.priceRange.min) {
        filtered = filtered.filter(
          (product) => product.price >= parseFloat(newFilters.priceRange.min)
        );
      }
      if (newFilters.priceRange.max) {
        filtered = filtered.filter(
          (product) => product.price <= parseFloat(newFilters.priceRange.max)
        );
      }

      // Filter by stock status
      if (newFilters.inStock !== "") {
        const inStockValue = newFilters.inStock === "true";
        filtered = filtered.filter(
          (product) => product.inStock === inStockValue
        );
      }

      setFilteredProducts(filtered);
    },
    [products]
  );

  const renderContent = () => {
    switch (activeView) {
      case "products":
        return (
          <>
            <ProductFilter
              onFilterChange={handleFilterChange}
              products={products}
            />
            <ProductList
              products={filteredProducts}
              loading={loading}
              error={error}
              onEdit={handleEditProduct}
              onAdd={handleAddProduct}
              onRefresh={fetchProducts}
            />
          </>
        );
      case "addProduct":
      case "editProduct":
        return (
          <ProductForm
            product={editingProduct}
            onSave={handleProductSaved}
            onCancel={() => setActiveView("products")}
          />
        );
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onAddProduct={handleAddProduct}
        onLogout={onLogout}
        user={user}
      />
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
