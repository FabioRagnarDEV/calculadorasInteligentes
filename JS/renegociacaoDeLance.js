document.addEventListener('DOMContentLoaded', function () {

    // --- FUNÇÕES DE FORMATAÇÃO DE MOEDA (EM TEMPO REAL) ---
    function formatCurrencyInput(inputId) {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (!value) { e.target.value = ''; return; }
            const numberValue = parseFloat(value) / 100;
            e.target.value = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        });
    }

    // Aplica a formatação aos campos de valor
    formatCurrencyInput('valorCredito');
    formatCurrencyInput('valorParcelaAtual');
    formatCurrencyInput('saldoDevedorValor');

    function formatAsCurrency(value) {
        if (isNaN(value) || value === 0) return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- FUNÇÃO PRINCIPAL DE CÁLCULO (AO CLICAR NO BOTÃO) ---
    document.getElementById('btnCalcular').addEventListener('click', function () {
        
        // --- CAPTURA E LIMPEZA DOS DADOS DO FORMULÁRIO ---
        const dadosCota = {
            valorCredito: parseFloat(document.getElementById('valorCredito').value.replace(/\./g, '').replace(',', '.')) || 0,
            saldoDevedorValor: parseFloat(document.getElementById('saldoDevedorValor').value.replace(/\./g, '').replace(',', '.')) || 0,
            saldoDevedorPercentual: parseFloat(document.getElementById('saldoDevedorPercentual').value) || 0,
            parcelasRestantes: parseInt(document.getElementById('parcelasRestantes').value) || 0,
            valorParcelaAtual: parseFloat(document.getElementById('valorParcelaAtual').value.replace(/\./g, '').replace(',', '.')) || 0,
            percentualFundoComumParcela: parseFloat(document.getElementById('percentualFundoComumParcela').value) || 0,
            percentualLance: (parseFloat(document.getElementById('percentualLance').value) || 0) / 100, // Converte para decimal
            regraMensalSegmento: parseFloat(document.getElementById('regraMensalSegmento').value) || 0
        };

        // Validação
        if (Object.values(dadosCota).some(v => v === 0)) {
            alert("Por favor, preencha todos os campos obrigatórios (*).");
            return;
        }

        // --- CÁLCULO USANDO A LÓGICA FORNECIDA ---
        const resultado = calcularRenegociacaoLance(dadosCota);

        // --- EXIBIÇÃO DO RESULTADO DETALHADO ---
        const resultadoDiv = document.getElementById('result');
        resultadoDiv.innerHTML = `
            <div class="result-section" style="background-color: #e8f5e9;">
                <h3>Nova Parcela Estimada: <strong>${formatAsCurrency(parseFloat(resultado.novoValorParcela))}</strong></h3>
                <ul class="breakdown">
                    <li><span>Valor do Lance Considerado:</span> ${formatAsCurrency(resultado.valorLance)}</li>
                    <li><span>Percentual Amortizado pelo Lance:</span> ${resultado.percentualAmortizadoPeloLance.toFixed(4)}%</li>
                    <li><span>Novo Saldo Devedor (Percentual):</span> ${resultado.novoSaldoDevedorPercentual.toFixed(4)}%</li>
                    <li><span>Novo Saldo Devedor (Valor):</span> ${formatAsCurrency(resultado.novoSaldoDevedorValor)}</li>
                     <li><span>Prazo Utilizado para Cálculo:</span> ${Math.round(resultado.prazoFinalParaCalculo)} meses</li>
                </ul>
            </div>
        `;
    });

    /**
     * Adaptação da função de cálculo para o ambiente da calculadora.
     * @param {object} dadosCota - Objeto com os dados da cota.
     * @returns {object} Um objeto com o resultado final e os passos do cálculo.
     */
    function calcularRenegociacaoLance(dadosCota) {
        const {
            valorCredito, saldoDevedorValor, saldoDevedorPercentual, parcelasRestantes,
            valorParcelaAtual, percentualFundoComumParcela, percentualLance, regraMensalSegmento
        } = dadosCota;

        const valorLance = valorCredito * percentualLance;

        // Passo 1: Converter o Valor do Lance (R$) em Percentual de Amortização (%)
        const percentualAmortizadoPeloLance = (valorLance / valorParcelaAtual) * percentualFundoComumParcela;

        // Passo 2: Calcular o Novo Saldo Devedor (em Percentual)
        const novoSaldoDevedorPercentual = saldoDevedorPercentual - percentualAmortizadoPeloLance;

        // Passo 3: Verificar a "Pegadinha" do Prazo
        const prazoCalculadoIdeal = novoSaldoDevedorPercentual / regraMensalSegmento;
        const prazoFinalParaCalculo = Math.min(prazoCalculadoIdeal, parcelasRestantes);

        // Passo 4: Calcular o Novo Valor da Parcela
        const novoSaldoDevedorValor = saldoDevedorValor - valorLance;
        const novoValorParcela = novoSaldoDevedorValor / prazoFinalParaCalculo;

        return {
            novoValorParcela: novoValorParcela.toFixed(2),
            valorLance: valorLance,
            percentualAmortizadoPeloLance: percentualAmortizadoPeloLance,
            novoSaldoDevedorPercentual: novoSaldoDevedorPercentual,
            novoSaldoDevedorValor: novoSaldoDevedorValor,
            prazoFinalParaCalculo: prazoFinalParaCalculo
        };
    }
});

function zerar() {
    document.querySelectorAll('.input-group input, .input-group select').forEach(el => {
        if (el.tagName === 'SELECT') {
            el.selectedIndex = 0;
        } else {
            el.value = '';
        }
    });
    document.getElementById('result').innerHTML = '';
}