"use client";

import React, { useState, useCallback, useRef } from 'react';

// Definição do tipo para a saída que o backend espera
export interface AssetPictureInput {
  data: string;
  is_cover: boolean;
}

interface ImageUploaderProps {
  onUpload: (pictures: AssetPictureInput[]) => void;
}

// Componente de Uploader de Imagem sem dependências externas
const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<{ preview: string; data: string }[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const acceptedFiles = Array.from(selectedFiles);

    const filePromises = acceptedFiles.map(file => {
      return new Promise<{ preview: string; data: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          // Cria uma URL temporária para a pré-visualização da imagem
          resolve({ preview: URL.createObjectURL(file), data: base64Data });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newFiles => {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      
      // Notifica o componente pai sobre a mudança nos arquivos
      const output: AssetPictureInput[] = updatedFiles.map((file, index) => ({
        data: file.data,
        is_cover: index === coverIndex,
      }));
      onUpload(output);
    });
  };

  const removeFile = (indexToRemove: number) => {
    // Revoga a URL do objeto para liberar memória
    URL.revokeObjectURL(files[indexToRemove].preview);
    const updatedFiles = files.filter((_, i) => i !== indexToRemove);
    setFiles(updatedFiles);

    let newCoverIndex = coverIndex;
    if (indexToRemove === coverIndex) {
      newCoverIndex = 0; // Se a capa for removida, a primeira imagem vira a nova capa
    } else if (indexToRemove < coverIndex) {
      newCoverIndex = coverIndex - 1;
    }
    setCoverIndex(newCoverIndex);

    const output: AssetPictureInput[] = updatedFiles.map((file, i) => ({
      data: file.data,
      is_cover: i === newCoverIndex,
    }));
    onUpload(output);
  };

  const setAsCover = (index: number) => {
    setCoverIndex(index);
    const output: AssetPictureInput[] = files.map((file, i) => ({
      data: file.data,
      is_cover: i === index,
    }));
    onUpload(output);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Área clicável que ativa o input de arquivo */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: '100%',
          padding: '24px',
          backgroundColor: 'var(--bg-card)',
          border: '3px dashed var(--bg-card-border)',
          borderRadius: 'var(--radius-card)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
      >
        <input 
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }} 
        />
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          Clique aqui ou arraste e solte as imagens
        </p>
      </div>
      
      {/* Pré-visualização das imagens */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
        {files.map((file, index) => (
          <div key={index} style={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <img src={file.preview} alt={`Preview ${index}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {index === coverIndex && (
              <div style={{ position: 'absolute', top: '4px', left: '4px', background: 'var(--color-green)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontFamily: 'var(--font-pixel)' }}>
                Capa
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', display: 'flex' }}>
              <button type="button" onClick={() => setAsCover(index)} style={{ flex: 1, background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px', fontSize: '11px' }} disabled={index === coverIndex}>
                Capa
              </button>
              <button type="button" onClick={() => removeFile(index)} style={{ background: 'var(--color-red)', border: 'none', color: 'white', cursor: 'pointer', padding: '4px', fontSize: '11px' }}>
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
