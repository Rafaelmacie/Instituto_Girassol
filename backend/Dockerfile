# Usa uma imagem leve do Node.js (Alpine Linux)
FROM node:22-alpine

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do código fonte para dentro do container
COPY . .

# Informa que o container vai usar a porta 3000
EXPOSE 3000

# Comando para iniciar em modo de desenvolvimento (usa o script "dev" do package.json)
CMD ["npm", "run", "dev"]