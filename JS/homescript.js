// Função para determinar o sexo com base no nome  
function determinarSexo(nome) {  
    return nome.trim().toLowerCase().endsWith('a') ? 'feminino' : 'masculino';  
}  

// Função para validar o nome  
function validarNome(nome) {  
    const regex = /^[A-Za-zÀ-ÿ\s]+$/; // Permite letras e espaços, incluindo acentos  
    return regex.test(nome);  
}  

// Função para exibir o modal de nome ao carregar a página  
document.addEventListener('DOMContentLoaded', function () {  
    const nameModal = document.getElementById('nameModal');  
    const welcomeModal = document.getElementById('welcomeModal');  
    const nameInput = document.getElementById('nameInput');  
    const welcomeMessage = document.getElementById('welcomeMessage');  
    const pageTitle = document.getElementById('pageTitle');  

    const userName = sessionStorage.getItem('userName');  
    const welcomeShown = sessionStorage.getItem('welcomeShown');  

    if (!userName) {  
        nameModal.style.display = 'flex';  
    } else if (!welcomeShown) {  
        const sexo = determinarSexo(userName);  
        const mensagem = sexo === 'feminino' ? 'Seja bem-vinda' : 'Seja bem-vindo';  
        welcomeMessage.textContent = `${mensagem}, ${userName}!`;  
        welcomeModal.style.display = 'flex';  
        sessionStorage.setItem('welcomeShown', 'true');  
    }  

    if (userName) {  
        const sexo = determinarSexo(userName);  
        const mensagem = sexo === 'feminino' ? 'Bem-vinda' : 'Bem-vindo';  
        pageTitle.textContent = `${mensagem}, ${userName}!`;  
    }  

    document.getElementById('confirmName').addEventListener('click', function () {  
        const nome = nameInput.value.trim();  
        if (validarNome(nome)) {  
            sessionStorage.setItem('userName', nome);  
            nameModal.style.display = 'none';  

            const sexo = determinarSexo(nome);  
            const mensagem = sexo === 'feminino' ? 'Seja bem-vinda' : 'Seja bem-vindo';  
            welcomeMessage.textContent = `${mensagem}, ${nome}!`;  
            welcomeModal.style.display = 'flex';  
            sessionStorage.setItem('welcomeShown', 'true');  

            pageTitle.textContent = `${mensagem}, ${nome}!`;  
        } else {  
            alert('Por favor, insira um nome válido.');  
        }  
    });  

    document.getElementById('cancelName').addEventListener('click', function () {  
        nameModal.style.display = 'none';  
        alert('Você cancelou a operação.');  
    });  

    document.getElementById('closeWelcomeModal').addEventListener('click', function () {  
        welcomeModal.style.display = 'none';  
    });  
});  

console.log("Desenvolvido por Fabio França (SAC Eletrônico)");