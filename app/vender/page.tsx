"use client";

import Navbar from "@/components/Navbar";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoriesTree, getLicenseTypes, createAsset } from "@/services/api";
import type { CategoryReadWithChildren, LicenseTypeRead, AssetCreate } from "@/services/api-types";
import ImageUploader, { AssetPictureInput } from "@/components/ImageUploader";
import CurrencyInput from 'react-currency-input-field';

// Helper to transform license object into rules
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

export default function AddAssetPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const userId = user?.id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "" as string | number,
    license_type_id: "" as string | number,
  });

  const [pictures, setPictures] = useState<AssetPictureInput[]>([]);
  const [licenses, setLicenses] = useState<LicenseTypeRead[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryReadWithChildren[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
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
          getCategoriesTree(),
        ]);
        setLicenses(licensesData);
        setCategoryTree(categoriesData);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, price: value || "" }));
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, license_type_id: e.target.value }));
  };

  const handleParentCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;
    setSelectedParentId(parentId);
    setFormData(prev => ({ ...prev, category_id: parentId }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    setFormData(prev => ({ ...prev, category_id: subId || selectedParentId }));
  };
  
  const parentCategoryOptions = useMemo(() => [
    { value: "", label: "Selecione uma categoria" },
    ...categoryTree.map(c => ({ value: c.id, label: c.name }))
  ], [categoryTree]);

  const subCategoryOptions = useMemo(() => {
    if (!selectedParentId) return [];
    const parent = categoryTree.find(c => String(c.id) === selectedParentId);
    if (!parent?.children || parent.children.length === 0) return [];
    return [
      { value: parent.id, label: `Geral (${parent.name})` },
      ...parent.children.map(child => ({ value: child.id, label: child.name }))
    ];
  }, [selectedParentId, categoryTree]);

  const selectedLicense = licenses.find(lic => lic.id === Number(formData.license_type_id));
  const licenseRules = getLicenseRules(selectedLicense);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
        alert("Você precisa estar logado para criar um asset.");
        return;
    }
    if (pictures.length === 0) {
        alert("Você precisa adicionar pelo menos uma imagem para o asset.");
        return;
    }
    if (!formData.category_id) {
        alert("Por favor, selecione uma categoria.");
        return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
        alert("Por favor, insira um preço válido.");
        return;
    }
    setIsSubmitting(true);
    
    const payload: AssetCreate = {
      name: formData.name,
      description: formData.description,
      price: formData.price.replace(',', '.'), // Ensure backend receives a dot.
      license_type_id: Number(formData.license_type_id),
      category_id: Number(formData.category_id) || null,
      user_id: userId,
      pictures: pictures,
    };

    try {
        const newAsset = await createAsset(payload);
        alert("Asset criado com sucesso!");
        router.push(`/produto/${newAsset.id}`);
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
              label="Categoria"
              options={parentCategoryOptions}
              value={String(selectedParentId)}
              onChange={handleParentCategoryChange}
              required
            />

            {subCategoryOptions.length > 0 && (
              <FormSelect
                label="Subcategoria"
                options={subCategoryOptions}
                value={String(formData.category_id)}
                onChange={handleSubCategoryChange}
                required
              />
            )}

            <FormInput name="description" label="Descrição" value={formData.description} onChange={handleInputChange} multiline={true} />
            
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px", display: "block" }}>
                Preço
              </label>
              <CurrencyInput
                name="price"
                placeholder="R$ 0,00"
                value={formData.price}
                onValueChange={handlePriceChange}
                intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                style={{
                  width: "100%",
                  height: "45px",
                  padding: "12px 14px",
                  backgroundColor: "var(--bg-card)",
                  border: "3px solid var(--bg-card-border)",
                  borderRadius: "var(--radius-card)",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--color-text-primary)",
                }}
                required
              />
            </div>
            
            <FormSelect
              name="license_type_id"
              label="Licenciamento"
              options={licenses.map(l => ({ value: l.id, label: l.name }))}
              value={String(formData.license_type_id)}
              onChange={handleLicenseChange}
              required
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px", background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-card)', border: '2px solid var(--bg-card-border)' }}>
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
            
            <ImageUploader onUpload={setPictures} />

            <FormInput label="Link do Youtube (opcional)" />

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
