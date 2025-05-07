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
    const creditoStr = document.getElementById("credito").value;
    const percentualStr = document.getElementById("percentual").value;

    // Converte os valores para números, tratando vírgula como separador decimal
    const credito = parseFloat(creditoStr.replace(".", "").replace(",", "."));
    const percentual = parseFloat(percentualStr.replace(",", "."));

    // Calcula o valor pago ao fundo comum
    const valorFundoComum = credito * (percentual / 100);

    // Calcula a multa de acordo com o percentual pago
    let multa = 0;
    if (percentual <= 20) {
        multa = 0.30; // 20% + 10%
    } else if (percentual <= 40) {
        multa = 0.25; // 15% + 10%
    } else if (percentual <= 50) {
        multa = 0.20; // 10% + 10%
    }

    // Calcula o valor da devolução com a multa
    const devolucao = valorFundoComum * (1 - multa);

    // Exibe o resultado formatado em reais com duas casas decimais
    const resultado = document.getElementById("resultado");
    resultado.textContent = `Valor a ser devolvido do grupo e cota ${grupoCota} é de R$ ${devolucao.toFixed(2)}`;

    // Exibe a caixa de confirmação
    document.getElementById('confirmationBox').style.display = 'block';
}

function showCustomAlert(message) {
    document.getElementById('customAlertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'flex';
}

document.getElementById('btnSim').addEventListener('click', function () {
    showCustomAlert("Obrigado por confirmar!");
    document.getElementById('confirmationBox').style.display = 'none';
});

document.getElementById('btnNao').addEventListener('click', function () {
    showCustomAlert("Por favor, verifique com o seu líder imediato.");
    document.getElementById('confirmationBox').style.display = 'none';
});

document.getElementById('customAlertOK').addEventListener('click', function () {
    document.getElementById('customAlert').style.display = 'none';
});

function zerar() {
    document.querySelectorAll('.input-group input').forEach(input => input.value = '');
    document.getElementById('resultado').textContent = '';
    document.getElementById('confirmationBox').style.display = 'none';
}

// Função para voltar à página inicial
function voltar() {
    window.location.href = "/HOME/index.html"; // Redireciona para a página inicial
}

console.log("Desenvolvido por Fabio França (SAC Eletrônico)");