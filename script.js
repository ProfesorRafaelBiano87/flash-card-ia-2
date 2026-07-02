// script.js – lógica do gerador de senhas + carregamento de imagens de craques

document.addEventListener('DOMContentLoaded', () => {
    // ----- elementos -----
    const passwordDisplay = document.getElementById('passwordDisplay');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const strengthFill = document.getElementById('strengthFill');
    const strengthLabel = document.getElementById('strengthLabel');

    // ----- caracteres -----
    const chars = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // ----- gerar senha -----
    function generatePassword() {
        const length = parseInt(lengthSlider.value, 10);
        let available = '';
        if (uppercaseCheck.checked) available += chars.uppercase;
        if (lowercaseCheck.checked) available += chars.lowercase;
        if (numbersCheck.checked) available += chars.numbers;
        if (symbolsCheck.checked) available += chars.symbols;

        if (available === '') {
            passwordDisplay.textContent = '⚠️ selecione opções';
            strengthFill.style.width = '10%';
            strengthLabel.textContent = 'Inválido';
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIdx = Math.floor(Math.random() * available.length);
            password += available[randomIdx];
        }

        passwordDisplay.textContent = password;
        updateStrength(password, length);
        return password;
    }

    // ----- indicador de força (baseado em complexidade) -----
    function updateStrength(password, length) {
        let score = 0;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/\d/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        if (length >= 12) score += 20;
        if (length >= 16) score += 15;
        // máximo 100
        score = Math.min(score, 100);

        let label = 'Fraca';
        let color = '#ff6b6b';
        if (score >= 80) { label = 'Muito Forte'; color = '#00ffb3'; }
        else if (score >= 60) { label = 'Forte'; color = '#4dff91'; }
        else if (score >= 40) { label = 'Média'; color = '#ffd93d'; }
        else { label = 'Fraca'; color = '#ff6b6b'; }

        strengthFill.style.width = `${score}%`;
        strengthFill.style.background = `linear-gradient(90deg, ${color}, #9bffb0)`;
        strengthLabel.textContent = label;
    }

    // ----- copiar senha -----
    function copyPassword() {
        const text = passwordDisplay.textContent;
        if (!text || text.includes('⚠️') || text === '••••••••••') return;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.style.color = '#8effb0';
            setTimeout(() => copyBtn.style.color = '#b3d9ff', 800);
        }).catch(() => {
            // fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            copyBtn.style.color = '#8effb0';
            setTimeout(() => copyBtn.style.color = '#b3d9ff', 800);
        });
    }

    // ----- eventos dos controles -----
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        // regenera automaticamente? melhor não, para não confundir. apenas atualiza o valor.
    });

    generateBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', copyPassword);

    // também gera ao mudar checkboxes? deixa o usuário clicar no botão.
    // mas podemos atualizar a força se já houver senha
    function refreshStrengthFromDisplay() {
        const pw = passwordDisplay.textContent;
        if (pw && !pw.includes('⚠️') && pw !== '••••••••••') {
            const len = pw.length;
            updateStrength(pw, len);
        }
    }
    uppercaseCheck.addEventListener('change', refreshStrengthFromDisplay);
    lowercaseCheck.addEventListener('change', refreshStrengthFromDisplay);
    numbersCheck.addEventListener('change', refreshStrengthFromDisplay);
    symbolsCheck.addEventListener('change', refreshStrengthFromDisplay);

    // Geração inicial
    generatePassword();

    // ----- GALERIA DE JOGADORES LENDÁRIOS (com embaixadinhas / passinhos) -----
    // Usaremos uma API gratuita de fotos de futebol (Unsplash) com palavras-chave
    // "football player" + "skills" + "dance" para trazer imagens de craques.
    // Além disso, colocaremos fotos de ícones reais.
    const playerGrid = document.getElementById('playerGrid');

    // Lista de lendas (para buscas mais diretas)
    const legendaryPlayers = [
        { name: 'Pelé', query: 'pele brazil football' },
        { name: 'Maradona', query: 'maradona argentina football' },
        { name: 'Ronaldinho', query: 'ronaldinho gaucho skills' },
        { name: 'Cristiano Ronaldo', query: 'cristiano ronaldo football' },
        { name: 'Messi', query: 'lionel messi football' },
        { name: 'Neymar', query: 'neymar skills football' }
    ];

    // Função para buscar imagens via Unsplash (uso público, sem chave para exemplo)
    // Usaremos um proxy simples: via URL direta com parâmetros (source.unsplash.com)
    // Para maior confiabilidade, usamos o endpoint /featured/ com termos.
    function loadPlayerImages() {
        // Limpa grid
        playerGrid.innerHTML = '';

        // Para cada jogador, cria um card com imagem (fallback com SVG caso a imagem não carregue)
        legendaryPlayers.forEach(player => {
            const imgWrapper = document.createElement('div');
            imgWrapper.style.width = '100%';
            imgWrapper.style.display = 'flex';
            imgWrapper.style.justifyContent = 'center';

            const img = document.createElement('img');
            // Usamos uma URL que retorna imagem aleatória com base no termo
            // Usamos 'https://source.unsplash.com/featured/?{query}&' para ter variedade
            // Porém, o unsplash mudou políticas; usaremos o loremflickr para evitar bloqueios (alternativo)
            // Para manter a confiabilidade, usamos o UI Avatars com iniciais? Não, queremos imagens reais.
            // Vamos usar uma combinação: o site picsum + termo? Não funciona. 
            // A solução: usar o 'https://loremflick.com'? Mas não temos garantia.
            // Vamos usar uma abordagem mais robusta: usar o 'https://randomuser.me/api/portraits'? Não é futebol.
            // Decisão: usar o Unsplash via 'source.unsplash.com' (ainda funciona para imagens com query)
            // Exemplo: https://source.unsplash.com/200x200/?football,pele
            // Mas muitas vezes retorna imagens de objetos. Vamos usar termos específicos.
            // Para garantir, usamos o 'https://source.unsplash.com/featured/?{query}' e adicionamos um cachebuster.
            const query = player.query;
            const imgUrl = `https://source.unsplash.com/featured/?${query}&${Date.now()}`;

            img.src = imgUrl;
            img.alt = player.name;
            img.loading = 'lazy';
            img.style.width = '100%';
            img.style.maxWidth = '180px';
            img.style.aspectRatio = '1/1';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '50%';
            img.style.border = '3px solid #3c7bb0';
            img.style.boxShadow = '0 0 30px rgba(0,150,255,0.3)';
            img.style.transition = 'transform 0.3s, box-shadow 0.3s';
            img.style.backgroundColor = '#0d1c2e';

            // Fallback se a imagem não carregar (mostrar iniciais)
            img.onerror = function() {
                this.onerror = null;
                // Usar um SVG com as iniciais
                const initials = player.name.split(' ').map(n => n[0]).join('').toUpperCase();
                this.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.style.width = '100%';
                fallbackDiv.style.maxWidth = '180px';
                fallbackDiv.style.aspectRatio = '1/1';
                fallbackDiv.style.borderRadius = '50%';
                fallbackDiv.style.background = 'linear-gradient(145deg, #1f3b6a, #0a1a30)';
                fallbackDiv.style.display = 'flex';
                fallbackDiv.style.alignItems = 'center';
                fallbackDiv.style.justifyContent = 'center';
                fallbackDiv.style.color = '#b0d0ff';
                fallbackDiv.style.fontSize = '2.5rem';
                fallbackDiv.style.fontWeight = 'bold';
                fallbackDiv.style.border = '3px solid #3c7bb0';
                fallbackDiv.style.boxShadow = '0 0 30px rgba(0,150,255,0.3)';
                fallbackDiv.textContent = initials;
                imgWrapper.appendChild(fallbackDiv);
            };

            imgWrapper.appendChild(img);
            playerGrid.appendChild(imgWrapper);
        });

        // Caso não carregue nenhuma, teremos os fallbacks.
    }

    // Carrega imagens dos craques
    loadPlayerImages();

    // Além disso, se quiser atualizar a cada 30s? Não necessário.
    // Mas podemos adicionar um botão de refresh? O professor pode recarregar a página.
});
