document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA DE ATUALIZAÇÃO EM TEMPO REAL ---

    const inputsToWatch = [
        'valorCredito',
        'taxaAdminTotal',
        'taxaAdminAntecipada',
        'fundoReserva'
    ];

    inputsToWatch.forEach(id => {
        document.getElementById(id).addEventListener('input', updateCurrencyPreviews);
    });

    function updateCurrencyPreviews() {
        const valorCredito = parseFloat(document.getElementById('valorCredito').value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;

        // Taxa de Adm Total
        const taxaAdminTotalPercent = parseFloat(document.getElementById('taxaAdminTotal').value) || 0;
        const taxaAdminTotalValue = valorCredito * (taxaAdminTotalPercent / 100);
        document.getElementById('taxaAdminTotalValue').textContent = formatAsCurrency(taxaAdminTotalValue);

        // Taxa de Adm Antecipada
        const taxaAdminAntecipadaPercent = parseFloat(document.getElementById('taxaAdminAntecipada').value) || 0;
        const taxaAdminAntecipadaValue = valorCredito * (taxaAdminAntecipadaPercent / 100);
        document.getElementById('taxaAdminAntecipadaValue').textContent = formatAsCurrency(taxaAdminAntecipadaValue);

        // Fundo de Reserva
        const fundoReservaPercent = parseFloat(document.getElementById('fundoReserva').value) || 0;
        const fundoReservaValue = valorCredito * (fundoReservaPercent / 100);
        document.getElementById('fundoReservaValue').textContent = formatAsCurrency(fundoReservaValue);
    }

    function formatAsCurrency(value) {
        if (isNaN(value) || value === 0) {
            return '';
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    
    // --- FUNÇÕES DE FORMATAÇÃO DE MOEDA NOS INPUTS ---
    
    function formatCurrencyInput(inputId) {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (!value) {
                e.target.value = '';
                return;
            }
            const numberValue = parseFloat(value) / 100;
            // Formata com R$ apenas se for o campo de crédito principal
            if (inputId === 'valorCredito') {
                 e.target.value = numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            } else {
                 e.target.value = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        });
    }

    formatCurrencyInput('valorCredito');
    formatCurrencyInput('seguro');

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

        const resultadoDiv = document.getElementById('result');
        let htmlResultado = '';

        if (parcelasAntecipadas > 0 && totalAdminAntecipado > 0) {
            htmlResultado += `
                <div class="result-section" style="background-color: #fff0e1;">
                    <h3>Valor das ${parcelasAntecipadas} primeiras parcelas</h3>
                    <p>${parcelaInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div class="result-section" style="background-color: #e8f5e9; margin-top: 15px;">
                    <h3>Valor das ${prazoRestante} parcelas restantes</h3>
                    <p>${parcelaRestante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            `;
        } else {
            htmlResultado += `
                 <div class="result-section" style="background-color: #e8f5e9;">
                    <h3>Valor da Parcela</h3>
                    <p>${parcelaRestante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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