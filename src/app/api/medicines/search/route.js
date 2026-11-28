import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicProductFilter } from "@/lib/productWizard";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") || "";
    const query = rawQuery.trim();

    if (!query || query.length < 1) {
      return NextResponse.json({
        suggestions: []
      });
    }

    // Clean query - preserve letters, numbers, spaces, and hyphens
    const cleanTerm = query.replace(/[^\w\s-]/gi, "").trim();
    if (!cleanTerm) {
      return NextResponse.json({
        suggestions: []
      });
    }

    const lowerTerm = cleanTerm.toLowerCase();

    // 1. Fetch products where name contains the entered characters ANYWHERE (prefix, middle, end)
    // Case-insensitive substring matching
    const products = await db.product.findMany({
      where: {
        AND: [
          publicProductFilter,
          {
            name: {
              contains: cleanTerm,
              mode: "insensitive"
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      take: 25
    });

    // 2. Score and prioritize:
    // - Exact match first
    // - Starts with query second
    // - Contains in middle/end third
    // - Alphabetical secondary order
    const scored = products.map((p) => {
      const nameLower = (p.name || "").toLowerCase();
      let score = 0;
      if (nameLower === lowerTerm) {
        score = 100;
      } else if (nameLower.startsWith(lowerTerm)) {
        score = 80;
      } else {
        score = 50;
      }
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        type: "product",
        _score: score
      };
    });

    scored.sort((a, b) => {
      if (b._score !== a._score) {
        return b._score - a._score;
      }
      return a.name.localeCompare(b.name);
    });

    // Limit to 5-8 relevant suggestions
    const topSuggestions = scored.slice(0, 8).map(({ id, name, slug, type }) => ({
      id,
      name,
      slug,
      type
    }));

    const res = NextResponse.json({
      suggestions: topSuggestions
    });

    res.headers.set("Cache-Control", "public, max-age=15, stale-while-revalidate=45");
    return res;
  } catch (error) {
    console.error("Error in /api/medicines/search:", error);
    return NextResponse.json(
      { suggestions: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
