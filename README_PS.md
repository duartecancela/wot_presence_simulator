# Projeto WoT - Simulação de Presenças com Contador

## 🎯 Objetivo

Este projeto baseia-se no exemplo oficial `counter.js` da Eclipse Thingweb (node-wot) e estende-o para incluir:

-   Simulação de presenças humanas;
-   Contagem de pessoas detetadas;
-   Ativação da simulação apenas quando o cliente o solicitar;
-   Comportamento compatível com o código original (execução pontual e encerramento automático do cliente).

---

## 🧩 Componentes do Projeto

### 1. `counter-on-demand-simulation.js`

Este ficheiro representa o **produtor** (Servient) WoT. Ele:

-   Expõe a Thing `Counter`;
-   Suporta as ações originais: `increment`, `decrement`, `reset`;
-   Mantém o uso de `uriVariables.step`;
-   Define uma nova propriedade observável: `presenceCount`;
-   Adiciona uma nova ação: `startPresenceSimulation`;
-   **A simulação só ocorre quando esta ação é invocada**;
-   Não executa `setInterval` automaticamente — comportamento passivo como no original.

### 2. `counter-client-original-preserved-autoexit.js`

Este ficheiro representa o **cliente** (Consumer) WoT. Ele:

-   Mantém **todo o conteúdo e comentários originais do `counter-client.js`**;
-   Invoca a ação `startPresenceSimulation`;
-   Observa a propriedade `presenceCount`;
-   **Termina automaticamente** após receber a primeira atualização ou após timeout de 5 segundos.

---

## 🛠️ Execução

### ▶️ 1. Iniciar o Servient (Servidor)

```bash
node packages/cli/dist/cli.js examples/scripts/counter-on-demand-simulation.js
```

Deverás ver algo como:

```
Produced Counter
Counter ready
Incrementing count to 1
...
[Presence Simulator] Detected 2 new people. Total: 2
```

### ▶️ 2. Executar o Cliente (Consumidor)

```bash
node packages/cli/dist/cli.js --client-only examples/scripts/counter-client-original-preserved-autoexit.js
```

Resultado esperado no terminal:

```
count value is 0
count value after increment #1 is 1
count value after increment #2 (with step 3) is 4
count value after decrement is 4
Requested start of presence simulation.
[Property] Simulated presence count updated: 2
```

Se a atualização não chegar a tempo:

```
No update received from presenceCount. Exiting...
```

---

## 📄 Explicação das alterações ao código original

### ✅ Servient (`counter.js`)

| Alteração                 | Descrição                                                            |
| ------------------------- | -------------------------------------------------------------------- |
| `presenceCount`           | Nova propriedade `integer`, observável e read-only                   |
| `startPresenceSimulation` | Nova ação que incrementa aleatoriamente `presenceCount`              |
| Mantém `step`             | Ações `increment` e `decrement` usam `uriVariables` como no original |
| Sem `setInterval`         | Não simula continuamente; requer ativação via cliente                |

### ✅ Cliente (`counter-client.js`)

| Alteração                        | Descrição                                                  |
| -------------------------------- | ---------------------------------------------------------- |
| `startPresenceSimulation`        | Invocação da ação no servidor para iniciar simulação       |
| `observeProperty(presenceCount)` | Observa alterações ao contador de presenças                |
| `process.exit()`                 | Encerra automaticamente após atualizar ou por timeout (5s) |

---

## 📦 Estrutura Recomendada

```
wot_presence_simulator/
├── examples/scripts/
│   ├── counter-on-demand-simulation.js
│   ├── counter-client-original-preserved-autoexit.js
├── packages/cli/dist/cli.js
├── README.md
```

---

## 🧪 Testado com

-   `Node.js` 18+
-   `node-wot` com `@node-wot/core` e `@node-wot/binding-http` + `binding-coap`
-   CLI: `node packages/cli/dist/cli.js --client-only ...`

---

## 📚 Licenciamento

Baseado no exemplo oficial da [Eclipse Thingweb](https://github.com/eclipse-thingweb/node-wot), licenciado sob EPL-2.0 e W3C-20150513.

---

## ✍️ Autor da adaptação

Trabalho prático desenvolvido por **Duarte Cancela**, com apoio técnico do ChatGPT (OpenAI), com foco em compatibilidade total com o código original e funcionamento WoT observável.
