-- Additive patch for databases initialized before Prisma migration tracking.
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "manufacturer" TEXT,
  ADD COLUMN IF NOT EXISTS "short_description" TEXT,
  ADD COLUMN IF NOT EXISTS "pack_size" TEXT,
  ADD COLUMN IF NOT EXISTS "unit" TEXT,
  ADD COLUMN IF NOT EXISTS "country_of_origin" TEXT,
  ADD COLUMN IF NOT EXISTS "meta_keywords" TEXT,
  ADD COLUMN IF NOT EXISTS "source_url" TEXT,
  ADD COLUMN IF NOT EXISTS "category_source_url" TEXT;
