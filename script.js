// script.js – gerador de senhas + vídeos do YouTube dos craques
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

    // ----- indicador de força -----
    function updateStrength(password, length) {
        let score = 0;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/\d/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        if (length >= 12) score += 20;
        if (length >= 16) score += 15;
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

    // ----- eventos -----
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);

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

    // ----- VÍDEOS DOS CRAQUES (YouTube) -----
    const videoGrid = document.getElementById('videoGrid');

    // Lista de jogadores com IDs de vídeos do YouTube
    // Vídeos mostrando embaixadinhas, dribles e momentos lendários
    const legendaryVideos = [
        {
            name: '⚽ Pelé · O Rei',
            videoId: '8k9zQq5F9D4'  // Melhores momentos e embaixadinhas
        },
        {
            name: '🇦🇷 Maradona · Gênio',
            videoId: 'pTjYcJPnZHU'  // Drible e gols lendários
        },
        {
            name: '🇧🇷 Ronaldinho · Ginga',
            videoId: 'pNx6Yz3l7fU'  // Embaixadinhas e dribles
        },
        {
            name: '🇵🇹 CR7 · Skills',
            videoId: 'U-pG2rOC1U0'  // Habilidades e gols
        },
        {
            name: '🇦🇷 Messi · Drible',
            videoId: 'nPjiK6B7eQY'  // Dribles e lances geniais
        },
        {
            name: '🇧🇷 Neymar · Embaixadinhas',
            videoId: 'mWVg6jJZscE'  // Embaixadinhas e ginga
        }
    ];

    // Função para carregar os vídeos do YouTube
    function loadPlayerVideos() {
        videoGrid.innerHTML = '';

        legendaryVideos.forEach((video) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';

            // Iframe do YouTube com autoplay, mute e loop
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&controls=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&fs=1&color=white`;
            iframe.allow = 'autoplay; encrypted-media; fullscreen';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.title = video.name;

            // Label com o nome do jogador
            const label = document.createElement('div');
            label.className = 'video-label';
            label.textContent = video.name;

            wrapper.appendChild(iframe);
            wrapper.appendChild(label);
            videoGrid.appendChild(wrapper);
        });
    }

    // Carrega os vídeos
    loadPlayerVideos();
});
