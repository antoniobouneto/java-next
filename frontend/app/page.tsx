"use client";
import { useState, useRef, useEffect } from "react";
import { convertImagesToPdf } from "@/services/pdfService"; // Lembre de atualizar o service para aceitar o título!

export default function GeminiConverter() {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize da textarea (estilo chat)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) setImages((prev) => [...prev, blob]);
      }
    }
  };

  const handleSend = async () => {
    if (images.length === 0 && !text) return;
    setLoading(true);
    try {
      // O seu service deve enviar (images, text) agora
      await convertImagesToPdf(images, text); 
      setImages([]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131314] text-[#e3e3e3] p-4 font-sans">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        <header className="text-left ml-4">
          <h1 className="text-4xl font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
            Olá, Insira fotos e um título para criar seu PDF!
          </h1>
          <p className="text-2xl text-[#444746]">Como posso organizar suas fotos hoje?</p>
        </header>

        {/* Gemini Input Box */}
        <div 
          onPaste={handlePaste}
          className="bg-[#1e1f20] rounded-[28px] p-4 flex flex-col gap-2 transition-all border border-transparent focus-within:bg-[#28292a]"
        >
          {/* Thumbnails estilo Gemini */}
          {images.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {images.map((img, i) => (
                <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border border-[#444746]">
                  <img src={URL.createObjectURL(img)} className="h-full w-full object-cover" />
                  <button 
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0 right-0 bg-black/50 text-white rounded-bl-lg p-1 hover:bg-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-4">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite um título para o seu PDF e cole as imagens..."
              className="flex-1 bg-transparent border-none outline-none resize-none py-2 text-lg placeholder-[#8e918f] max-h-60"
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={loading || (images.length === 0 && !text)}
              className={`p-3 rounded-full transition-all ${
                images.length > 0 ? "bg-[#004a77] text-[#c2e7ff]" : "bg-[#28292a] text-[#444746]"
              }`}
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-t-transparent border-current rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <footer className="text-center text-xs text-[#8e918f]">
          Sua privacidade e seus PDFs são protegidos pelo Spring Boot.
        </footer>
      </div>
    </div>
  );
}