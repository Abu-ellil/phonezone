import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Settings.css";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [installmentDefaults, setInstallmentDefaults] = useState({
    months: 3,
    downPayment: 420,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settingsRef = doc(db, "settings", "appSettings");
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        if (data.installmentDefaults) {
          setInstallmentDefaults(data.installmentDefaults);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInstallmentDefaults({
      ...installmentDefaults,
      [name]: name === "months" ? parseInt(value) : parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const settingsRef = doc(db, "settings", "appSettings");
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        // Update existing settings
        await updateDoc(settingsRef, {
          installmentDefaults,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new settings document
        await setDoc(settingsRef, {
          installmentDefaults,
          createdAt: new Date().toISOString(),
        });
      }
      setSuccess(true);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <h2 className="settings-title">App Settings</h2>

      <div className="settings-section">
        <h3 className="section-title">Installment Payment Defaults</h3>
        <p className="section-description">
          Set the default values for installment payments. These values will be
          used when customers choose the installment payment option.
        </p>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="months">Default Number of Months:</label>
            <input
              type="number"
              id="months"
              name="months"
              value={installmentDefaults.months}
              onChange={handleInputChange}
              min="1"
              max="24"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="downPayment">Default Down Payment (AED):</label>
            <input
              type="number"
              id="downPayment"
              name="downPayment"
              value={installmentDefaults.downPayment}
              onChange={handleInputChange}
              min="0"
              step="100"
              required
              className="form-control"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">Settings saved successfully!</div>
          )}

          <div className="form-actions">
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={fetchSettings}
              disabled={saving}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
