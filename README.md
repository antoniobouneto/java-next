🚀 Clipboard to PDF - Microservices Edition
Este projeto é uma ferramenta para converter capturas de tela (clipboard) em arquivos PDF de forma assíncrona. A aplicação foi estruturada em microsserviços para separar a interface do usuário do processamento pesado de geração de documentos, garantindo escalabilidade e resiliência.

🏗️ Como o sistema funciona
Em vez de processar tudo em uma única requisição, o projeto utiliza uma arquitetura orientada a eventos:

Frontend (Next.js): Captura a imagem da área de transferência e faz o upload para o gateway.

Image Service (Spring Boot): Recebe o arquivo, salva em um storage temporário e publica um evento no RabbitMQ.

PDF Worker (Spring Boot): Consome a fila de mensagens, processa a imagem usando a biblioteca iText e gera o PDF final.

Notificação: O sistema utiliza WebSockets para avisar o frontend assim que o processamento termina.

🛠️ Stack Técnica
Frontend: Next.js (App Router), Tailwind CSS.

Backend: Java 21, Spring Boot 3, Spring Cloud Stream.

Mensageria: RabbitMQ (AMQP).

Banco de Dados: PostgreSQL.

Infra: Docker & Docker Compose.

🚀 Executando o projeto
1. Clonar e subir a infra
Certifique-se de ter o Docker instalado e rode:

Bash
git clone https://github.com/seu-usuario/clipboard-to-pdf.git
cd clipboard-to-pdf
docker-compose up -d
2. Rodar os serviços Java
Entre na pasta de cada serviço (image-service e pdf-worker) e execute:

Bash
./mvnw spring-boot:run
3. Iniciar o Frontend
Bash
cd frontend
npm install
npm run dev
🛠️ Roadmap / Próximos Passos
[ ] Integração com AWS S3 para persistência definitiva.

[ ] Implementação de autenticação via Keycloak ou Spring Security.

[ ] Dashboard de monitoramento de filas com RabbitMQ Management.
