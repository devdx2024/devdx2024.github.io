// Configuração
const TARGET_URL = 'https://192.168.0.14';
const REDIRECT_DELAY_MS = 3500;
const UPDATE_INTERVAL_MS = 16; // ~60fps

// Estado
let progress = 0;
let isRedirecting = true;
let isCancelled = false;
let deferredPrompt = null;
let intervalId = null;

// Elementos DOM
const elTitle = document.getElementById('status-title');
const elDesc = document.getElementById('status-desc');
const elProgressBar = document.getElementById('progress-bar');
const elBtnCancel = document.getElementById('btn-cancel-auto');
const elMsgCancelled = document.getElementById('msg-cancelled');
const elBtnAccess = document.getElementById('btn-access');
const elBtnInstall = document.getElementById('btn-install');

// Registrar Service Worker (Necessário para PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registrado', reg))
      .catch(err => console.error('Erro SW', err));
  });
}

// Lógica de Redirecionamento
function performRedirect() {
  window.location.href = TARGET_URL;
}

function updateUI() {
  elProgressBar.style.width = `${progress}%`;
  
  if (isCancelled) {
    elTitle.textContent = 'Redirecionamento Pausado';
    elDesc.textContent = 'Aguardando ação do usuário';
    elProgressBar.classList.replace('bg-cyan-500', 'bg-amber-500');
    elBtnCancel.classList.add('hidden');
    elMsgCancelled.classList.remove('hidden');
  } else {
    elTitle.textContent = 'Conectando ao Servidor';
    elDesc.textContent = `Abrindo ${TARGET_URL}...`;
  }
}

function startTimer() {
  const startTime = Date.now();
  const endTime = startTime + REDIRECT_DELAY_MS;

  intervalId = setInterval(() => {
    if (!isRedirecting) return;

    const now = Date.now();
    const remaining = Math.max(0, endTime - now);
    const elapsed = REDIRECT_DELAY_MS - remaining;
    progress = Math.min(100, (elapsed / REDIRECT_DELAY_MS) * 100);

    updateUI();

    if (now >= endTime) {
      clearInterval(intervalId);
      performRedirect();
    }
  }, UPDATE_INTERVAL_MS);
}

function cancelRedirect() {
  isCancelled = true;
  isRedirecting = false;
  progress = 100;
  if (intervalId) clearInterval(intervalId);
  updateUI();
}

// Event Listeners
elBtnCancel.addEventListener('click', cancelRedirect);

elBtnAccess.addEventListener('click', () => {
  performRedirect();
});

// PWA Install Logic
window.addEventListener('beforeinstallprompt', (e) => {
  // Previne o prompt automático do Chrome (em mobile antigos)
  e.preventDefault();
  deferredPrompt = e;
  
  // Mostra o botão
  elBtnInstall.classList.remove('hidden');
});

elBtnInstall.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);
  
  deferredPrompt = null;
  elBtnInstall.classList.add('hidden');
});

// Iniciar
startTimer();