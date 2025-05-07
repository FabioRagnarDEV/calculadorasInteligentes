function parseValorReais(valorStr) {
    if (!valorStr) return 0;
    return parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
}

function formatReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPercentual(valor, casas) {
    return valor.toFixed(casas);
}

// Função para exibir o novo modal de alerta centralizado
function showCustomAlert(message) {
    document.getElementById('customAlertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'flex';
}
document.getElementById('customAlertOK').addEventListener('click', function () {
    document.getElementById('customAlert').style.display = 'none';
});

// Validação visual dos obrigatórios e cálculo
document.getElementById('btnCalcular').addEventListener('click', function (event) {
    event.preventDefault();

    const inputs = document.querySelectorAll('input[required], select[required]');
    let allValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            allValid = false;
        } else {
            input.style.borderColor = '';
        }
    });

    if (!allValid) {
        showCustomAlert('Por favor, preencha todos os campos obrigatórios marcados com *.');
        return;
    }

    // --- CÁLCULO ---
    const valorLance        = parseValorReais(document.getElementById('valorLance').value);
    const valorParcela      = parseValorReais(document.getElementById('valorParcela').value);
    const fatorIdealMensal  = parseFloat(document.getElementById('fatorIdealMensal').value.replace(',', '.'));
    const percentualSaldoDevedor = parseFloat(document.getElementById('percentualSaldoDevedor').value.replace(',', '.'));
    const saldoDevedor      = parseValorReais(document.getElementById('saldoDevedor').value);
    const tipoCota          = document.getElementById('tipoCota').value;

    // Validação lógica dos valores (numéricos e seleção de tipo)
    if ([valorLance, valorParcela, fatorIdealMensal, percentualSaldoDevedor, saldoDevedor].some(isNaN) || tipoCota === "") {
        document.getElementById('result').innerHTML = "<span style='color:red;'>Por favor, preencha todos os campos obrigatórios corretamente.</span>";
        document.getElementById('conformidadeSection').style.display = 'none';
        return;
    }

    if (valorParcela === 0) {
        document.getElementById('result').innerHTML = "<span style='color:red;'>O valor da parcela deve ser maior que zero.</span>";
        document.getElementById('conformidadeSection').style.display = 'none';
        return;
    }

    // Passos do cálculo:
    const percentualLance = ((valorLance / valorParcela) * fatorIdealMensal);
    const novoPercentualSaldo = percentualSaldoDevedor - percentualLance;

    let percentualParcela;
    if (tipoCota === "imovel")      percentualParcela = 0.5;
    else if (tipoCota === "auto")   percentualParcela = 1.0;
    else if (tipoCota === "pesado") percentualParcela = 0.75;
    else                            percentualParcela = 1.0; // padrão

    const quantidadeParcelas = Math.max(0, Math.floor(novoPercentualSaldo / percentualParcela));
    const saldoRemanescente = saldoDevedor - valorLance;
    const novoValorParcela = quantidadeParcelas > 0 ? (saldoRemanescente / quantidadeParcelas) : 0;

    // Exibe resultado formatado
    document.getElementById('result').innerHTML =
        `<h2>Resultados:</h2>
        <ul style="text-align:left; font-weight:normal;">
            <li><strong>Percentual do lance:</strong> ${formatPercentual(percentualLance, 4)} %</li>
            <li><strong>Novo percentual do saldo devedor:</strong> ${formatPercentual(novoPercentualSaldo, 4)} %</li>
            <li><strong>Quantidade de novas parcelas:</strong> ${quantidadeParcelas}</li>
            <li><strong>Novo valor da parcela:</strong> ${quantidadeParcelas > 0 ? formatReais(novoValorParcela) : 'N/A'}</li>
        </ul>`;

    // Mostra seção de conformidade
    document.getElementById('conformidadeSection').style.display = 'block';
    document.getElementById('mensagemConformidade').innerHTML = '';

    // Garante que modal está fechado (não interfere no customAlert)
});

// Eventos dos botões Sim/Não
document.getElementById('btnSim').addEventListener('click', function() {
    showCustomAlert('Permanecemos à disposição!');
});
document.getElementById('btnNao').addEventListener('click', function() {
    showCustomAlert('Considere pedir ajuda a seu líder imediato, ou abrir um caso para renegociação de lance');
});

// Botão de Zerar (limpar campos e resultados)
function zerar() {
    document.getElementById('valorLance').value = '';
    document.getElementById('valorParcela').value = '';
    document.getElementById('fatorIdealMensal').value = '';
    document.getElementById('percentualSaldoDevedor').value = '';
    document.getElementById('saldoDevedor').value = '';
    document.getElementById('tipoCota').selectedIndex = 0;
    document.getElementById('result').innerHTML = '';
    document.getElementById('conformidadeSection').style.display = 'none';

    // Limpa bordas vermelhas
    document.querySelectorAll('input, select').forEach(el => el.style.borderColor = '');
}

// Botão Voltar (redireciona para home ou página anterior)
function voltar() {
    window.history.back();
}