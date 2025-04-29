/**
 * Utility for fetching data in Next.js applications that works in both client and server environments
 */
import axios from "axios";

// Dynamic imports for server-side only modules
let fs: any;
let path: any;

// Only import fs and path in server environment
if (typeof window === "undefined") {
  import("fs").then((module) => {
    fs = module.default;
  });
  import("path").then((module) => {
    path = module.default;
  });
}

/**
 * Get the absolute path to the public directory
 * @returns The absolute path to the public directory
 */
const getPublicDir = () => {
  // In Node.js environment (server-side)
  if (typeof process !== "undefined" && process.cwd && path) {
    return path.join(process.cwd(), "public");
  }
  return "";
};

/**
 * Fetch data from a local JSON file
 * @param filePath Path to the JSON file relative to the public directory
 * @returns Promise resolving to the parsed JSON data
 */
export async function fetchLocalJson<T>(filePath: string): Promise<T> {
  try {
    // In browser environment
    if (typeof window !== "undefined") {
      const response = await axios.get<T>(
        `${window.location.origin}${filePath}`
      );
      return response.data;
    }

    // In server environment
    if (fs && path) {
      try {
        const publicDir = getPublicDir();
        const fullPath = path.join(publicDir, filePath);

        // Read the file directly from the filesystem
        const fileContent = fs.readFileSync(fullPath, "utf8");
        return JSON.parse(fileContent);
      } catch (fsError) {
        console.error("Error reading file from filesystem:", fsError);
        // Fallback to using axios with a relative URL
        const response = await axios.get<T>(filePath);
        return response.data;
      }
    }

    // Fallback if fs/path modules aren't available
    const response = await axios.get<T>(filePath);
    return response.data;
  } catch (error) {
    console.error(`Error fetching local JSON from ${filePath}:`, error);
    throw error;
  }
}
