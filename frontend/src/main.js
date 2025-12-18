import './components/app-root.js';

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
`;
document.head.appendChild(animationStyles);

window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 800);
});

console.log('%c🏥 Sistema Clínico ProyectoVeris', 
    'font-size: 20px; font-weight: bold; color: #0066CC;');
console.log('%c✅ Aplicación inicializada correctamente', 
    'font-size: 14px; color: #00E5A0;');
console.log('%c📱 Versión: 1.0.0', 
    'font-size: 12px; color: #666;');