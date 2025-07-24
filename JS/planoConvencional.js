// Aguarda o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', function () {

    // --- FUNÇÃO PARA FORMATAR MOEDA EM TEMPO REAL ---
    const creditoInput = document.getElementById('credito');

    creditoInput.addEventListener('input', function (e) {
        // Pega o valor digitado
        let value = e.target.value;

        // Remove tudo que não for dígito
        value = value.replace(/\D/g, '');

        // Se não houver nada, não faz nada
        if (!value) {
            e.target.value = '';
            return;
        }

        // Converte o valor para número e divide por 100 para tratar os centavos
        const numberValue = parseFloat(value) / 100;

        // Formata o número para o padrão de moeda brasileira (BRL)
        const formattedValue = numberValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Atualiza o valor no campo de input
        e.target.value = formattedValue;
    });


    // --- LÓGICA DE CÁLCULO DA PARCELA ---
    document.getElementById('btnCalcular').addEventListener('click', function () {
        // 1. CAPTURA DOS DADOS DO FORMULÁRIO
        const creditoValue = document.getElementById('credito').value;
        const parcelas = parseInt(document.getElementById('parcelas').value);
        const fundoComum = parseFloat(document.getElementById('fundoComum').value) || 0;
        const taxaAdmin = parseFloat(document.getElementById('taxaAdmin').value) || 0;
        const fundoReserva = parseFloat(document.getElementById('fundoReserva').value) || 0;
        const taxaAdminAntecipada = parseFloat(document.getElementById('taxaAdminAntecipada').value) || 0;

        // Limpa a formatação de moeda para obter um número puro
        const credito = parseFloat(creditoValue.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

        // Validação dos campos obrigatórios
        if (isNaN(credito) || isNaN(parcelas) || isNaN(fundoComum) || isNaN(taxaAdmin)) {
            alert("Por favor, preencha todos os campos obrigatórios (*).");
            return;
        }

        // 2. CÁLCULO SEGUINDO O PASSO A PASSO
        const idealTotal = fundoComum + taxaAdmin + fundoReserva + taxaAdminAntecipada;
        const idealMensal = idealTotal / parcelas;
        const valorParcela = credito * (idealMensal / 100);

        // 3. EXIBIÇÃO DO RESULTADO
        const resultadoDiv = document.getElementById('result');
        resultadoDiv.innerHTML = `
            <div style="text-align: left; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>Ideal Total:</strong> ${idealTotal.toFixed(4)}%</p>
                <p style="margin: 5px 0;"><strong>Ideal Mensal da Cota:</strong> ${idealMensal.toFixed(4)}%</p>
                <hr>
                <p style="font-size: 20px; margin-top: 10px;">
                    <strong>Valor da Parcela: ${valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </p>
            </div>
        `;
    });
});

// Função para limpar os campos e o resultado
function zerar() {
    document.querySelectorAll('.input-group input').forEach(input => input.value = '');
    document.getElementById('result').innerHTML = '';
}