import React from 'react';
import { notFound } from 'next/navigation';
import { api, Product, Review } from '@/lib/api';
import { ProductGallery } from './ProductGallery';
import { ProductRightColumn } from './ProductRightColumn';
import { ProductBreadcrumb } from './ProductBreadcrumb';
import { ProductDetailBody } from './ProductDetailBody';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product: Product | null = null;
  let related: Product[] = [];
  let reviews: Review[] = [];

  try {
    product = await api.products.get(resolvedParams.id);
    const all = await api.products.list({ category: product.category });
    related = all.filter((p) => p.id !== product!.id).slice(0, 4);
    reviews = await api.reviews.forProduct(resolvedParams.id);
  } catch (e) {
    notFound();
  }

  if (!product) notFound();

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 lg:px-10 lg:py-4">
      {/* Breadcrumb */}
      <ProductBreadcrumb product={product} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:[direction:ltr]">
        {/* Product Image Gallery */}
        <ProductGallery images={galleryImages} name={product.name} />

        {/* Details */}
        <ProductRightColumn product={product} />
      </div>

      <ProductDetailBody product={product} related={related} reviews={reviews} />
    </div>
  );
}
