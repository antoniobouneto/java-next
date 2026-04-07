package com.javanext.demo.controller;

import java.io.ByteArrayOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;

@RestController
@RequestMapping("/api/pdf")
// Lembre-se de ajustar o IP se necessário, ou use "*" para testes locais
@CrossOrigin(origins = {"http://localhost:3000", "http://26.209.64.221:3000"})
public class PdfController {
    
    private static final Logger logger = LoggerFactory.getLogger(PdfController.class);

    @PostMapping("/convert")
    public ResponseEntity<byte[]> convertToPdf(
            @RequestParam("images") MultipartFile[] images,
            @RequestParam("title") String title) {
        
        logger.info("Recebido request para converter {} imagens com título: {}", images.length, title);
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // 1. Adiciona o título centralizado
            if (title != null && !title.isEmpty()) {
                Paragraph p = new Paragraph(title)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
                document.add(p);
            }

            // 2. Adiciona as imagens centralizadas
            for (MultipartFile file : images) {
                Image img = new Image(ImageDataFactory.create(file.getBytes()));
                
                img.setMaxWidth(pdf.getDefaultPageSize().getWidth() - 100);
                img.setHorizontalAlignment(HorizontalAlignment.CENTER);
                img.setMarginBottom(10);
                
                document.add(img);
            }

            document.close();

            logger.info("PDF gerado com sucesso: {} bytes", baos.size());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pdf-convertido.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(baos.toByteArray());
                    
        } catch (Exception e) {
            logger.error("Erro ao gerar PDF", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}