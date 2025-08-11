# Meu Bolso - Backend

Este projeto é o backend de um sistema de controle financeiro pessoal, desenvolvido em Node.js com TypeScript, Prisma ORM e banco de dados PostgreSQL. Ele permite gerenciar contas bancárias, transações e despesas, auxiliando o usuário a ter um melhor controle sobre suas finanças.

## Objetivo

O objetivo do sistema é fornecer uma API robusta para registrar e acompanhar saldos de contas, movimentações financeiras (entradas e saídas) e despesas categorizadas, facilitando a organização e análise dos dados financeiros do usuário.

## Como rodar localmente

1. **Pré-requisitos**:

    - Node.js (versão 18+)
    - PostgreSQL
    - npm

2. **Instalação**:
    ```sh
    $ npm install
    ```
3. **Criação da variável .env**

    ```sh
    # No direório raiz do projeto
    $ cp .env.example .env
    ```

    Depois preencha as variáveis de configuração com os valores desejados.

4. **Rodando**
    ```sh
    $ npm run dev
    ```

## Rodando com docker

<p style="color: #D11800">Imagem da aplicação ainda em otimização</p>

1. **Pré-requisitos**:

    - Docker
    - Docker compose

2. **Criação da variável .env.production**

    ```sh
    # No direório raiz do projeto
    $ cp .env.example .env.production
    ```

    Depois preencha as variáveis de configuração com os valores desejados.

3. **Rodando com o compose**
    ```sh
    # No direório raiz do projeto
    $ docker compose up -d --build
    ```
