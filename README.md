# Instituto_Girassol

## Descrição

Este projeto é um sistema de gestão de cursos do Instituto Girassol, permitindo adicionar, editar, excluir e visualizar informações sobre os cursos oferecidos pela instituição, além de gerenciar dados dos alunos matriculados, como informações pessoais e histórico de cursos realizados e também de professores que lecionam as aulas.  

## Objetivo geral

Queremos democratizar o acesso ao conhecimento, oferecendo cursos de alta qualidade para todos que desejam aprender e se desenvolver profissionalmente.

## Como rodar o projeto

1. Clone o repositório

```bash
git clone https://github.com/Rafaelmacie/Instituto_Girassol
```

2. Inicie o projeto utilizando docker-compose

```bash
docker compose up --build
```

A API estará acessível em http://localhost:3000

## Stack

### Observabilidade e Telemetria

- Sentry
  Utilizado para monitorar erros e utilização de recursos da plataforma.
  <img width="1463" height="851" alt="Captura de tela do arquivo insturment.ts, configurado para monitoramento de logs, erros e avisos" src="https://github.com/user-attachments/assets/b4d7c8c3-c4bf-4ec2-a876-579b32046dc5" />
  <img width="1487" height="470" alt="Rotas de erro criadas para testar a conexão com o sentry" src="https://github.com/user-attachments/assets/bb389c4d-83c7-4ccd-834d-7ad09955f44c" />
  <img width="1600" height="506" alt="Print do painel do Sentry com os erros de teste capturados" src="https://github.com/user-attachments/assets/73f7ebf1-1697-4753-ba42-b495d0aadb55" />

- Discord
  Utilizado para receber notificações de pushs, issues, pull requests, entre outros fluxos do github.
  <img width="1600" height="485" alt="Captura de tela da confirmação de webhook criado" src="https://github.com/user-attachments/assets/fe76a28d-0b9a-4162-85c7-0e7d6232074b" />
  <img width="1181" height="809" alt="Captura de tela da mensagem de push recebida no canal do discord" src="https://github.com/user-attachments/assets/76e5aafc-52d9-4efc-a9b3-214bf0662a3f" />

