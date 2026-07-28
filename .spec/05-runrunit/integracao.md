# Runrunit

Criado em: 28/07/2026

Autor: Netinho

------

## Guia de Integração: Aplicação Monorepo com API do Runrunit

Este documento detalha as diretrizes, arquitetura e exemplos de código para a integração entre a aplicação (após a etapa de processamento de dados) e a API do Runrunit, com o objetivo de automatizar a abertura de tickets (tarefas).

1. Estrutura e Arquitetura no Monorepo
Em uma arquitetura monorepo (utilizando ferramentas como Nx, Turborepo ou Lerna), a melhor prática é isolar as integrações de terceiros. Recomenda-se criar um pacote/módulo dedicado (ex: @monorepo/runrunit-client ou dentro de um serviço de notifications/integrations).
Desacoplamento: O serviço de processamento de dados não deve conhecer os detalhes HTTP do Runrunit. Ele deve apenas emitir um evento ou chamar uma interface interna enviando o título e descrição do ticket.
Resiliência (Filas): O ideal é que a criação do ticket seja enfileirada (ex: via SQS, RabbitMQ, BullMQ ou Kafka) após o processamento. Isso garante que instabilidades na API do Runrunit não quebrem o fluxo principal da sua aplicação.

2. Autenticação e Credenciais
A API do Runrunit utiliza cabeçalhos (headers) customizados para autenticação. Estas credenciais devem ser injetadas na aplicação através de variáveis de ambiente.
Variável de Ambiente
Header da API
Descrição
RUNRUNIT_APP_KEY
App-Key
Chave global da aplicação fornecida nas configurações do Runrunit.
RUNRUNIT_USER_TOKEN
User-Token
Token do usuário do sistema que constará como criador do ticket.

3. Especificação do Endpoint
Para abrir um ticket, utilizaremos o endpoint de criação de tarefas.
Base URL: https://runrun.it/api/v1.0
Endpoint: /tasks
Método: POST
Content-Type: application/json
Exemplo de Payload (Corpo da Requisição)
Abaixo está a estrutura esperada para criar o ticket. Os IDs de projeto (project_id) ou tipo de tarefa (type_id) devem ser previamente mapeados e configurados na aplicação.
```JSON
{
  "task": {
    "title": "[Processamento] Falha na sincronização do Lote 409",
    "description": "Os dados foram processados, mas as seguintes anomalias foram detectadas...",
    "project_id": 12345,
    "type_id": 6789
  }
}
```

4. Exemplo de Implementação (TypeScript / Node.js)
Exemplo de um serviço encapsulado que pode ser exportado no seu monorepo para lidar com a abertura dos tickets.
```JSON
/**
 * Interface para os dados do ticket
 */
export interface RunrunitTicketDTO {
  title: string;
  description: string;
  projectId: number;
  typeId: number;
}
```

/**
 * Serviço para criação de tickets no Runrunit
 */
```JSON
export async function createRunrunitTicket(ticketData: RunrunitTicketDTO) {
  const url = 'https://runrun.it/api/v1.0/tasks';
  
  const headers = {
    'Content-Type': 'application/json',
    'App-Key': process.env.RUNRUNIT_APP_KEY || '',
    'User-Token': process.env.RUNRUNIT_USER_TOKEN || ''
  };

  const payload = {
    task: {
      title: ticketData.title,
      description: ticketData.description,
      project_id: ticketData.projectId,
      type_id: ticketData.typeId
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro API Runrunit (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return data; // Retorna os dados do ticket criado
  } catch (error) {
    console.error('[RunrunitIntegration] Falha ao abrir ticket:', error);
    throw error;
  }
}
```

5. Boas Práticas Adicionais
Tratamento de Erros e Retentativas (Retry): Caso a API retorne erros 5xx ou 429 (Too Many Requests), implemente um mecanismo de repetição com exponential backoff para garantir a entrega da requisição sem sobrecarregar a API.

Mapeamento de Ambientes: No monorepo, garanta que os ambientes de staging ou desenvolvimento não criem tickets em painéis de produção no Runrunit. Mapeie project_id diferentes dependendo do ambiente (`NODE_ENV`).

Logs Ricos: Inclua no log o identificador único (ID) do processamento que gerou a necessidade de abrir o ticket, facilitando a rastreabilidade entre os dados da sua base e os do Runrunit.
