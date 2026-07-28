# Titulo: Documento guia de como consumir o erro e abrir o ticket

> Descrição: Este documento é um guia do esperado ao se receber um erro no nosso `@packages/browser-sdk` o que se deve fazer

> Criado em: 28/07/2026

-----

## O que se espera da aplicação:

Conforme mencionado a aplicação vem para ser um monitoramento ativo nas lojas permitindo que um erro na jornada do cliente seja identificado antes mesmo de gerar uma reclamação em plataformas de avaliações.

### O erro:

Nossa aplicação será integrada ao `Sentry` e teremos o nosso processo de monitoramento, com base no nosso SDK personalizado que será instalado nas lojas, esse SDK enviará os erros para o nosso frontend com Dashboard visual e também dispara uma requisição para o Runrunit criando uma tarefa.

### O que fazer com o erro:

O Erro pode vir com informações importante como stack, traces de erros e indicativos claros do que está sendo o causador essas informações deve ser enviada para a abertura e enriquecimento da task.

Além de ter um link que seja compartilhavel (Usuário autenticados), assim o desenvolvedor poderá ir diretamente para o erro no painel.

### Notificação:

A notificação vai ser enviada para a equipe de desenvolvimento via Discord.
