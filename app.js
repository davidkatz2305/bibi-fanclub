'use strict';
const glitterButton = document.querySelector('#glitter-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sparkleLayer = document.querySelector('#sparkle-layer');
for (let i = 0; i < 22; i++) {
  const sparkle = document.createElement('span');
  sparkle.className = 'ambient-sparkle';
  sparkle.textContent = i % 2 ? '✦' : '✧';
  sparkle.style.left = `${(i * 37 + 5) % 98}%`;
  sparkle.style.top = `${(i * 23 + 3) % 97}%`;
  sparkle.style.animationDelay = `${-(i % 8) * .7}s`;
  sparkleLayer.append(sparkle);
}
glitterButton.addEventListener('click', () => {
  const enabled = glitterButton.getAttribute('aria-pressed') !== 'true';
  glitterButton.setAttribute('aria-pressed', String(enabled));
  document.querySelector('#glitter-label').textContent = enabled ? 'an' : 'aus';
  document.body.classList.toggle('glitter-on', enabled);
});

const loveButton = document.querySelector('#love-button');
const loveCount = document.querySelector('#love-count');
const resetButton = document.querySelector('#love-reset');
const burstLayer = document.querySelector('#burst-layer');
let hearts = 0;
loveButton.addEventListener('click', () => {
  hearts += 1;
  loveCount.textContent = `${hearts.toLocaleString('de-DE')} Herzchen`;
  resetButton.hidden = false;
  if (reducedMotion.matches) return;
  const rect = loveButton.getBoundingClientRect();
  for (let i = 0; i < 18; i++) {
    if (burstLayer.childElementCount >= 100) break;
    const particle = document.createElement('span');
    particle.className = 'heart-particle';
    particle.textContent = i % 3 ? '♥' : '✦';
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    const angle = (Math.PI * 2 * i) / 18;
    const distance = 90 + Math.random() * 130;
    particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance - 45}px`);
    particle.style.setProperty('--rotation', `${Math.random() * 90 - 45}deg`);
    particle.style.setProperty('--scale', `${.6 + Math.random() * .7}`);
    if (i % 3 === 0) particle.style.color = '#fff395';
    burstLayer.append(particle);
    window.setTimeout(() => particle.remove(), 1150);
  }
});
resetButton.addEventListener('click', () => {
  hearts = 0;
  loveCount.textContent = '0 Herzchen';
  resetButton.hidden = true;
  loveButton.focus();
});

const photoDialog = document.querySelector('#photo-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogCaption = document.querySelector('#dialog-caption');
let previousOverflow = '';
document.querySelectorAll('[data-photo]').forEach(card => {
  card.addEventListener('click', () => {
    dialogImage.src = card.dataset.photo;
    dialogImage.alt = card.querySelector('img').alt;
    dialogCaption.textContent = card.dataset.caption;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    photoDialog.showModal();
  });
});
photoDialog.addEventListener('close', () => {
  document.body.style.overflow = previousOverflow;
});
photoDialog.addEventListener('click', event => {
  if (event.target !== photoDialog) return;
  const rect = photoDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) photoDialog.close();
});

const music = document.querySelector('#background-music');
const musicToggle = document.querySelector('#music-toggle');
const musicVolume = document.querySelector('#music-volume');
const musicPlayer = document.querySelector('.music-player');
music.volume = .2;
function updateMusicState() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.textContent = playing ? 'Musik ausschalten' : 'Musik einschalten';
  musicPlayer.classList.toggle('is-playing', playing);
}
musicToggle.addEventListener('click', async () => {
  if (!music.paused) { music.pause(); return; }
  try { await music.play(); }
  catch { musicToggle.textContent = 'Musik erneut starten'; }
});
musicVolume.addEventListener('input', () => { music.volume = Number(musicVolume.value) / 100; });
music.addEventListener('play', updateMusicState);
music.addEventListener('pause', updateMusicState);
music.addEventListener('error', () => { musicToggle.textContent = 'Musik nicht verfügbar'; });
music.play().catch(() => { /* Der Musikschalter bleibt verfügbar, wenn der Browser Autoplay sperrt. */ });
