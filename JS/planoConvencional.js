document.getElementById('btnCalcular').addEventListener('click', function () {  
    // Captura os valores dos inputs  
    const creditoInput = document.getElementById('credito').value;  
    const parcelas = parseInt(document.getElementById('parcelas').value);  
    const fundoComum = parseFloat(document.getElementById('fundoComum').value) || 0;  
    const taxaAdministrativa = parseFloat(document.getElementById('taxaAdministrativa').value) || 0;  
    const fundoReserva = parseFloat(document.getElementById('fundoReserva').value) || 0;  

    // Remove R$ e formata o valor  
    const credito = parseFloat(creditoInput.replace(/[R$.\s]/g, '').replace(',', '.'));  

    // Validação dos campos obrigatórios  
    if (isNaN(credito) || isNaN(parcelas) || isNaN(fundoComum) || isNaN(taxaAdministrativa)) {  
        alert("Por favor, preencha todos os campos obrigatórios.");  
        return;  
    }  

    // Cálculo das parcelas  
    const parcelaFundoComum = (fundoComum / 100) * credito / parcelas;  
    const parcelaTaxaAdministrativa = (taxaAdministrativa / 100) * credito / parcelas;  
    const parcelaFundoReserva = (fundoReserva / 100) * credito / parcelas;  

    const parcelaTotal = parcelaFundoComum + parcelaTaxaAdministrativa + parcelaFundoReserva;  

    // Exibe o resultado  
    document.getElementById('result').innerHTML = `  
        <p>Parcela Mensal:</p>  
        <p>Fundo Comum: R$ ${parcelaFundoComum.toFixed(2)}</p>  
        <p>Taxa de Administração: R$ ${parcelaTaxaAdministrativa.toFixed(2)}</p>  
        <p>Fundo de Reserva: R$ ${parcelaFundoReserva.toFixed(2)}</p>  
        <p>Total: R$ ${parcelaTotal.toFixed(2)}</p>  
    `;  
});  

function zerar() {  
    document.querySelectorAll('.input-group input').forEach(input => input.value = '');  
    document.getElementById('result').textContent = '';  
}  