import { NextRequest, NextResponse } from "next/server";
import { imageManager } from "@/utils/imageManager";

/**
 * API endpoint for image management
 * POST /api/images - Validate and manage images
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, imageUrl, productName, category } = body;

    switch (action) {
      case 'validate':
        // Validate if image URL is accessible
        const isValid = await imageManager.validateImageUrl(imageUrl);
        return NextResponse.json({
          valid: isValid,
          url: imageUrl
        });

      case 'fallback':
        // Get fallback image URL
        const fallbackUrl = imageManager.getFallbackImageUrl(productName, category);
        return NextResponse.json({
          url: fallbackUrl
        });

      case 'process':
        // Process and validate image URL
        const processedUrl = await imageManager.processImageUrl(imageUrl, productName, category);
        return NextResponse.json({
          originalUrl: imageUrl,
          processedUrl,
          changed: processedUrl !== imageUrl
        });

      default:
        return NextResponse.json({
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json({
      error: 'Failed to process image request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET /api/images - Get image management status
 */
export async function GET() {
  return NextResponse.json({
    status: 'Image management API is running',
    endpoints: {
      validate: 'POST /api/images with action=validate',
      fallback: 'POST /api/images with action=fallback',
      process: 'POST /api/images with action=process'
    }
  });
}
