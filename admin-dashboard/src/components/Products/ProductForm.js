import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../../services/CloudinaryService";
import "./Products.css";

const ProductForm = ({ product, onSave, onCancel }) => {
  const isEditing = !!product;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    imageUrl: "",
    imagePublicId: "", // Added to store Cloudinary public ID for deletion
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        imageUrl: product.imageUrl || "",
        imagePublicId: product.imagePublicId || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.imageUrl;

      // Handle image upload if there's a new file
      if (imageFile) {
        // Upload to Cloudinary instead of Firebase Storage
        const uploadResult = await uploadImageToCloudinary(imageFile);
        imageUrl = uploadResult.url;

        // Store the public ID for future deletion
        const imagePublicId = uploadResult.publicId;

        // Delete old image if updating and there was a previous image
        if (isEditing && product.imagePublicId) {
          try {
            await deleteImageFromCloudinary(product.imagePublicId);
          } catch (err) {
            console.error("Error deleting old image from Cloudinary:", err);
            // Continue with the update even if deleting old image fails
          }
        }

        // Update the formData with the new public ID
        setFormData((prev) => ({
          ...prev,
          imagePublicId: imagePublicId,
        }));
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inStock: formData.inStock,
        imageUrl,
        imagePublicId: imageFile
          ? formData.imagePublicId
          : product?.imagePublicId || "",
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        // Update existing product
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, productData);
      } else {
        // Add new product
        productData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "products"), productData);
      }

      setLoading(false);
      onSave();
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    try {
      // Delete the product document
      await deleteDoc(doc(db, "products", product.id));

      // Delete the product image from Cloudinary if it exists
      if (product.imagePublicId) {
        try {
          await deleteImageFromCloudinary(product.imagePublicId);
        } catch (err) {
          console.error("Error deleting product image from Cloudinary:", err);
          // Continue with deletion even if image deletion fails
        }
      }

      setLoading(false);
      onSave(); // Navigate back to product list
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2 className="page-title">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>

      {error && <div className="error-message">{error}</div>}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.imageUrl && (
              <div className="current-image">
                <img
                  src={formData.imageUrl}
                  alt="Current product"
                  style={{ maxHeight: "100px", marginTop: "10px" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          <label htmlFor="inStock">In Stock</label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn-delete"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Product"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
