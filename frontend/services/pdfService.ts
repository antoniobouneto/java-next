const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/pdf/convert";
export async function convertImagesToPdf(images: File[], text: string): Promise<void> {
  if (images.length === 0) {
    throw new Error("Nenhuma imagem fornecida");
  }

  const formData = new FormData();
  formData.append("title", text);
  images.forEach((img) => formData.append("images", img));

  try {
    console.log("Enviando para:", API_URL);
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    console.log("Status resposta:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const blob = await response.blob();
    console.log("PDF gerado com sucesso:", blob.size, "bytes");
    downloadPdf(blob, "projeto_antonio.pdf");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

function downloadPdf(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}
