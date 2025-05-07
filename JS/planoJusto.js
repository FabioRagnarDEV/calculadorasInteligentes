document.getElementById('btnCalcular').addEventListener('click', function () {
    // Obtém o valor do crédito e remove caracteres não numéricos
    const creditoInput = document.getElementById('credito').value;
    const credito = parseFloat(creditoInput.replace(/[^0-9,]/g, '').replace(',', '.'));

    // Obtém o valor da parcela e remove caracteres não numéricos
    const parcelaInput = document.getElementById('parcela').value;
    const parcela = parseFloat(parcelaInput.replace(/[^0-9,]/g, '').replace(',', '.'));

    // Verifica se os campos foram preenchidos corretamente
    if (isNaN(credito) || isNaN(parcela)) {
        showCustomAlert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Calcula a taxa de administração (0,35% do crédito)
    const taxaAdministracao = credito * 0.0035;

    // Calcula o valor da parcela final
    const parcelaFinal = parcela + taxaAdministracao;

    // Exibe o resultado formatado corretamente
    document.getElementById('result').textContent = 
        `O valor da parcela após a contemplação é: R$ ${parcelaFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Exibe a caixa de confirmação
    document.getElementById('confirmationBox').style.display = 'block';
});

// Função para zerar os campos
function zerar() {
    document.getElementById('credito').value = '';
    document.getElementById('parcela').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('confirmationBox').style.display = 'none';
}

// Função para voltar à página inicial
function voltar() {
    window.location.href = "/HOME/index.html";
}

// Adiciona eventos de clique nos botões "Sim" e "Não"
document.getElementById('btnSim').addEventListener('click', function () {
    showCustomAlert("Obrigado por confirmar!"); 
    document.getElementById('confirmationBox').style.display = 'none'; 
});

document.getElementById('btnNao').addEventListener('click', function () {
    showCustomAlert("Por favor, considere solicitar ajuda ao seu líder imediato para maiores detalhes."); 
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

// Fechar o modal de boas-vindas ao clicar no botão "OK"
document.getElementById('closeWelcomeModal').addEventListener('click', function () {
    document.getElementById('welcomeModal').style.display = 'none';
});