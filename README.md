# TCC Frontend

Este repositório contém o front-end React do projeto TCC.

## Requisitos

- Docker
- Node.js (para desenvolvimento local)

## Executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O site ficará disponível em `http://localhost:5173`.

## Construir imagem Docker

O projeto usa `VITE_BACKEND_URL` para apontar para a API de back-end no momento da build.

```bash
docker build --build-arg VITE_BACKEND_URL=http://seu-backend -t tcc-frontend .
```

Substitua `http://seu-backend` pelo endereço do back-end.

## Executar em container

```bash
docker run -d -p 4173:80 --name tcc-frontend tcc-frontend
```

A aplicação ficará disponível em `http://localhost:4173`.

## Observações

- O `Dockerfile` faz o build com `npm run build` e usa `nginx` para servir o conteúdo estático.
- Se o backend mudar, refaça a build com o novo `VITE_BACKEND_URL`.
