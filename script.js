document.addEventListener('DOMContentLoaded', () => {
    // --- INICIALIZAÇÃO DOS EVENTOS ---
    const form = document.getElementById('calcForm');
    if (form) {
        // Mudança: O evento principal agora é o submit do formulário
        form.addEventListener('submit', simular);
    }
    document.getElementById('usarLanceEmbutido').addEventListener('change', toggleLanceEmbutido);
    
    // Configura a máscara de moeda para os campos de valor
    setupCurrencyInput('valorCredito');
    setupCurrencyInput('valorLance');
});

// --- FUNÇÕES AUXILIARES DE FORMATAÇÃO ---
function setupCurrencyInput(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        e.target.value = value;
    });
}
function parseCurrency(value) {
    if (typeof value !== 'string' || !value) return 0;
    return parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}
function formatCurrency(value) {
    if (isNaN(value)) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatPercent(value, precision = 4) {
    if (isNaN(value)) return '0,0000%';
    return `${(value * 100).toFixed(precision).replace('.', ',')}%`;
}
function toggleLanceEmbutido() {
    const container = document.getElementById('lanceEmbutidoPercentContainer');
    container.classList.toggle('hidden', !this.checked);
    if (!this.checked) {
        document.getElementById('percentualLanceEmbutido').value = '';
    }
}
function toggleMemoriaVisibilidade() {
    const container = document.getElementById('memoriaCalculo');
    container.classList.toggle('hidden');
    // 'this' se refere ao botão que foi clicado
    this.textContent = container.classList.contains('hidden') ? "Deseja verificar a memória do cálculo?" : "Esconder memória de cálculo";
}

// --- COLETA DE DADOS DO FORMULÁRIO ---
function getInputs() {
    return {
        valorCredito: parseCurrency(document.getElementById('valorCredito').value),
        prazoTotal: parseInt(document.getElementById('prazoTotal').value, 10) || 0,
        parcelasPagas: parseInt(document.getElementById('parcelasPagas').value, 10) || 0,
        taxaAdm: (parseFloat(document.getElementById('taxaAdm').value) || 0) / 100,
        fundoReserva: (parseFloat(document.getElementById('fundoReserva').value) || 0) / 100,
        seguroVida: (parseFloat(document.getElementById('seguroVida').value) || 0) / 100,
        taxaAdmAdesao: (parseFloat(document.getElementById('taxaAdmAdesao').value) || 0) / 100,
        parcelasAdesao: parseInt(document.getElementById('parcelasAdesao').value, 10) || 0,
        tipoPlano: document.getElementById('tipoPlano').value,
        segmento: document.getElementById('segmento').value,
        valorLance: parseCurrency(document.getElementById('valorLance').value),
        usarLanceEmbutido: document.getElementById('usarLanceEmbutido').checked,
        percentualLanceEmbutido: (parseFloat(document.getElementById('percentualLanceEmbutido').value) || 0) / 100,
        tipoAbatimento: document.querySelector('input[name="tipoAbatimento"]:checked').value
    };
}

// --- FUNÇÃO PRINCIPAL DE SIMULAÇÃO ---
function simular(event) {
    event.preventDefault(); // Impede o envio do formulário, que é o comportamento padrão
    const inputs = getInputs();
    if (inputs.valorCredito <= 0 || inputs.prazoTotal <= 0) {
        alert('Por favor, preencha o Valor do Crédito e o Prazo Total com valores válidos.');
        return;
    }
    if (inputs.valorLance <= 0) {
        alert('Por favor, preencha o Valor do Lance.');
        return;
    }
    if (inputs.usarLanceEmbutido && inputs.percentualLanceEmbutido <= 0) {
        alert('Por favor, informe o percentual do crédito a ser usado no lance embutido.');
        return;
    }
    const resultado = calcularSimulacao(inputs);
    if (resultado) {
        exibirResultados(resultado);
    }
}

// --- MOTOR DE CÁLCULO ---
function calcularSimulacao(inputs) {
    const resultado = { 
        inputs,
        memoriaCalculo: []
    };

    const taxaAdmMensal = inputs.prazoTotal > 0 ? inputs.taxaAdm / inputs.prazoTotal : 0;
    const fundoReservaMensal = inputs.prazoTotal > 0 ? inputs.fundoReserva / inputs.prazoTotal : 0;
    const fundoComumMensal = inputs.prazoTotal > 0 ? 1.0 / inputs.prazoTotal : 0;

    let percentualPagoRealTA = taxaAdmMensal * inputs.parcelasPagas;
    if (inputs.taxaAdmAdesao > 0 && inputs.parcelasPagas > 0) {
        percentualPagoRealTA += inputs.taxaAdmAdesao;
    }
    const percentualPagoRealFC = fundoComumMensal * inputs.parcelasPagas;
    const percentualPagoRealFR = fundoReservaMensal * inputs.parcelasPagas;

    const saldoDevedorFCAntes = 1.0 - percentualPagoRealFC;
    const saldoDevedorTAAntes = inputs.taxaAdm - percentualPagoRealTA;
    const saldoDevedorFRAntes = inputs.fundoReserva - percentualPagoRealFR;
    let saldoDevedorPercAntes = saldoDevedorFCAntes + saldoDevedorTAAntes + saldoDevedorFRAntes;
    
    let fundoComumPercPagamento = 1.0;
    if (inputs.tipoPlano.includes('mais_por_menos')) {
        fundoComumPercPagamento = inputs.tipoPlano.includes('50') ? 0.50 : 0.75;
    }
    const taxaAdmMensalPagamento = (inputs.tipoPlano.includes('justo')) ? 0 : taxaAdmMensal;
    const idealMensalFCPagamento = inputs.prazoTotal > 0 ? fundoComumPercPagamento / inputs.prazoTotal : 0;
    const taxaAdesaoMensal = inputs.parcelasAdesao > 0 ? (inputs.taxaAdmAdesao / inputs.parcelasAdesao) : 0;
    let idealMensalTotalPagamento = idealMensalFCPagamento + taxaAdmMensalPagamento + fundoReservaMensal;
    if (inputs.taxaAdmAdesao > 0 && inputs.parcelasPagas < inputs.parcelasAdesao) {
        idealMensalTotalPagamento += taxaAdesaoMensal;
    }
    
    // Correção para planos Mais por Menos, adicionando a diferença no saldo devedor
    if (inputs.tipoPlano === "mais_por_menos_25") {
        saldoDevedorPercAntes += 0.25;
    } else if (inputs.tipoPlano === "mais_por_menos_50") {
        saldoDevedorPercAntes += 0.50;
    }

    resultado.antes = {
        parcela: inputs.valorCredito * (idealMensalTotalPagamento + inputs.seguroVida),
        prazoRestante: inputs.prazoTotal - inputs.parcelasPagas,
        saldoDevedorValor: saldoDevedorPercAntes * inputs.valorCredito,
        saldoDevedorPerc: saldoDevedorPercAntes,
        idealMensalFC: idealMensalFCPagamento,
        idealMensalTotal: idealMensalTotalPagamento
    };

    const percentualLanceTotal = inputs.valorCredito > 0 ? inputs.valorLance / inputs.valorCredito : 0;
    let valorLanceEmbutido = 0;
    if (inputs.usarLanceEmbutido) {
        valorLanceEmbutido = inputs.valorCredito * inputs.percentualLanceEmbutido;
    }
    const valorLanceRecursosProprios = inputs.valorLance - valorLanceEmbutido;
    if (valorLanceRecursosProprios < -0.01) {
        alert("O valor do lance embutido não pode ser maior que o valor total do lance.");
        return null;
    }

    resultado.depois = {
        creditoLiquido: inputs.valorCredito - valorLanceEmbutido,
        valorLanceEmbutido: valorLanceEmbutido,
        valorLanceRecursosProprios: valorLanceRecursosProprios,
    };
    
    resultado.memoriaCalculo.push(`<strong>Cálculo do Saldo Devedor (SD) Pós-Lance:</strong><br>
        &nbsp;&nbsp;SD Antes (Total): ${formatPercent(saldoDevedorPercAntes)}<br>
        &nbsp;&nbsp;Lance Ofertado: - ${formatPercent(percentualLanceTotal)}`);
    
    if (inputs.tipoAbatimento === 'prazo') {
        const idealMensalIntegral = fundoComumMensal + taxaAdmMensal + fundoReservaMensal;
        const valorParcelaIntegral = inputs.valorCredito * idealMensalIntegral;
        const parcelasQuitadas = valorParcelaIntegral > 0 ? Math.floor(inputs.valorLance / valorParcelaIntegral) : 0;
        
        resultado.depois.prazoRestante = resultado.antes.prazoRestante - parcelasQuitadas;
        resultado.depois.parcela = inputs.valorCredito * (idealMensalIntegral + inputs.seguroVida);
        resultado.depois.idealMensalFC = fundoComumMensal;
        resultado.depois.idealMensalTotal = idealMensalIntegral;
        resultado.depois.saldoDevedorPerc = saldoDevedorPercAntes - percentualLanceTotal;
        resultado.depois.saldoDevedorValor = resultado.depois.saldoDevedorPerc * inputs.valorCredito;

        resultado.memoriaCalculo.push(`&nbsp;&nbsp;= SD Depois (Total): <strong>${formatPercent(resultado.depois.saldoDevedorPerc)}</strong>`);
        resultado.memoriaCalculo.push(`<strong>Cálculo da Redução de Prazo:</strong><br>
        &nbsp;&nbsp;Ideal Mensal Integral (FC+TA+FR): ${formatPercent(idealMensalIntegral)}<br>
        &nbsp;&nbsp;Valor da Parcela Integral: ${formatCurrency(valorParcelaIntegral)}<br>
        &nbsp;&nbsp;Nº Parcelas Quitadas = ${formatCurrency(inputs.valorLance)} / ${formatCurrency(valorParcelaIntegral)} = <strong>${parcelasQuitadas} parcelas</strong><br>
        &nbsp;&nbsp;Novo Prazo = ${resultado.antes.prazoRestante} - ${parcelasQuitadas} = <strong>${resultado.depois.prazoRestante} meses</strong>`);

    } else { // tipoAbatimento === 'parcela'
        const propFCAntes = saldoDevedorPercAntes > 0 ? saldoDevedorFCAntes / saldoDevedorPercAntes : 0;
        const propTAAntes = saldoDevedorPercAntes > 0 ? saldoDevedorTAAntes / saldoDevedorPercAntes : 0;
        const propFRAntes = saldoDevedorPercAntes > 0 ? saldoDevedorFRAntes / saldoDevedorPercAntes : 0;

        const saldoDevedorFCDepois = saldoDevedorFCAntes - (percentualLanceTotal * propFCAntes);
        const saldoDevedorTADepois = saldoDevedorTAAntes - (percentualLanceTotal * propTAAntes);
        const saldoDevedorFRDepois = saldoDevedorFRAntes - (percentualLanceTotal * propFRAntes);
        
        let prazoRestanteTemp = resultado.antes.prazoRestante;
        
        let novoIdealFCDepois = prazoRestanteTemp > 0 ? saldoDevedorFCDepois / prazoRestanteTemp : 0;
        let novoIdealTADepois = prazoRestanteTemp > 0 ? saldoDevedorTADepois / prazoRestanteTemp : 0;
        let novoIdealFRDepois = prazoRestanteTemp > 0 ? saldoDevedorFRDepois / prazoRestanteTemp : 0;
        let novoIdealTotalDepois = novoIdealFCDepois + novoIdealTADepois + novoIdealFRDepois;
        
        resultado.memoriaCalculo.push(`&nbsp;&nbsp;= SD Depois (Total): <strong>${formatPercent(novoIdealTotalDepois * prazoRestanteTemp)}</strong>`);
        resultado.memoriaCalculo.push(`<strong>Cálculo dos Novos Ideais Mensais (Redução de Parcela):</strong><br>
        &nbsp;&nbsp;Novo Ideal FC = ${formatPercent(saldoDevedorFCDepois)} / ${prazoRestanteTemp} meses = <strong>${formatPercent(novoIdealFCDepois)}</strong><br>
        &nbsp;&nbsp;Novo Ideal TA = ${formatPercent(saldoDevedorTADepois)} / ${prazoRestanteTemp} meses = <strong>${formatPercent(novoIdealTADepois)}</strong><br>
        &nbsp;&nbsp;Novo Ideal FR = ${formatPercent(saldoDevedorFRDepois)} / ${prazoRestanteTemp} meses = <strong>${formatPercent(novoIdealFRDepois)}</strong><br>
        &nbsp;&nbsp;Novo Ideal Total (Soma) = <strong>${formatPercent(novoIdealTotalDepois)}</strong>`);

        let pisoFCMensalIdeal = 0;
        if (inputs.segmento === 'imovel') pisoFCMensalIdeal = 0.005;
        else if (inputs.segmento === 'pesados') pisoFCMensalIdeal = 0.0075;
        else pisoFCMensalIdeal = 0.01;

        if (novoIdealFCDepois < pisoFCMensalIdeal && saldoDevedorFCDepois > 0) {
            resultado.memoriaCalculo.push(`<strong>Lógica Híbrida Ativada (Piso Mínimo):</strong><br>
            &nbsp;&nbsp;Novo Ideal FC (${formatPercent(novoIdealFCDepois)}) é menor que o piso de ${formatPercent(pisoFCMensalIdeal)}.`);
            const idealFCParaPiso = pisoFCMensalIdeal;
            const propTaxasSobreFC = novoIdealFCDepois > 0 ? (novoIdealTADepois + novoIdealFRDepois) / novoIdealFCDepois : 0;
            const idealTaxasParaPiso = idealFCParaPiso * propTaxasSobreFC;
            const idealTotalPiso = idealFCParaPiso + idealTaxasParaPiso;
            const saldoDevedorParaPiso = idealTotalPiso * prazoRestanteTemp;
            const saldoDevedorAtual = novoIdealTotalDepois * prazoRestanteTemp;
            const excessoLancePerc = saldoDevedorParaPiso - saldoDevedorAtual;
            const parcelasQuitadasComExcesso = idealTotalPiso > 0 ? Math.floor(excessoLancePerc / idealTotalPiso) : 0;
            
            prazoRestanteTemp -= parcelasQuitadasComExcesso;
            novoIdealTotalDepois = idealTotalPiso;
            novoIdealFCDepois = idealFCParaPiso;
            resultado.memoriaCalculo.push(`&nbsp;&nbsp;Parcela recalculada para o piso e ${parcelasQuitadasComExcesso} parcelas quitadas com o excedente.`);
        }

        resultado.depois.prazoRestante = prazoRestanteTemp;
        resultado.depois.parcela = inputs.valorCredito * (novoIdealTotalDepois + inputs.seguroVida);
        resultado.depois.idealMensalFC = novoIdealFCDepois;
        resultado.depois.idealMensalTotal = novoIdealTotalDepois;
        resultado.depois.saldoDevedorPerc = prazoRestanteTemp > 0 ? novoIdealTotalDepois * prazoRestanteTemp : 0;
        resultado.depois.saldoDevedorValor = resultado.depois.saldoDevedorPerc * inputs.valorCredito;
    }
    
    const idealTaDepois = (resultado.antes.saldoDevedorPerc > 0) ? (saldoDevedorTAAntes / resultado.antes.saldoDevedorPerc) * (resultado.depois.saldoDevedorPerc / resultado.depois.prazoRestante) : 0;
    const idealFrDepois = (resultado.antes.saldoDevedorPerc > 0) ? (saldoDevedorFRAntes / resultado.antes.saldoDevedorPerc) * (resultado.depois.saldoDevedorPerc / resultado.depois.prazoRestante) : 0;
    
    resultado.detalhesParcela = {
        fc: resultado.depois.idealMensalFC * inputs.valorCredito,
        ta: idealTaDepois * inputs.valorCredito,
        fr: idealFrDepois * inputs.valorCredito,
        seguro: inputs.seguroVida * inputs.valorCredito
    };
    
    resultado.memoriaCalculo.push(`<strong>Cálculo do Valor da Nova Parcela:</strong><br>
    &nbsp;&nbsp;Valor = (Novo Ideal Total + Ideal Seguro) * Crédito<br>
    &nbsp;&nbsp;Valor = (${formatPercent(resultado.depois.idealMensalTotal)} + ${formatPercent(inputs.seguroVida)}) * ${formatCurrency(inputs.valorCredito)} = <strong>${formatCurrency(resultado.depois.parcela)}</strong>`);

    resultado.explicacao = gerarExplicacaoDetalhada(resultado);
    return resultado;
}


// --- FUNÇÃO PARA GERAR A EXPLICAÇÃO TEXTUAL ---
function gerarExplicacaoDetalhada(resultado) {
    const { inputs, antes, depois } = resultado;
    let html = '';
    html += `<li><strong>Situação Inicial:</strong> Sua dívida total (saldo devedor) era de <strong>${formatCurrency(antes.saldoDevedorValor)}</strong> (${formatPercent(antes.saldoDevedorPerc)} do plano), a ser paga em <strong>${antes.prazoRestante}</strong> meses.</li>`;
    if (inputs.tipoPlano.includes('mais_por_menos') || inputs.tipoPlano.includes('justo')) {
        html += `<li><strong>Ajuste do Plano:</strong> Na contemplação, suas parcelas futuras são sempre recalculadas com base em 100% do Fundo Comum e com a incidência total da Taxa de Administração.</li>`;
    }
    html += `<li><strong>Aplicação do Lance:</strong> Seu lance de <strong>${formatCurrency(inputs.valorLance)}</strong> (${formatPercent(inputs.valorLance / inputs.valorCredito)}) amortizou seu saldo devedor, que agora é de <strong>${formatCurrency(depois.saldoDevedorValor)}</strong> (${formatPercent(depois.saldoDevedorPerc)}).</li>`;
    if (inputs.tipoAbatimento === 'prazo') {
        const parcelasQuitadas = antes.prazoRestante - depois.prazoRestante;
        html += `<li><strong>Resultado (Redução de Prazo):</strong> O lance quitou <strong>${parcelasQuitadas}</strong> parcelas do final do seu contrato. Sua parcela mensal foi ajustada para o valor integral de <strong>${formatCurrency(depois.parcela)}</strong> e seu novo prazo restante é de <strong>${depois.prazoRestante}</strong> meses.</li>`;
    } else {
        html += `<li><strong>Resultado (Redução de Parcela):</strong> O saldo devedor amortizado foi diluído no prazo restante de <strong>${depois.prazoRestante}</strong> meses, resultando em uma nova parcela de <strong>${formatCurrency(depois.parcela)}</strong>. Se o lance foi alto e atingiu o piso mínimo de arrecadação, o valor excedente quitou parcelas do fim do plano.</li>`;
    }
    if (inputs.usarLanceEmbutido) {
        html += `<li><strong>Crédito Disponível:</strong> Do seu crédito de ${formatCurrency(inputs.valorCredito)}, foi usado ${formatCurrency(depois.valorLanceEmbutido)} como lance. O valor líquido disponível para a compra do bem é de <strong>${formatCurrency(depois.creditoLiquido)}</strong>.</li>`;
    }
    return html;
}

// --- FUNÇÃO PARA EXIBIR OS RESULTADOS ---
function exibirResultados(resultado) {
    if (!resultado) return;
    const resDiv = document.getElementById('resultado');

    // Insere toda a estrutura do resultado dinamicamente
    resDiv.innerHTML = `
        <h2>Análise Detalhada do seu Lance</h2>
        <div class="resultado-grid">
            <div class="resultado-col">
                <h3>Situação Atual (Antes do Lance)</h3>
                <p><strong>Ideal Mensal (Fundo Comum):</strong> <span id="resAntesIdealFC"></span></p>
                <p><strong>Ideal Mensal (Total):</strong> <span id="resAntesIdealTotal"></span></p>
                <p><strong>Valor da Parcela:</strong> <span id="resAntesParcela"></span></p>
                <p><strong>Prazo Restante:</strong> <span id="resAntesPrazo"></span></p>
                <p><strong>Saldo Devedor (Valor):</strong> <span id="resAntesSaldoValor"></span></p>
                <p><strong>Saldo Devedor (%):</strong> <span id="resAntesSaldoPerc"></span></p>
            </div>
            <div class="resultado-col">
                <h3>Nova Situação (Após o Lance)</h3>
                <p><strong>Novo Ideal Mensal (FC):</strong> <span id="resDepoisIdealFC"></span></p>
                <p><strong>Novo Ideal Mensal (Total):</strong> <span id="resDepoisIdealTotal"></span></p>
                <p><strong>Novo Valor da Parcela:</strong> <span id="resDepoisParcela"></span></p>
                <p><strong>Novo Prazo Restante:</strong> <span id="resDepoisPrazo"></span></p>
                <p><strong>Saldo Devedor Final (Valor):</strong> <span id="resDepoisSaldoValor"></span></p>
                <p><strong>Saldo Devedor Final (%):</strong> <span id="resDepoisSaldoPerc"></span></p>
                <p><strong>Crédito Líquido a Receber:</strong> <span id="resCreditoLiquido"></span></p>
            </div>
        </div>
        <div class="amortizacao-info">
            <h3>Demonstrativo de Amortização</h3>
            <p><strong>Lance Ofertado:</strong> <span id="resLanceInfo"></span></p>
            <p>↳ <strong>Recursos Próprios:</strong> <span id="resLanceProprio"></span></p>
            <p>↳ <strong>Lance Embutido:</strong> <span id="resLanceEmbutido"></span></p>
        </div>
        <div id="parcelaDetalhada">
             <h3>Detalhamento da Nova Parcela</h3>
            <p><strong>Fundo Comum:</strong> <span id="resDetalheFC"></span></p>
            <p><strong>Taxa de Administração:</strong> <span id="resDetalheTA"></span></p>
            <p><strong>Fundo de Reserva:</strong> <span id="resDetalheFR"></span></p>
            <p><strong>Seguro de Vida:</strong> <span id="resDetalheSeguro"></span></p>
        </div>
        <div class="explicacao">
            <h3>Luci Explica: Entenda o Cálculo</h3>
            <ol id="resExplicacao"></ol>
        </div>
        <button id="toggleMemoriaBtn" class="btn-memoria">Deseja verificar a memória do cálculo?</button>
        <div id="memoriaCalculo" class="memoria-calculo-container hidden">
            <h3>Memória de Cálculo</h3>
            <ol id="memoriaCalculoContent" class="breakdown"></ol>
        </div>
        <div class="alertas">
            <h4>Atenção às Regras do Consórcio!</h4>
            <ul>
                <li><strong>Análise de Crédito:</strong> A efetivação da contemplação e a liberação do crédito estão sujeitas à análise e aprovação cadastral, conforme a Cláusula 33.2 (p. 36 do Regulamento).</li>
                <li><strong>Disponibilidade de Caixa:</strong> A contemplação por lance, mesmo que vencedor, depende da disponibilidade de saldo de caixa do grupo na respectiva assembleia. (Cláusula 16, p. 21 do Regulamento).</li>
                <li><strong>Correção Monetária:</strong> Os valores aqui são uma simulação para hoje. Seu crédito, saldo devedor e parcelas são corrigidos periodicamente pelo índice do seu grupo (ex: INCC, IPCA), o que alterará os valores futuros. (Cláusula 3.2, p. 6 do Regulamento).</li>
            </ul>
        </div>
    `;

    // Preenche os spans com os resultados
    document.getElementById('resAntesIdealFC').textContent = formatPercent(resultado.antes.idealMensalFC);
    document.getElementById('resAntesIdealTotal').textContent = formatPercent(resultado.antes.idealMensalTotal);
    document.getElementById('resAntesParcela').textContent = formatCurrency(resultado.antes.parcela);
    document.getElementById('resAntesPrazo').textContent = `${resultado.antes.prazoRestante} meses`;
    document.getElementById('resAntesSaldoValor').textContent = formatCurrency(resultado.antes.saldoDevedorValor);
    document.getElementById('resAntesSaldoPerc').textContent = formatPercent(resultado.antes.saldoDevedorPerc);

    document.getElementById('resDepoisIdealFC').textContent = formatPercent(resultado.depois.idealMensalFC);
    document.getElementById('resDepoisIdealTotal').textContent = formatPercent(resultado.depois.idealMensalTotal);
    document.getElementById('resDepoisParcela').textContent = formatCurrency(resultado.depois.parcela);
    document.getElementById('resDepoisPrazo').textContent = `${resultado.depois.prazoRestante} meses`;
    document.getElementById('resDepoisSaldoValor').textContent = formatCurrency(resultado.depois.saldoDevedorValor);
    document.getElementById('resDepoisSaldoPerc').textContent = formatPercent(resultado.depois.saldoDevedorPerc);
    document.getElementById('resCreditoLiquido').textContent = formatCurrency(resultado.depois.creditoLiquido);
    
    document.getElementById('resLanceInfo').textContent = `${formatCurrency(resultado.inputs.valorLance)} (${formatPercent(resultado.inputs.valorLance / resultado.inputs.valorCredito)} do crédito)`;
    document.getElementById('resLanceProprio').textContent = formatCurrency(resultado.depois.valorLanceRecursosProprios);
    document.getElementById('resLanceEmbutido').textContent = formatCurrency(resultado.depois.valorLanceEmbutido);
    
    document.getElementById('resDetalheFC').textContent = formatCurrency(resultado.detalhesParcela.fc);
    document.getElementById('resDetalheTA').textContent = formatCurrency(resultado.detalhesParcela.ta);
    document.getElementById('resDetalheFR').textContent = formatCurrency(resultado.detalhesParcela.fr);
    document.getElementById('resDetalheSeguro').textContent = formatCurrency(resultado.detalhesParcela.seguro);
    
    document.getElementById('resExplicacao').innerHTML = resultado.explicacao;
    document.getElementById('memoriaCalculoContent').innerHTML = resultado.memoriaCalculo.join('<br>');
    
    // Adiciona o listener ao botão de memória APÓS ele ser criado
    document.getElementById('toggleMemoriaBtn').addEventListener('click', toggleMemoriaVisibilidade);

    resDiv.classList.remove('hidden');
    resDiv.scrollIntoView({ behavior: 'smooth' });
}

// Função para zerar o formulário
function zerar() {
    document.getElementById('calcForm').reset();
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('lanceEmbutidoPercentContainer').classList.add('hidden');
}