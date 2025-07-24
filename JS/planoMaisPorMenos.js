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
        if (mesContemplacao >= prazo || mesContemplacao < 1) {
            alert("O mês da contemplação deve ser menor que o prazo do plano.");
            return;
        }

        // --- 2. CÁLCULO DA PARCELA ANTES DA CONTEMPLAÇÃO ---
        const fundoComum = 100;
        const idealTotalPercentual = fundoComum + taxaAdmin + fundoReserva;
        const idealMensalPercentual = idealTotalPercentual / prazo;
        
        const fatorReducao = 1 - (percentualReducao / 100);
        const idealMensalReduzido = idealMensalPercentual * fatorReducao;
        const parcelaReduzida = credito * (idealMensalReduzido / 100);

        // --- 3. CÁLCULO DA PARCELA APÓS A CONTEMPLAÇÃO (CORRIGIDO) ---
        
        // Parcela cheia (sem a redução)
        const parcelaCheia = credito * (idealMensalPercentual / 100);

        // Valor total da diferença que deixou de ser paga
        const diferencaTotal = credito * (percentualReducao / 100);

        // Parcelas restantes a partir da assembleia seguinte à da contemplação
        const parcelasRestantes = prazo - mesContemplacao;

        // Valor da diferença a ser diluído mensalmente
        const valorDiluidoMensal = parcelasRestantes > 0 ? diferencaTotal / parcelasRestantes : 0;

        // Nova parcela cheia final
        const novaParcelaCheia = parcelaCheia + valorDiluidoMensal;
        
        // --- 4. EXIBIÇÃO DOS RESULTADOS ---
        const resultadoDiv = document.getElementById('result');
        resultadoDiv.innerHTML = `
            <div class="result-section" style="background-color: #e8f5e9;">
                <h3>Parcela Antes da Contemplação</h3>
                <p>${parcelaReduzida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div class="result-section" style="background-color: #fce4e4; margin-top: 15px;">
                <h3>Parcela Após Contemplação (a partir da parcela ${mesContemplacao + 1})</h3>
                <p>${novaParcelaCheia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <small>Parcela cheia + diluição da diferença de ${percentualReducao}% nas ${parcelasRestantes} parcelas restantes.</small>
            </div>
        `;
    });
});

function zerar() {
    document.querySelectorAll('.input-group input, .input-group select').forEach(el => el.value = '');
    document.getElementById('percentualReducao').value = '25';
    document.getElementById('result').innerHTML = '';
}