# Sử dụng Node.js làm base image
FROM node:16

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000 để ứng dụng React được truy cập
EXPOSE 80

# Lệnh khởi chạy development server
CMD ["npm", "start"]
