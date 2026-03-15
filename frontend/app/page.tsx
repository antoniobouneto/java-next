"use client";
import { useState } from "react";

export default function ImageToPdf() {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Lógica para capturar o "Paste" (Ctrl+V)
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          setImages((prev) => [...prev, blob]);
        }
      }
    }
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      const response = await fetch("http://26.209.64.221:8080/api/pdf/convert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Recebe o PDF como um Blob (binário)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "projeto_antonio.pdf";
        a.click();
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onPaste={handlePaste} className="p-10 flex flex-col items-center gap-5 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Conversor de Imagens para PDF</h1>
      <p className="text-gray-400">Clique aqui e aperte **Ctrl + V** para colar imagens</p>
      
      <div className="flex gap-4 flex-wrap justify-center border-2 border-dashed border-gray-600 p-10 w-full max-w-2xl">
        {images.map((img, index) => (
          <img key={index} src={URL.createObjectURL(img)} alt="preview" className="h-32 rounded shadow-lg" />
        ))}
        {images.length === 0 && <span className="text-gray-600">Nenhuma imagem colada ainda...</span>}
      </div>

      <button 
        onClick={generatePdf}
        disabled={loading || images.length === 0}
        className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold disabled:bg-gray-700"
      >
        {loading ? "Gerando PDF..." : "Gerar PDF Agora"}
      </button>
    </div>
  );
}