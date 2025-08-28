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

    formatCurrencyInput('valorCredito');
    formatCurrencyInput('valorParcelaAtual');
    formatCurrencyInput('saldoDevedorValor');

    function formatAsCurrency(value) {
        if (isNaN(value) || value === 0) return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- FUNÇÃO PRINCIPAL DE CÁLCULO (AO CLICAR NO BOTÃO) ---
    document.getElementById('btnCalcular').addEventListener('click', function () {
        
        const dadosCota = {
            valorCredito: parseFloat(document.getElementById('valorCredito').value.replace(/\./g, '').replace(',', '.')) || 0,
            saldoDevedorValor: parseFloat(document.getElementById('saldoDevedorValor').value.replace(/\./g, '').replace(',', '.')) || 0,
            saldoDevedorPercentual: parseFloat(document.getElementById('saldoDevedorPercentual').value) || 0,
            parcelasRestantes: parseInt(document.getElementById('parcelasRestantes').value) || 0,
            valorParcelaAtual: parseFloat(document.getElementById('valorParcelaAtual').value.replace(/\./g, '').replace(',', '.')) || 0,
            percentualFundoComumParcela: parseFloat(document.getElementById('percentualFundoComumParcela').value) || 0,
            percentualLance: (parseFloat(document.getElementById('percentualLance').value) || 0) / 100,
            regraMensalSegmento: parseFloat(document.getElementById('regraMensalSegmento').value) || 0
        };

        if (Object.values(dadosCota).some(v => v === 0)) {
            alert("Por favor, preencha todos os campos obrigatórios (*).");
            return;
        }

        const resultado = calcularRenegociacaoLance(dadosCota);
        const memoriaCalculoHTML = gerarMemoriaCalculoRenegociacao(dadosCota, resultado);

        const resultadoDiv = document.getElementById('result');
        resultadoDiv.innerHTML = `
            <div class="result-section" style="background-color: #e8f5e9;">
                <h3>Nova Parcela Estimada: <strong>${formatAsCurrency(parseFloat(resultado.novoValorParcela))}</strong></h3>
            </div>
            <div class="memoria-calculo-container">
                <button id="btnMemoria" class="btn-memoria">Ver Memória de Cálculo</button>
                <div id="memoriaCalculo" class="memoria-calculo-content" style="display: none;">
                    ${memoriaCalculoHTML}
                </div>
            </div>
        `;
        
        // Adiciona o evento de clique ao botão recém-criado
        document.getElementById('btnMemoria').addEventListener('click', function() {
            const memoriaDiv = document.getElementById('memoriaCalculo');
            const isVisible = memoriaDiv.style.display === 'block';
            memoriaDiv.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? 'Ver Memória de Cálculo' : 'Ocultar Memória de Cálculo';
        });
    });

    function calcularRenegociacaoLance(dadosCota) {
        // ... (a função de cálculo que você forneceu permanece exatamente a mesma aqui) ...
        const {
            valorCredito, saldoDevedorValor, saldoDevedorPercentual, parcelasRestantes,
            valorParcelaAtual, percentualFundoComumParcela, percentualLance, regraMensalSegmento
        } = dadosCota;

        const valorLance = valorCredito * percentualLance;
        const percentualAmortizadoPeloLance = (valorLance / valorParcelaAtual) * percentualFundoComumParcela;
        const novoSaldoDevedorPercentual = saldoDevedorPercentual - percentualAmortizadoPeloLance;
        const prazoCalculadoIdeal = novoSaldoDevedorPercentual / regraMensalSegmento;
        const prazoFinalParaCalculo = Math.min(prazoCalculadoIdeal, parcelasRestantes);
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

    function gerarMemoriaCalculoRenegociacao(dados, resultado) {
        return `
            <h4>Passo a Passo do Cálculo</h4>
            <ul class="breakdown">
                <li>
                    <span>1. Valor do Lance (R$)</span>
                    <small>${formatAsCurrency(dados.valorCredito)} (Crédito) × ${dados.percentualLance * 100}% (Lance)</small>
                    <span>${formatAsCurrency(resultado.valorLance)}</span>
                </li>
                <li>
                    <span>2. % Amortizado pelo Lance</span>
                    <small>(${formatAsCurrency(resultado.valorLance)} ÷ ${formatAsCurrency(dados.valorParcelaAtual)}) × ${dados.percentualFundoComumParcela.toFixed(4)}%</small>
                    <span>${resultado.percentualAmortizadoPeloLance.toFixed(4)}%</span>
                </li>
                <li>
                    <span>3. Novo Saldo Devedor (%)</span>
                    <small>${dados.saldoDevedorPercentual.toFixed(4)}% - ${resultado.percentualAmortizadoPeloLance.toFixed(4)}%</small>
                    <span>${resultado.novoSaldoDevedorPercentual.toFixed(4)}%</span>
                </li>
                 <li>
                    <span>4. Prazo para Cálculo (Meses)</span>
                    <small>Menor valor entre (Novo Saldo % ÷ Ideal Mensal) e Parcelas Restantes</small>
                    <span>${Math.round(resultado.prazoFinalParaCalculo)}</span>
                </li>
                <li>
                    <span>5. Novo Saldo Devedor (R$)</span>
                    <small>${formatAsCurrency(dados.saldoDevedorValor)} - ${formatAsCurrency(resultado.valorLance)}</small>
                    <span>${formatAsCurrency(resultado.novoSaldoDevedorValor)}</span>
                </li>
                <li>
                    <span><strong>6. Nova Parcela (R$)</strong></span>
                    <small>${formatAsCurrency(resultado.novoSaldoDevedorValor)} ÷ ${Math.round(resultado.prazoFinalParaCalculo)} meses</small>
                    <span><strong>${formatAsCurrency(parseFloat(resultado.novoValorParcela))}</strong></span>
                </li>
            </ul>
        `;
    }
});

function zerar() {
    // ... (função zerar permanece a mesma) ...
    document.querySelectorAll('.input-group input, .input-group select').forEach(el => {
        if (el.tagName === 'SELECT') {
            el.selectedIndex = 0;
        } else {
            el.value = '';
        }
    });
    document.getElementById('result').innerHTML = '';
}