// Função para exibir o modal de boas-vindas
function showWelcomeAlert() {
    const userName = localStorage.getItem('userName');
    const welcomeMessage = `Seja muito bem-vindo, ${userName}!`;
    document.getElementById('welcomeMessage').textContent = welcomeMessage;
    document.getElementById('welcomeModal').style.display = 'flex';
}

// Verifica se o alerta de boas-vindas já foi exibido
document.addEventListener('DOMContentLoaded', function () {
    const welcomeShown = localStorage.getItem('welcomeShown');
    if (!welcomeShown) {
        showWelcomeAlert();
        localStorage.setItem('welcomeShown', 'true'); // Marca o alerta como exibido
    }
});

// Fechar o modal ao clicar no botão "OK"
document.getElementById('closeWelcomeModal').addEventListener('click', function () {
    document.getElementById('welcomeModal').style.display = 'none';
});

// Função para voltar à página inicial
function voltar() {
    window.location.href = "/HOME/index.html"; // Redireciona para a página inicial
}

document.getElementById('btnCalcular').addEventListener('click', function () {
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
    const fundoComum = parseFloat(document.getElementById('fundoComum').value) || 0;
    const taxaAdministrativa = parseFloat(document.getElementById('taxaAdministrativa').value) || 0;
    const fundoReserva = parseFloat(document.getElementById('fundoReserva').value) || 0;
    const taxaAdesao = parseFloat(document.getElementById('taxaAdesao').value) || 0;

    const pagoFundoComum = parseFloat(document.getElementById('pagoFundoComum').value) || 0;
    const pagoTaxaAdministrativa = parseFloat(document.getElementById('pagoTaxaAdministrativa').value) || 0;
    const pagoFundoReserva = parseFloat(document.getElementById('pagoFundoReserva').value) || 0;
    const pagoTaxaAdesao = parseFloat(document.getElementById('pagoTaxaAdesao').value) || 0;

    const totalInicial = fundoComum + taxaAdministrativa + fundoReserva + taxaAdesao;
    const totalPago = pagoFundoComum + pagoTaxaAdministrativa + pagoFundoReserva + pagoTaxaAdesao;

    const saldoDevedor = totalInicial - totalPago;

    const resultado = `O percentual restante do saldo devedor do grupo e cota ${grupoCota} é de ${saldoDevedor.toFixed(4)}%`;
    document.getElementById('result').textContent = resultado;

    // Exibe a seção de confirmação
    document.getElementById('confirmationBox').style.display = 'block';
}

// Adiciona eventos de clique nos botões "Sim" e "Não"
document.getElementById('btnSim').addEventListener('click', function () {
    showCustomAlert("Obrigado por confirmar!"); 
    document.getElementById('confirmationBox').style.display = 'none'; 
});

document.getElementById('btnNao').addEventListener('click', function () {
    showCustomAlert("Por favor, considere solicitar ajuda a seu lider imediato para maiores detalhes ou abrir caso ao departamento de ajuste."); 
    document.getElementById('confirmationBox').style.display = 'none'; 
});

// Função para exibir o modal personalizado
function showCustomAlert(message) {
    document.getElementById('customAlertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'flex';
}

// Fechar o modal ao clicar no botão "OK"
document.getElementById('customAlertOK').addEventListener('click', function () {
    document.getElementById('customAlert').style.display = 'none';
});

//Zera os campos ao clicar no botão "Zerar"
function zerar() {
    document.querySelectorAll('.input-group input').forEach(input => input.value = '');
    document.getElementById('result').textContent = '';
    document.getElementById('confirmationBox').style.display = 'none';
}

console.log("Desenvolvido por Fabio França (SAC Eletrônico)");