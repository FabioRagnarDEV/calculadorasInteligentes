document.addEventListener('DOMContentLoaded', function () {

    // Função para formatar o campo de crédito em tempo real
    const creditoInput = document.getElementById('credito');
    creditoInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (!value) {
            e.target.value = '';
            return;
        }
        const numberValue = parseFloat(value) / 100;
        e.target.value = numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    });

    // Função principal de cálculo
    document.getElementById('btnCalcular').addEventListener('click', function () {
        // --- 1. CAPTURA DOS DADOS ---
        const creditoValue = document.getElementById('credito').value;
        const prazo = parseInt(document.getElementById('prazo').value);
        const taxaAdmin = parseFloat(document.getElementById('taxaAdmin').value) || 0;
        const fundoReserva = parseFloat(document.getElementById('fundoReserva').value) || 0;
        const mesContemplacao = parseInt(document.getElementById('mesContemplacao').value);
        const percentualReducao = parseFloat(document.getElementById('percentualReducao').value) || 25;

        const credito = parseFloat(creditoValue.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

        // Validação
        if (isNaN(credito) || isNaN(prazo) || isNaN(taxaAdmin) || isNaN(mesContemplacao)) {
            alert("Por favor, preencha todos os campos obrigatórios (*).");
            return;
        }
        if (mesContemplacao > prazo || mesContemplacao < 1) {
            alert("O mês da contemplação não pode ser maior que o prazo do plano.");
            return;
        }

        // --- 2. CÁLCULO DA PARCELA ANTES DA CONTEMPLAÇÃO ---
        const fundoComum = 100;
        const idealTotalPercentual = fundoComum + taxaAdmin + fundoReserva;
        const idealMensalPercentual = idealTotalPercentual / prazo;

        // Aplica a redução de 75% (1 - 0.25) ou 50% (1 - 0.50)
        const fatorReducao = 1 - (percentualReducao / 100);
        const idealMensalReduzido = idealMensalPercentual * fatorReducao;
        const parcelaReduzida = credito * (idealMensalReduzido / 100);

        // --- 3. CÁLCULO DA PARCELA APÓS A CONTEMPLAÇÃO ---
        
        // Valor total do plano
        const valorTotalPlano = credito * (idealTotalPercentual / 100);
        
        // Valor total pago até a contemplação
        const totalPagoAteContemplacao = parcelaReduzida * (mesContemplacao - 1);
        
        // Saldo devedor no momento da contemplação
        const saldoDevedorInicial = valorTotalPlano - totalPagoAteContemplacao;
        
        // Diferença dos 25% ou 50% que não foram pagos
        const diferencaAPagar = credito * (percentualReducao / 100);
        
        // Novo saldo devedor, incluindo a diferença
        const novoSaldoDevedor = saldoDevedorInicial + diferencaAPagar;
        
        // Parcelas restantes
        const parcelasRestantes = prazo - (mesContemplacao - 1);

        // Nova parcela cheia
        const novaParcelaCheia = novoSaldoDevedor / parcelasRestantes;
        
        // --- 4. EXIBIÇÃO DOS RESULTADOS ---
        const resultadoDiv = document.getElementById('result');
        resultadoDiv.innerHTML = `
            <div class="result-section" style="background-color: #e8f5e9;">
                <h3>Parcela Antes da Contemplação</h3>
                <p>${parcelaReduzida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div class="result-section" style="background-color: #fce4e4; margin-top: 15px;">
                <h3>Parcela Após Contemplação (a partir do mês ${mesContemplacao})</h3>
                <p>${novaParcelaCheia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <small>Considerando a diluição da diferença de ${percentualReducao}% nas parcelas restantes.</small>
            </div>
        `;
    });
});

function zerar() {
    document.querySelectorAll('.input-group input, .input-group select').forEach(el => el.value = '');
    document.getElementById('percentualReducao').value = '25'; // Reseta o select para 25%
    document.getElementById('result').innerHTML = '';
}