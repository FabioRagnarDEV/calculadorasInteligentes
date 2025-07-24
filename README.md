# 📊 Calculadoras Inteligentes Embracon

![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-brightgreen.svg)
![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow.svg)

## 🎯 Sobre o Projeto

**Calculadoras Inteligentes** é uma suíte de ferramentas web desenvolvida para simplificar e automatizar cálculos complexos relacionados a produtos de consórcio da Embracon. O objetivo é fornecer aos colaboradores uma interface rápida, intuitiva e precisa, reduzindo o tempo gasto em cálculos manuais e minimizando a chance de erros.

A aplicação web é totalmente responsiva, adaptando-se a desktops, tablets e smartphones.

---

## ✨ Funcionalidades Implementadas

O projeto conta com diversas calculadoras, cada uma com um propósito específico para atender às necessidades do dia a dia.

### 🏠 Página Inicial
A porta de entrada da aplicação.
- **Boas-vindas Personalizada:** Coleta o nome do usuário para oferecer uma saudação customizada, melhorando a experiência de uso.
- **Navegação Centralizada:** Apresenta um menu claro e objetivo com botões que levam a cada uma das calculadoras disponíveis.

### 1. 📉 Calculadora de Percentual de Saldo Devedor
Esta ferramenta calcula o percentual exato do saldo devedor de um consorciado.
- **Lógica:** O usuário insere os percentuais totais contratados (Fundo Comum, Taxa de Administração, Fundo de Reserva, etc.) e os percentuais já pagos para cada um desses itens. A calculadora então subtrai o total pago do total contratado para encontrar o percentual exato que ainda resta a ser quitado.

### 2. 💸 Calculadora de Pagamento a Maior
Ideal para situações em que o cliente já quitou 100% do plano e continuou pagando.
- **Lógica:** O usuário informa o "Percentual Pago" (ex: 102,5%) e o "Valor do Bem". A calculadora identifica o percentual excedente (neste caso, 2,5%) e o aplica sobre o valor do bem para determinar o montante exato a ser devolvido ao consorciado.

### 3. ↩️ Calculadora de Devolução de Valores (Cancelados/Excluídos)
Calcula o valor a ser restituído a um cliente que cancelou seu plano de consórcio.
- **Lógica:** A calculadora recebe o "Crédito Atualizado" e o "Percentual do Fundo Comum" pago pelo cliente. Com base nesse percentual, ela aplica uma multa contratual (que varia de acordo com a faixa de percentual pago) e retorna o valor líquido que o cliente tem direito a receber.

### 4. 📝 Calculadora de Planos
Um menu dedicado para simulações de diferentes modalidades de planos de consórcio.

#### **Plano Convencional**
- **Função:** Simula o valor da parcela de um plano de consórcio tradicional.
- **Lógica:** O cálculo é baseado no método de "Ideal Mensal". Primeiro, somam-se todos os percentuais (Fundo Comum, Taxa Adm., Fundo de Reserva e Taxa Adm. Antecipada) para obter o "Ideal Total". Esse total é dividido pelo prazo do plano para encontrar o "Ideal Mensal", que, por fim, é multiplicado pelo valor do crédito para definir o valor da parcela.

#### **Plano Mais por Menos (25% e 50%)**
- **Função:** Calcula o valor da parcela para planos com redução antes da contemplação.
- **Lógica:**
    1.  **Parcela Reduzida (Pré-Contemplação):** Calcula o "Ideal Mensal" (como no plano convencional) e aplica sobre ele um redutor (paga-se apenas 75% ou 50% do valor).
    2.  **Parcela Cheia (Pós-Contemplação):** Após a contemplação, a diferença do percentual que não foi pago (25% ou 50% do valor do crédito) é calculada e diluída de forma linear nas parcelas restantes, que agora são somadas à parcela cheia (100%).

### 5. 🔄 Renegociação de Lance
Uma ferramenta para simular os resultados da renegociação de um lance ofertado pelo cliente.
- **Lógica (prevista):** Com base no valor do lance, no valor da parcela atual e no saldo devedor, a calculadora irá projetar as novas condições do plano, como a redução do prazo ou a diluição do valor nas parcelas futuras.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - ![HTML5](https://img.shields.io/badge/HTML-5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  - ![CSS3](https://img.shields.io/badge/CSS-3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  - ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 Como Usar

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/FabioRagnarDEV/calculadorasInteligentes.git](https://github.com/FabioRagnarDEV/calculadorasInteligentes.git)
    ```
2.  Abra o arquivo `index.html` em seu navegador de preferência.
3.  Navegue pelas opções e utilize a calculadora desejada.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por **Fábio França (SAC Eletrônico)**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-fabio--franca-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fabio-fran%C3%A7a-9a332131b/)
[![GitHub](https://img.shields.io/badge/GitHub-FabioRagnarDEV-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/FabioRagnarDEV/)
