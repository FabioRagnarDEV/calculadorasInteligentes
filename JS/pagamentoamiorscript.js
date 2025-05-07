function voltar() {
    window.location.href = "../index.html";
}

document.getElementById('btnCalcular').addEventListener('click', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const inputs = document.querySelectorAll('input[required]');
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

    calcular();
});

function calcular() {
    const grupoCota = document.getElementById('grupoCota').value;
    const percentualPagoStr = document.getElementById('percentualPago').value;
    const valorBemStr = document.getElementById('valorBem').value;

    const valorBem = parseFloat(valorBemStr.replace('.', '').replace(',', '.'));
    const percentualPago = parseFloat(percentualPagoStr);

    const percentualAMaior = percentualPago - 100;
    const valorDevolvido = valorBem * (percentualAMaior / 100);

    const valorDevolvidoFormatado = valorDevolvido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const resultado = `O valor pago a maior a ser devolvido do grupo e cota ${grupoCota} é de ${valorDevolvidoFormatado}.`;
    document.getElementById('result').textContent = resultado;

    // Exibe a caixa de confirmação
    document.getElementById('confirmationBox').style.display = 'block';
}

function showCustomAlert(message) {
    document.getElementById('customAlertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'flex';
}

document.getElementById('btnSim').addEventListener('click', function () {
    showCustomAlert("Obrigado por confirmar. Se precisar, estou à disposição!");
    document.getElementById('confirmationBox').style.display = 'none';
});

document.getElementById('btnNao').addEventListener('click', function () {
    showCustomAlert("Por favor, considere solicitar ajuda a seu líder imediato para maiores detalhes ou abrir caso ao departamento de ajuste.");
    document.getElementById('confirmationBox').style.display = 'none';
});

document.getElementById('customAlertOK').addEventListener('click', function () {
    document.getElementById('customAlert').style.display = 'none';
});

function zerar() {
    document.querySelectorAll('.input-group input').forEach(input => input.value = '');
    document.getElementById('result').textContent = '';
    document.getElementById('confirmationBox').style.display = 'none'; // Esconde a caixa de confirmação ao zerar
}

// Função para voltar à página inicial
function voltar() {
    window.location.href = "/index.html"; // Redireciona para a página inicial
}

console.log("Desenvolvido por Fabio França (SAC Eletrônico)");