import AuthorCard from "@/components/AuthorCard";
import LicenseCard from "@/components/LicenseCard";
import Navbar from "@/components/Navbar";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductTags from "@/components/ProductTags";
import PurchaseCard from "@/components/PurchaseCard";
import RatingsList from "@/components/RatingsList";
import ReviewForm from "@/components/ReviewForm";
import { getAssetById, getUserById, getLicenseTypeById, getReviewsByAssetId, getCategoriesTree } from "@/services/api";
import { CategoryReadWithChildren, LicenseTypeRead } from "@/services/api-types";
import React from "react";

// Helper to transform license object into rules, similar to the one in /vender
const getLicenseRules = (license: LicenseTypeRead | undefined) => {
    if (!license) return { canDo: [], cannotDo: [] };
    const canDo = [], cannotDo = [];
    if (license.can_use_commercially) canDo.push("Usar em projetos comerciais"); else cannotDo.push("Uso comercial não permitido");
    if (license.can_modify) canDo.push("Modificar o asset"); else cannotDo.push("Modificação não permitida");
    if (license.requires_attribution) canDo.push("Requer atribuição ao autor original");
    if (license.can_resell) canDo.push("Revender o asset (verificar termos)"); else cannotDo.push("Não pode revender o asset isoladamente");
    if (license.can_sublicense) canDo.push("Sublicenciar a terceiros (verificar termos)"); else cannotDo.push("Não pode sublicenciar a terceiros");
    return { canDo, cannotDo };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const assetId = Number(resolvedParams.id);

  if (isNaN(assetId)) {
    return <div>Asset ID inválido.</div>;
  }
  
  // 1. Fetch the main asset
  const asset = await getAssetById(assetId);

  // 2. Fetch related data in parallel, now fetching the category tree
  const [author, license, reviews, categoryTree] = await Promise.all([
    getUserById(asset.user_id),
    getLicenseTypeById(asset.license_type_id),
    getReviewsByAssetId(asset.id),
    getCategoriesTree()
  ]);
  
  const licenseRules = getLicenseRules(license);

  // 3. New logic to find the full category path for tags
  const tags: string[] = [];
  let categoryNameForBreadcrumb = "Sem categoria";

  function findCategoryPath(nodes: CategoryReadWithChildren[], targetId: number, path: string[] = []): string[] | null {
    for (const node of nodes) {
      const currentPath = [...path, node.name];
      if (node.id === targetId) {
        return currentPath;
      }
      if (node.children) {
        const foundPath = findCategoryPath(node.children, targetId, currentPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  }

  if (asset.category_id) {
    const categoryPath = findCategoryPath(categoryTree, asset.category_id);
    if (categoryPath) {
      tags.push(...categoryPath);
      categoryNameForBreadcrumb = categoryPath[categoryPath.length - 1]; // Use last item for breadcrumb
    }
  }


  // Calculate average rating and rating count from reviews
  const ratingCount = reviews.length;
  const averageRating = ratingCount > 0 
    ? reviews.reduce((acc, review) => acc + review.rate, 0) / ratingCount
    : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-secondary)"}}>
          <a href="/" style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>Início</a>
          <span>›</span>
          <span style={{ color: "var(--color-text-secondary)" }}>{categoryNameForBreadcrumb}</span>
          <span>›</span>
          <span style={{ color: "var(--color-text-primary)", fontWeight: 800 }}>{asset.name}</span>
        </nav>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {/* Image gallery */}
            <ProductImageGallery images={asset.pictures} productName={asset.name} />

            {/* Description */}
            <section>
              <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "12px", color: "var(--color-text-primary)", marginBottom: "14px", letterSpacing: "-0.3px" }}>
                Descrição
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.75 }}>
                {asset.description || "Nenhuma descrição fornecida."}
              </p>
            </section>

            {/* Tags Section */}
            {tags.length > 0 && <ProductTags tags={tags} />}

            {/* Author Card */}
            <AuthorCard author={author} />
            
            {/* Review Form */}
            <ReviewForm assetId={assetId} />

            {/* Ratings List */}
            <RatingsList reviews={reviews} />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Purchase card */}
            <PurchaseCard
              productId={asset.id}
              category={asset.name}
              creator={author.username}
              price={Number(asset.price)}
              rating={averageRating}
              ratingCount={ratingCount}
            />

            {/* License card */}
            <LicenseCard
              canDo={licenseRules.canDo}
              cannotDo={licenseRules.cannotDo}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "3px solid var(--bg-card-border)", backgroundColor: "var(--bg-navbar)", padding: "24px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--color-text-secondary)", letterSpacing: "0.5px" }}>
          © 2026 Pixel Vault · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
