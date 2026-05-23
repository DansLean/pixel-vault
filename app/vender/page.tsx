"use client";

import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { useAuth } from "@/contexts/AuthContext";
import { getCategories, getLicenseTypes, createAsset } from "@/services/api";
import type { CategoryRead, LicenseTypeRead, AssetCreate } from "@/services/api-types";

// Helper to transform license object into rules
const getLicenseRules = (license: LicenseTypeRead | undefined) => {
    if (!license) {
        return { canDo: [], cannotDo: [] };
    }
    const canDo = [];
    const cannotDo = [];

    if (license.can_use_commercially) canDo.push("Usar em projetos comerciais");
    else cannotDo.push("Usar em projetos comerciais");

    if (license.can_modify) canDo.push("Modificar o asset");
    else cannotDo.push("Modificar o asset");
    
    if (license.requires_attribution) canDo.push("Requer atribuição ao autor original");
    
    if (license.can_resell) canDo.push("Revender o asset (verificar termos)");
    else cannotDo.push("Revender o asset isoladamente");

    if (license.can_sublicense) canDo.push("Sublicenciar a terceiros (verificar termos)");
    else cannotDo.push("Sublicenciar a terceiros");
    
    return { canDo, cannotDo };
}

export default function AddAssetPage() {
  const router = useRouter();
  const { userId, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0.00",
    category_id: "" as string | number,
    license_type_id: "" as string | number,
  });

  const [licenses, setLicenses] = useState<LicenseTypeRead[]>([]);
  const [categories, setCategories] = useState<CategoryRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [licensesData, categoriesData] = await Promise.all([
          getLicenseTypes(),
          getCategories(),
        ]);
        setLicenses(licensesData);
        setCategories(categoriesData);
        // Set default license if available
        if (licensesData.length > 0) {
            setFormData(prev => ({ ...prev, license_type_id: licensesData[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch page data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const selectedLicense = licenses.find(lic => lic.id === Number(formData.license_type_id));
  const licenseRules = getLicenseRules(selectedLicense);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
        alert("Você precisa estar logado para criar um asset.");
        return;
    }
    setIsSubmitting(true);
    
    const payload: AssetCreate = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      license_type_id: Number(formData.license_type_id),
      category_id: Number(formData.category_id) || null,
      user_id: userId,
    };

    try {
        const newAsset = await createAsset(payload);
        alert("Asset criado com sucesso!");
        router.push('/'); // Redirect to homepage
    } catch (error) {
        console.error("Failed to create asset", error);
        alert("Falha ao criar o asset. Tente novamente.");
    } finally {
        setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: 'white', textAlign: 'center', paddingTop: '100px' }}>
            <Navbar />
            Carregando...
        </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <Navbar />
      <main
        style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px 60px" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "24px",
            color: "var(--color-text-primary)",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          Adicionar Asset
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <FormInput name="name" label="Título do Asset" value={formData.name} onChange={handleInputChange} required />
            <FormSelect
              name="category_id"
              label="Categorias"
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              value={String(formData.category_id)}
              onChange={handleInputChange}
            />
            <FormInput name="description" label="Descrição" value={formData.description} onChange={handleInputChange} multiline={true} />
            <FormInput name="price" label="Preço" type="number" value={formData.price} onChange={handleInputChange} />
            <FormSelect
              name="license_type_id"
              label="Licenciamento"
              options={licenses.map(l => ({ value: l.id, label: l.name }))}
              value={String(formData.license_type_id)}
              onChange={handleInputChange}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--color-green)", marginBottom: "4px" }}>
                  Pode fazer:
                </h3>
                <ul style={{ listStylePosition: "inside", fontFamily: "var(--font-body)", color: "var(--color-text-primary)", fontSize: "14px", lineHeight: 1.6 }}>
                  {licenseRules.canDo.map((rule, i) => <li key={i}>{rule}</li>)}
                </ul>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--color-red)", marginBottom: "4px" }}>
                  NÃO Pode fazer:
                </h3>
                <ul style={{ listStylePosition: "inside", fontFamily: "var(--font-body)", color: "var(--color-text-primary)", fontSize: "14px", lineHeight: 1.6 }}>
                  {licenseRules.cannotDo.map((rule, i) => <li key={i}>{rule}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px", display: "block" }}>
                Fotos
              </label>
              <div style={{ width: "100%", paddingTop: "56.25%", backgroundColor: "var(--bg-card)", border: "3px dashed var(--bg-card-border)", borderRadius: "var(--radius-card)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "var(--bg-card-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: "30px", fontWeight: "bold" }}>
                    +
                  </div>
                </div>
              </div>
            </div>
            <FormInput label="Link do Youtube" />

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "var(--color-text-primary)",
                  color: "var(--color-white)",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  fontWeight: 800,
                  padding: "14px 40px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
