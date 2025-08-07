document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA DE ATUALIZAÇÃO DE VALORES EM TEMPO REAL ---
    const inputsToWatch = ['valorCredito', 'taxaAdminTotal', 'taxaAdminAntecipada', 'fundoReserva'];
    inputsToWatch.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateCurrencyPreviews);
        }
    });

    function updateCurrencyPreviews() {
        const valorCredito = parseFloat(document.getElementById('valorCredito').value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;

        const taxaAdminTotalPercent = parseFloat(document.getElementById('taxaAdminTotal').value) || 0;
        document.getElementById('taxaAdminTotalValue').textContent = formatAsCurrency(valorCredito * (taxaAdminTotalPercent / 100));

        const taxaAdminAntecipadaPercent = parseFloat(document.getElementById('taxaAdminAntecipada').value) || 0;
        document.getElementById('taxaAdminAntecipadaValue').textContent = formatAsCurrency(valorCredito * (taxaAdminAntecipadaPercent / 100));

        const fundoReservaPercent = parseFloat(document.getElementById('fundoReserva').value) || 0;
        document.getElementById('fundoReservaValue').textContent = formatAsCurrency(valorCredito * (fundoReservaPercent / 100));
    }
    
    // --- FUNÇÕES DE FORMATAÇÃO DE MOEDA ---
    function formatCurrencyInput(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (!value) { e.target.value = ''; return; }
            const numberValue = parseFloat(value) / 100;
            e.target.value = (inputId === 'valorCredito') 
                ? numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        });
    }
    formatCurrencyInput('valorCredito');
    formatCurrencyInput('seguro');
    
    function formatAsCurrency(value) {
        if (isNaN(value) || value === 0) return '';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- FUNÇÃO PRINCIPAL DE CÁLCULO ---
    document.getElementById('btnCalcular').addEventListener('click', function () {
        const valorCredito = parseFloat(document.getElementById('valorCredito').value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
        const prazo = parseInt(document.getElementById('prazo').value) || 0;
        const taxaAdminTotal = parseFloat(document.getElementById('taxaAdminTotal').value) || 0;
        const taxaAdminAntecipada = parseFloat(document.getElementById('taxaAdminAntecipada').value) || 0;
        const fundoReserva = parseFloat(document.getElementById('fundoReserva').value) || 0;
        const seguroMensal = parseFloat(document.getElementById('seguro').value.replace(/\./g, '').replace(',', '.')) || 0;
        const parcelasAntecipadas = parseInt(document.getElementById('parcelasAntecipadas').value) || 0;
        const mesContemplacao = parseInt(document.getElementById('mesContemplacao').value) || 0;
        const percentualPlano = parseFloat(document.getElementById('percentualPlano').value) || 0.75;

        if (!valorCredito || !prazo || !taxaAdminTotal) {
            alert("Por favor, preencha os campos obrigatórios (*).");
            return;
        }

        // --- CÁLCULOS ---
        const totalFundoReserva = (fundoReserva / 100) * valorCredito;
        const totalAdmin = (taxaAdminTotal / 100) * valorCredito;
        const totalAdminAntecipado = (taxaAdminAntecipada / 100) * valorCredito;
        const totalAdminRestante = totalAdmin - totalAdminAntecipado;

        const fcMensalReduzido = (percentualPlano * valorCredito) / prazo;
        const frMensalReduzido = (percentualPlano * totalFundoReserva) / prazo;
        const adminAntecipadoMensal = parcelasAntecipadas > 0 ? totalAdminAntecipado / parcelasAntecipadas : 0;
        const prazoRestanteTA = prazo - parcelasAntecipadas;
        const adminRestanteMensal = prazoRestanteTA > 0 ? totalAdminRestante / prazoRestanteTA : 0;

        const parcelaInicialAntes = fcMensalReduzido + frMensalReduzido + adminAntecipadoMensal + seguroMensal;
        const parcelaRestanteAntes = fcMensalReduzido + frMensalReduzido + adminRestanteMensal + seguroMensal;

        let parcelaAposContemplacao = 0;
        let fcTotalMensal, frTotalMensal, adminTotalMensal, diluicaoFCMensal, diluicaoFRMensal;

        if (mesContemplacao > 0 && mesContemplacao < prazo) {
            const percentualFaltante = 1 - percentualPlano;
            const parcelasRestantesPlano = prazo - mesContemplacao;
            
            const diferencaFC = percentualFaltante * valorCredito;
            const diferencaFR = percentualFaltante * totalFundoReserva;
        
            diluicaoFCMensal = diferencaFC / parcelasRestantesPlano;
            diluicaoFRMensal = diferencaFR / parcelasRestantesPlano;
            
            adminTotalMensal = totalAdmin / prazo;
            fcTotalMensal = valorCredito / prazo;
            frTotalMensal = totalFundoReserva / prazo;
        
            parcelaAposContemplacao = fcTotalMensal + frTotalMensal + adminTotalMensal + seguroMensal + diluicaoFCMensal + diluicaoFRMensal;
        }
        
        // --- EXIBIÇÃO DOS RESULTADOS DETALHADOS ---
        const resultadoDiv = document.getElementById('result');
        let htmlResultado = '<h3>Antes da Contemplação:</h3>';

        if (parcelasAntecipadas > 0 && totalAdminAntecipado > 0) {
            htmlResultado += `
                <div class="result-section" style="background-color: #e8f5e9;">
                    <p>Valor das <strong>${parcelasAntecipadas}</strong> primeiras parcelas: <strong>${formatAsCurrency(parcelaInicialAntes)}</strong></p>
                    <ul class="breakdown">
                        <li><span>Fundo Comum (Reduzido):</span> ${formatAsCurrency(fcMensalReduzido)}</li>
                        <li><span>Fundo de Reserva (Reduzido):</span> ${formatAsCurrency(frMensalReduzido)}</li>
                        <li><span>Taxa de Adm. (Antecipada):</span> ${formatAsCurrency(adminAntecipadoMensal)}</li>
                        ${seguroMensal > 0 ? `<li><span>Seguro:</span> ${formatAsCurrency(seguroMensal)}</li>` : ''}
                    </ul>
                </div>
                 <div class="result-section" style="background-color: #e8f5e9; margin-top: 5px;">
                    <p>Valor das parcelas seguintes: <strong>${formatAsCurrency(parcelaRestanteAntes)}</strong></p>
                    <ul class="breakdown">
                        <li><span>Fundo Comum (Reduzido):</span> ${formatAsCurrency(fcMensalReduzido)}</li>
                        <li><span>Fundo de Reserva (Reduzido):</span> ${formatAsCurrency(frMensalReduzido)}</li>
                        <li><span>Taxa de Adm. (Restante):</span> ${formatAsCurrency(adminRestanteMensal)}</li>
                        ${seguroMensal > 0 ? `<li><span>Seguro:</span> ${formatAsCurrency(seguroMensal)}</li>` : ''}
                    </ul>
                </div>`;
        } else {
            htmlResultado += `
                <div class="result-section" style="background-color: #e8f5e9;">
                    <p>Valor da Parcela: <strong>${formatAsCurrency(parcelaRestanteAntes)}</strong></p>
                    <ul class="breakdown">
                        <li><span>Fundo Comum (Reduzido):</span> ${formatAsCurrency(fcMensalReduzido)}</li>
                        <li><span>Fundo de Reserva (Reduzido):</span> ${formatAsCurrency(frMensalReduzido)}</li>
                        <li><span>Taxa de Adm.:</span> ${formatAsCurrency(adminRestanteMensal)}</li>
                        ${seguroMensal > 0 ? `<li><span>Seguro:</span> ${formatAsCurrency(seguroMensal)}</li>` : ''}
                    </ul>
                </div>`;
        }

        if (parcelaAposContemplacao > 0) {
            htmlResultado += `<h3 style="margin-top: 20px;">Após Contemplação (Sorteio no mês ${mesContemplacao}):</h3>
                <div class="result-section" style="background-color: #fce4e4;">
                     <p>Novo valor da parcela: <strong>${formatAsCurrency(parcelaAposContemplacao)}</strong></p>
                     <ul class="breakdown">
                        <li><span>Fundo Comum (100%):</span> ${formatAsCurrency(fcTotalMensal)}</li>
                        <li><span>Fundo de Reserva (100%):</span> ${formatAsCurrency(frTotalMensal)}</li>
                        <li><span>Taxa de Adm. (Total):</span> ${formatAsCurrency(adminTotalMensal)}</li>
                        <li><span>Diluição Fundo Comum:</span> ${formatAsCurrency(diluicaoFCMensal)}</li>
                        <li><span>Diluição Fundo Reserva:</span> ${formatAsCurrency(diluicaoFRMensal)}</li>
                        ${seguroMensal > 0 ? `<li><span>Seguro:</span> ${formatAsCurrency(seguroMensal)}</li>` : ''}
                    </ul>
                     <small>(Considerando diluição da diferença nas ${prazo - mesContemplacao} parcelas restantes)</small>
                </div>`;
        }
        resultadoDiv.innerHTML = htmlResultado;
    });
});

function zerar() {
    document.querySelectorAll('.input-group input, .input-group select').forEach(input => input.value = '');
    document.querySelectorAll('.currency-preview').forEach(preview => preview.textContent = '');
    document.getElementById('percentualPlano').value = '0.75';
    document.getElementById('result').innerHTML = '';
}