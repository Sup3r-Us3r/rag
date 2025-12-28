---
description: Documento normativo da API Nest.js: adota Clean Architecture, DDD e SOLID. Define camadas, responsabilidades, padrões de código, nomenclaturas, contratos, testes e integrações. Deve ser a única fonte de verdade para gerar código e testes
---

# CONTEXTO ARQUITETURAL DA API

## 1. Visão Geral

Esta API backend é construída utilizando Nest.js, TypeScript, Prisma ORM, PostgreSQL, RabbitMQ, Socket.io e Vitest. A arquitetura segue obrigatoriamente Clean Architecture, Domain-Driven Design (DDD) e os princípios SOLID.

A estrutura é organizada por camadas explícitas, com responsabilidades bem definidas e dependências unidirecionais. Nenhuma camada pode violar os limites aqui descritos.

---

## 2. Estrutura de Pastas (Obrigatória)

A organização do projeto deve seguir rigorosamente esta árvore:

src/
- main.ts
- application/
  - use-cases/
    - users/
      - create-user/
      - delete-user/
      - get-user-by-id/
      - list-users/
      - update-user/
- domain/
  - providers/
  - shared/
    - value-objects/
  - users/
    - entities/
    - repositories/
    - value-objects/
- infrastructure/
  - config/
  - database/
    - memory/
    - prisma/
    - repositories/
  - email/
  - messaging/
    - consumers/
    - publishers/
    - rabbitmq/
  - providers/
  - websocket/
    - gateways/
- presentation/
  - http/
    - controllers/
    - dtos/
  - modules/
- shared/
  - exceptions/
  - types/
  - utils/

Nenhuma implementação pode divergir desta organização.

---

## 3. Camada Application (Use Cases)

Local: src/application/use-cases

Responsabilidade:
- Orquestrar fluxos de negócio
- Coordenar entidades, repositórios e providers
- Representar ações explícitas do sistema

Regras obrigatórias:
- Um diretório por caso de uso
- Um use case por ação (Create, Update, Delete, Get, List)
- Cada caso de uso contém:
  - DTO de entrada/saída
  - Classe do use case
  - Teste unitário (.spec.ts)

É proibido:
- Importar Prisma
- Importar Nest.js
- Conter lógica de infraestrutura
- Criar regras de negócio complexas (pertencem ao domínio)

---

## 4. Camada Domain (Regra de Negócio)

Local: src/domain

Responsabilidade:
- Conter regras de negócio puras
- Modelar o domínio de forma explícita

### 4.1 Entidades
Local: src/domain/users/entities

- Representam conceitos centrais do domínio
- Possuem identidade
- Garantem invariantes

### 4.2 Value Objects
Local:
- src/domain/users/value-objects
- src/domain/shared/value-objects

- São imutáveis
- Não possuem identidade
- Validam regras próprias (ex: CPF, Email, Address)

### 4.3 Repositórios
Local: src/domain/users/repositories

- São interfaces
- Definem contratos de persistência
- Não conhecem implementações concretas

### 4.4 Providers (Abstrações)
Local: src/domain/providers

- Interfaces para serviços externos
- Exemplos: cache, hash, email
- Nunca possuem implementação nesta camada

É proibido:
- Importar Nest.js
- Importar Prisma
- Acessar banco de dados
- Conhecer HTTP, RabbitMQ ou WebSocket

---

## 5. Camada Infrastructure

Local: src/infrastructure

Responsabilidade:
- Implementar detalhes técnicos
- Conectar o sistema a serviços externos

### 5.1 Banco de Dados

Local:
- src/infrastructure/database/prisma
- src/infrastructure/database/repositories

Regras:
- Prisma é usado exclusivamente aqui
- Repositórios Prisma implementam interfaces do domínio
- Models Prisma não vazam para outras camadas
- Implementações em memória são permitidas para testes

### 5.2 Providers Concretos

Local: src/infrastructure/providers

- Implementam interfaces definidas no domínio
- Exemplos: bcrypt, redis, SMTP

### 5.3 Email

Local: src/infrastructure/email

- Contém templates e serviços de envio
- Nunca contém regra de negócio

### 5.4 RabbitMQ

Local:
- src/infrastructure/messaging/rabbitmq
- src/infrastructure/messaging/publishers
- src/infrastructure/messaging/consumers

Regras:
- Use cases disparam eventos
- Publishers traduzem eventos em mensagens
- Consumers executam ações chamando use cases
- Consumers não contêm regra de negócio

---

## 6. WebSocket (Socket.io)

Local: src/infrastructure/websocket/gateways

Responsabilidade:
- Comunicação em tempo real
- Apenas adaptação de eventos

Regras:
- Gateways não contêm regra de negócio
- Gateways apenas chamam use cases
- DTOs próprios para comunicação via socket

---

## 7. Camada Presentation (API)

Local: src/presentation

### 7.1 Controllers HTTP

Local: src/presentation/http/controllers

Responsabilidade:
- Adaptar HTTP para aplicação
- Validar entrada
- Chamar use cases

Regras:
- Não contém lógica de negócio
- Não acessa Prisma
- Trabalha apenas com DTOs

### 7.2 DTOs HTTP

Local: src/presentation/http/dtos

- DTOs específicos de transporte HTTP
- Diferentes dos DTOs de application, se necessário

### 7.3 Modules

Local: src/presentation/modules

- Organização dos módulos Nest.js
- Realizam injeção de dependência
- Conectam camadas sem violar dependências

---

## 8. Shared

### 8.1 Exceptions
Local: src/shared/exceptions

- Exceções padronizadas
- Exceções de domínio não dependem de Nest.js

### 8.2 Utils e Types
Local:
- src/shared/utils
- src/shared/types

- Utilitários genéricos
- Tipos reutilizáveis
- Sem dependência de infraestrutura

---

## 9. Testes

### Testes Unitários
- Localizados junto ao use case
- Testam regras e fluxos
- Dependências mockadas
- Sem Nest.js e sem banco real

### Testes E2E
- Localizados na camada presentation
- Usam Nest Testing Module
- Testam fluxo completo (HTTP → Use Case → Infra)

Vitest é obrigatório.

---

## 10. Convenções Gerais

- PascalCase para classes
- camelCase para métodos
- Um arquivo por classe
- Nomes devem refletir intenção de negócio
- Não existem services genéricos

---

## 11. Diretrizes Obrigatórias para a LLM

Ao gerar qualquer funcionalidade, a LLM deve obrigatoriamente:
1. Respeitar a árvore de diretórios definida
2. Identificar o domínio envolvido
3. Criar entidades e value objects quando necessário
4. Criar interfaces de repositório no domínio
5. Criar use cases explícitos na camada application
6. Criar implementações técnicas na infraestrutura
7. Criar controllers ou gateways apenas como adaptadores
8. Criar testes unitários e E2E compatíveis

É proibido:
- Pular camadas
- Misturar responsabilidades
- Colocar regra de negócio fora do domínio
- Introduzir padrões não definidos neste documento