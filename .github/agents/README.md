# Guia de Uso dos Agentes

Este guia ajuda a escolher rapidamente qual agente usar no dia a dia.

## Visao geral

- Clean Code Agent: melhora legibilidade, nomes, duplicacao e tratamento de erros sem mudar comportamento.
- Software Architecture Agent: analisa limites entre modulos/camadas e planeja refatoracoes por fases.
- Testing Agent: define e implementa testes de maior valor para reduzir regressao.

## Quando usar cada um

### 1) Clean Code Agent

Use quando:
- O codigo funciona, mas esta dificil de entender ou manter.
- Existem funcoes longas, nomes confusos ou logica duplicada.
- Voce quer refatoracao segura, com baixo risco.

Exemplos de pedido:
- "Revise este arquivo e aplique melhorias de clean code sem alterar comportamento."
- "Reduza duplicacao neste modulo e melhore nomes de variaveis."

Resultado esperado:
- Lista de problemas por severidade.
- Patch pequeno e seguro.
- Riscos residuais e como validar.

### 2) Software Architecture Agent

Use quando:
- Ha duvida sobre responsabilidade de cada camada (API, services, domain, frontend).
- O acoplamento entre modulos esta aumentando.
- Voce precisa de um plano de refatoracao progressivo.

Exemplos de pedido:
- "Mapeie a arquitetura atual e proponha melhorias por impacto x esforco."
- "Identifique pontos onde a camada de dominio depende de infraestrutura."

Resultado esperado:
- Mapa do estado atual.
- Riscos arquiteturais priorizados.
- Plano por etapas com notas de migracao/rollback.

### 3) Testing Agent

Use quando:
- Voce quer aumentar confianca antes de mudar partes sensiveis.
- Existem bugs recorrentes ou regressao em fluxos de importacao/exportacao.
- Falta uma estrategia clara de cobertura.

Exemplos de pedido:
- "Crie uma matriz de testes para os fluxos criticos de curriculo."
- "Implemente testes de regressao para normalizacao e validacao de payload."

Resultado esperado:
- Matriz de risco e cobertura.
- Testes priorizados e objetivos.
- Resumo de execucao e lacunas restantes.

## Rota rapida de decisao

- Problema de legibilidade/manutencao local: use Clean Code Agent.
- Problema de fronteira/acoplamento entre modulos: use Software Architecture Agent.
- Problema de confianca/regressao/cobertura: use Testing Agent.

## Fluxo recomendado para retomada

1. Comece com Testing Agent para mapear risco e evitar regressao.
2. Aplique melhorias locais com Clean Code Agent.
3. Se surgir acoplamento estrutural, acione Software Architecture Agent.
4. Volte ao Testing Agent para fechar lacunas.

## Dica pratica

Quando estiver em duvida, descreva o objetivo e o risco principal no pedido.
Isso ajuda o agente a responder com um plano mais objetivo e util.
