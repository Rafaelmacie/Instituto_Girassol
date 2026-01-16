FROM node:22-alpine

# Pasta de trabalho
WORKDIR /app

# Copia dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o código fonte
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Roda o servidor de desenvolvimento.
# O "--host" é OBRIGATÓRIO no Docker para você conseguir acessar pelo navegador do seu Windows.
CMD ["npm", "run", "dev", "--", "--host"]