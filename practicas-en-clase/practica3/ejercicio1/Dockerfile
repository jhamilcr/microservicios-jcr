# Imagen base ligera
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json si existe
COPY package*.json ./

# Instala solo prod deps
RUN npm ci --omit=dev

# Copia el resto del código
COPY . .

# Puerto expuesto (dentro del contenedor)
EXPOSE 8080

# Comando
CMD ["npm", "start"]
