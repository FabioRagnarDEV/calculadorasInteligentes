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

    // --- FUNÇÃO PRINCIPAL DE CÁLCULO (AO CLICAR NO BOTÃO) ---
    document.getElementById('btnCalcular').addEventListener('click', function () {
        const valorCredito = parseFloat(document.getElementById('valorCredito').value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
        const prazo = parseInt(document.getElementById('prazo').value) || 0;
        const taxaAdminTotal = parseFloat(document.getElementById('taxaAdminTotal').value) || 0;
        const taxaAdminAntecipada = parseFloat(document.getElementById('taxaAdminAntecipada').value) || 0;
        const fundoReserva = parseFloat(document.getElementById('fundoReserva').value) || 0;
        const seguroMensal = parseFloat(document.getElementById('seguro').value.replace(/\./g, '').replace(',', '.')) || 0;
        const parcelasAntecipadas = parseInt(document.getElementById('parcelasAntecipadas').value) || 0;

        if (!valorCredito || !prazo || !taxaAdminTotal) {
            alert("Por favor, preencha os campos obrigatórios (*).");
            return;
        }

        const totalFundoComum = valorCredito;
        const totalFundoReserva = (fundoReserva / 100) * valorCredito;
        const totalAdmin = (taxaAdminTotal / 100) * valorCredito;
        const totalAdminAntecipado = (taxaAdminAntecipada / 100) * valorCredito;
        const totalAdminRestante = totalAdmin - totalAdminAntecipado;

        const fundoComumMensal = totalFundoComum / prazo;
        const fundoReservaMensal = totalFundoReserva / prazo;
        const adminAntecipadoMensal = parcelasAntecipadas > 0 ? totalAdminAntecipado / parcelasAntecipadas : 0;
        const prazoRestante = prazo - parcelasAntecipadas;
        const adminRestanteMensal = prazoRestante > 0 ? totalAdminRestante / prazoRestante : 0;

        const parcelaInicial = fundoComumMensal + fundoReservaMensal + adminAntecipadoMensal + seguroMensal;
        const parcelaRestante = fundoComumMensal + fundoReservaMensal + adminRestanteMensal + seguroMensal;

        // --- EXIBIÇÃO DOS RESULTADOS DETALHADOS ---
        const resultadoDiv = document.getElementById('result');
        let htmlResultado = '';

        if (parcelasAntecipadas > 0 && totalAdminAntecipado > 0) {
            htmlResultado += `
                <div class="result-section" style="background-color: #fff0e1;">
                    <h3>Valor das ${parcelasAntecipadas} primeiras parcelas: <strong>${formatAsCurrency(parcelaInicial)}</strong></h3>
                    <ul class="breakdown">
                        <li><span>Fundo Comum:</span> ${formatAsCurrency(fundoComumMensal)}</li>
                        <li><span>Taxa de Adm. (Antecipada):</span> ${formatAsCurrency(adminAntecipadoMensal)}</li>
                        ${fundoReservaMensal > 0 ? `<li><span>Fundo de Reserva:</span> ${formatAsCurrency(fundoReservaMensal)}</li>` : ''}
                        ${seguroMensal > 0 ? `<li><span>Seguro:</span> ${formatAsCurrency(seguroMensal)}</li>` : ''}
                    </ul>
                </div>
                <div class="result-section" style="background-color: #e8f5e9; margin-top: 15px;">
                    <h3>Valor das ${prazoRestante} parcelas restantes: <strong>${formatAsCurrency(parcelaRestante)}</strong></h3>
                    <ul class="breakdown">
                        <li><span>Fundo Comum:</span> ${formatAsCurrency(fundoComumMensal)}</li>
                        <li><span>Taxa de Adm. (Restante):</span> ${formatAsCurrency(adminRestanteMensal)}</li>
                        ${fundoReservaMensal > 0 ? `<li><span>Fundo de Reserva:</span> ${formatAsCurrency(fundoReservaMensal)}</li>` : ''}
                        ${seguroMensal > 0 ? `<li><span>Seguro:</span> ${formatAsCurrency(seguroMensal)}</li>` : ''}
                    </ul>
                </div>
            `;
        } else {
            htmlResultado += `
                 <div class="result-section" style="background-color: #e8f5e9;">
                    <h3>Valor da Parcela: <strong>${formatAsCurrency(parcelaRestante)}</strong></h3>
                     <ul class="breakdown">
                        <li><span>Fundo Comum:</span> ${formatAsCurrency(fundoComumMensal)}</li>
                        <li><span>Taxa de Adm.:</span> ${formatAsCurrency(adminRestanteMensal)}</li>
                        ${fundoReservaMensal > 0 ? `<li><span>Fundo de Reserva:</span> ${formatAsCurrency(fundoReservaMensal)}</li>` : ''}
                        ${seguroMensal > 0 ? `<li><span>Seguro:</span> ${formatAsCurrency(seguroMensal)}</li>` : ''}
                    </ul>
                </div>
            `;
        }
        
        resultadoDiv.innerHTML = htmlResultado;
    });
});

function zerar() {
    document.querySelectorAll('.input-group input').forEach(input => input.value = '');
    document.querySelectorAll('.currency-preview').forEach(preview => preview.textContent = '');
    document.getElementById('result').innerHTML = '';
}