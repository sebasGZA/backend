<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 📦 Requirements

Make sure you have installed:

- Node.js (>= 18)
- npm or yarn
- Nest.js
- Git
- Docker

## 🔧 Installation

Clone the repository:

```bash
git clone https://github.com/sebasGZA/backend
cd backend
npm install
```

## ⚙️ Environment Variables

Create a .env file in the root directory and set the variables as .env.template file example

## 🐳 Docker 
Install docker https://docs.docker.com/engine/install
### This will run your db container
```bash
docker compose up -d
```

## ▶️ Running the Project
```bash
npm run migration:run
npm run start:dev
```

## Running test with jest
```bash
npm run test:watch
```


