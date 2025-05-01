import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  image_url: string;
  price?: string;
  original_price?: string;
  category?: string;
  subcategory?: string;
}

export default function ProductCard({
  id,
  name,
  image_url,
  price,
  original_price,
  category,
  subcategory,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id.toString()}`} className="block bg-white h-full">
      <div className="bg-gray-50 h-[320px] w-full overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-100 rounded-md">
        <div className="relative h-48 w-full">
          <Image
            src={image_url}
            alt={name}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="p-2"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <div className="p-3 text-right">
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
            {name}
          </h3>
          <div className="mt-1">
            {category && (
              <span className="text-xs text-gray-700">{category}</span>
            )}
            {subcategory && (
              <>
                <span className="text-xs text-gray-700 mx-1">|</span>
                <span className="text-xs text-gray-700">{subcategory}</span>
              </>
            )}
          </div>
          <div className="mt-1 flex flex-col items-end">
            {price && (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-red-600">
                    {price}
                  </span>
                </div>
              </>
            )}
            {original_price && price !== original_price && (
              <div className="flex flex-col items-end mt-1">
                <span className="text-xs text-gray-700 line-through">
                  {original_price}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
