# PhoneZone Local Data Implementation

## Overview

This document explains the transition from Firebase to using local JSON data for the PhoneZone application. The application now uses a local `db.json` file located in the `public/data/` directory instead of Firebase services.

## Changes Made

### Data Source

- Replaced Firebase Firestore with local JSON data from `public/data/db.json`
- Updated data fetching utilities to read from the local file instead of Firebase APIs
- Created local alternatives for Firebase services

### File Structure

- `/public/data/db.json` - Contains all product data and application settings
- `/src/utils/data.ts` - Updated to fetch data from local JSON file
- `/src/utils/settingsService.ts` - New file that replaces Firebase settings service
- `/src/utils/fileStorage.ts` - New file that provides local file storage functionality
- `/src/utils/cloudinaryUploader.ts` - New file that simulates Cloudinary uploads using local storage

## How It Works

### Data Fetching

The application now fetches data from the local JSON file using Axios:

```typescript
const LOCAL_DB_PATH = "/data/db.json";

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await axios.get<{ products: Product[] }>(LOCAL_DB_PATH);
    return data.products.map((product) => ({
      // Process product data
    }));
  } catch (error) {
    console.error("❌ Error fetching products from local file:", error);
    return [];
  }
}
```

### File Storage

For file storage (previously handled by Firebase Storage), the application now uses a simulated local storage mechanism:

```typescript
export async function uploadFile(
  fileBytes: Uint8Array,
  path: string
): Promise<string> {
  // Simulates file upload and returns a mock URL
  // In a real application, you would implement a proper file upload service
}
```

### Application Settings

Application settings are now retrieved from the local JSON file:

```typescript
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const { data } = await axios.get(LOCAL_DB_PATH);
    if (data.settings) {
      return data.settings;
    }
    // Return default settings if not found
  } catch (error) {
    // Handle error and return defaults
  }
}
```

## Future Improvements

1. **Backend API**: Implement a proper backend API to handle data updates and file uploads
2. **Data Caching**: Add caching mechanisms to improve performance
3. **Offline Support**: Implement offline support using localStorage or IndexedDB

## Notes

- The current implementation is read-only. Any changes made to the data are not persisted.
- File uploads are simulated and don't actually store files on a server.
- For a production application, you would need to implement a proper backend service.
