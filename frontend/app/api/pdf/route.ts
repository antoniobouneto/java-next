import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080/api/pdf/convert";
    const apiKey = process.env.API_KEY || "default-dev-secret-key-change-in-prod";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Backend erro: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=pdf-convertido.pdf",
      },
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor Next.js ao processar a requisição." },
      { status: 500 }
    );
  }
}
