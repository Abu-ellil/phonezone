import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
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
        price: product.price ? parseFloat(product.price).toFixed(2) : "",
        category: product.category || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        imageUrl: product.imageUrl || "",
        imagePublicId: product.imagePublicId || "",
      });
    }
  }, [product]);

  // التحقق من تحديث البيانات في النموذج
  useEffect(() => {
    console.log("حالة النموذج الحالية:", formData);
  }, [formData]);

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

      // Remove any non-numeric characters except decimal point from price
      const cleanPrice = formData.price.toString().replace(/[^0-9.]/g, "");
      const parsedPrice = parseFloat(cleanPrice);

      if (isNaN(parsedPrice)) {
        throw new Error("Invalid price format. Please enter a valid number.");
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parsedPrice,
        category: formData.category,
        inStock: formData.inStock,
        imageUrl,
        imagePublicId: imageFile
          ? formData.imagePublicId
          : product?.imagePublicId || "",
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        try {
          // Update existing product
          if (!product?.id) {
            setError("لا يمكن تحديث المنتج: معرف المنتج غير موجود");
            return;
          }

          // Ensure the ID is a string and trim any whitespace
          const productId = String(product.id).trim();
          console.log("جاري تحديث المنتج بمعرف:", productId);

          const productRef = doc(db, "products", productId);

          // Check if the document exists before updating
          const docSnap = await getDoc(productRef);
          if (!docSnap.exists()) {
            setError(`لا يمكن العثور على المنتج بمعرف ${productId}`);
            return;
          }

          await updateDoc(productRef, productData);
          console.log("تم تحديث المنتج بنجاح");
        } catch (updateError) {
          console.error("خطأ في تحديث المنتج:", updateError);
          setError("حدث خطأ أثناء تحديث المنتج. يرجى المحاولة مرة أخرى.");
          return;
        }
      } else {
        // Add new product
        productData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "products"), productData);
      }

      setLoading(false);
      onSave();
    } catch (err) {
      console.error("خطأ في حفظ المنتج:", err);
      if (err.message.includes("Invalid price")) {
        setError("صيغة السعر غير صحيحة. الرجاء إدخال رقم صحيح.");
      } else if (err.code === "permission-denied") {
        setError("ليس لديك صلاحية لتحديث هذا المنتج.");
      } else {
        setError("حدث خطأ أثناء حفظ المنتج. الرجاء المحاولة مرة أخرى.");
      }
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
            <div className="price-input-container">
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanValue = value.replace(/[^0-9.]/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    price: cleanValue,
                  }));
                }}
                required
                placeholder="Enter price"
                className="price-input"
              />
              {formData.price && (
                <div className="price-preview">
                  $
                  {parseFloat(formData.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
            {formData.imageUrl && (
              <div className="current-image">
                <img
                  src={formData.imageUrl}
                  alt="Current product"
                  className="product-preview-image"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "300px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    margin: "10px 0",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                />
                <div className="image-info">
                  <span className="image-label">Current Image</span>
                </div>
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
