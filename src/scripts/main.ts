import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.hero-enter', { y: 24, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', clearProps: 'all' });
  gsap.from('.hero-art', { opacity: 0, scale: 0.95, duration: 1.4, ease: 'power2.out', clearProps: 'all' });
  gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
    gsap.from(element, { y: 30, opacity: 0, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true }, clearProps: 'all' });
  });
  const floating = gsap.to('.floating-note', { y: -10, duration: 3, stagger: 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  const pause = (event: Event) => floating.paused((event as CustomEvent<boolean>).detail);
  window.addEventListener('portfolio:pause-motion', pause);
  const visibility = () => floating.paused(document.hidden || document.querySelector('#motion-toggle')?.getAttribute('aria-pressed') === 'true');
  document.addEventListener('visibilitychange', visibility);
  return () => { window.removeEventListener('portfolio:pause-motion', pause); document.removeEventListener('visibilitychange', visibility); };
});

const range = document.querySelector<HTMLInputElement>('#comparison-range');
const comparison = document.querySelector<HTMLElement>('.comparison');
function setComparison(value: number) {
  if (!range || !comparison) return;
  const position = Math.max(0, Math.min(100, value));
  range.value = String(position);
  range.setAttribute('aria-valuetext', `${Math.round(position)}% de la segunda toma visible`);
  comparison.style.setProperty('--split', `${position}%`);
}
range?.addEventListener('input', () => setComparison(Number(range.value)));
// El área completa responde al arrastre, manteniendo el input nativo para teclado.
let dragging = false;
const setFromPointer = (event: PointerEvent) => {
  if (!comparison) return;
  const rect = comparison.getBoundingClientRect();
  setComparison(((event.clientX - rect.left) / rect.width) * 100);
};
range?.addEventListener('pointerdown', event => { dragging = true; range.setPointerCapture(event.pointerId); setFromPointer(event); });
range?.addEventListener('pointermove', event => { if (dragging) setFromPointer(event); });
range?.addEventListener('pointerup', event => { if (dragging) setFromPointer(event); dragging = false; });
range?.addEventListener('pointercancel', () => { dragging = false; });
document.querySelectorAll<HTMLButtonElement>('[data-compare]').forEach(button => button.addEventListener('click', () => setComparison(Number(button.dataset.compare))));

const comparisonButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-comparison-source]'));
comparisonButtons.forEach(button => button.addEventListener('click', () => {
  comparisonButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const source = button.dataset.comparisonSource ?? '';
  comparison?.querySelectorAll('image').forEach(image => image.setAttribute('href', source));
  comparison?.querySelector('.comparison-before-photo')?.setAttribute('viewBox', button.dataset.leftView ?? '');
  comparison?.querySelector('.comparison-after-photo')?.setAttribute('viewBox', button.dataset.rightView ?? '');
  const caption = document.querySelector('#comparison-caption');
  if (caption) caption.textContent = button.dataset.comparisonTitle ?? '';
  const original = document.querySelector<HTMLAnchorElement>('#comparison-original');
  if (original) original.href = source;
  setComparison(50);
}));

const cards = Array.from(document.querySelectorAll<HTMLButtonElement>('.gallery-card'));
const more = document.querySelector<HTMLButtonElement>('.gallery-more');
const pageSize = 6;
let visibleLimit = 3;
let selectedCategory = 'Todos';
const matchingCards = () => cards.filter(card => selectedCategory === 'Todos' || card.dataset.category === selectedCategory);
function updateGallery() {
  const matches = matchingCards();
  cards.forEach(card => { card.hidden = !matches.slice(0, visibleLimit).includes(card); });
  const label = document.querySelector('.gallery-count');
  if (label) label.textContent = `${matches.length} ${matches.length === 1 ? 'registro fotográfico' : 'registros fotográficos'}`;
  const progress = document.querySelector('.gallery-progress');
  if (progress) progress.textContent = `Mostrando ${Math.min(visibleLimit, matches.length)} de ${matches.length} registros`;
  if (more) {
    more.hidden = visibleLimit >= matches.length;
    more.textContent = selectedCategory === 'Todos' && visibleLimit === 3 ? `Ver galería completa (${matches.length}) ↗` : `Ver más registros (${Math.min(pageSize, Math.max(0, matches.length - visibleLimit))}) ↓`;
  }
  ScrollTrigger.refresh();
}
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(filter => { filter.classList.toggle('active', filter === button); filter.setAttribute('aria-pressed', String(filter === button)); });
    selectedCategory = button.dataset.filter ?? 'Todos';
    visibleLimit = 3;
    updateGallery();
  });
});
more?.addEventListener('click', () => {
  const firstNew = matchingCards()[visibleLimit];
  visibleLimit += pageSize;
  updateGallery();
  firstNew?.focus({ preventScroll: true });
  firstNew?.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
updateGallery();

const dialog = document.querySelector<HTMLDialogElement>('#gallery-dialog');
const dialogImage = document.querySelector<HTMLImageElement>('#dialog-image');
const zoomButton = document.querySelector<HTMLButtonElement>('.dialog-zoom');
const stage = document.querySelector<HTMLElement>('.dialog-image-stage');
let opener: HTMLButtonElement | null = null;
let currentIndex = 0;
function resetZoom() {
  stage?.classList.remove('is-zoomed');
  zoomButton?.setAttribute('aria-pressed', 'false');
  if (zoomButton) zoomButton.textContent = 'Ampliar detalle';
}
function showRecord(index: number) {
  const matches = matchingCards();
  if (!matches.length || !dialog || !dialogImage) return;
  currentIndex = (index + matches.length) % matches.length;
  const card = matches[currentIndex];
  resetZoom();
  dialogImage.src = card.dataset.image ?? '';
  dialogImage.alt = card.dataset.alt ?? '';
  dialog.querySelector('#dialog-title')!.textContent = card.dataset.title ?? '';
  dialog.querySelector('#dialog-description')!.textContent = card.dataset.description ?? '';
  dialog.querySelector('#dialog-category')!.textContent = card.dataset.category ?? '';
  dialog.querySelector('#dialog-counter')!.textContent = `${currentIndex + 1} / ${matches.length}`;
  const original = dialog.querySelector<HTMLAnchorElement>('#dialog-original');
  if (original) original.href = card.dataset.image ?? '';
  dialog.querySelectorAll<HTMLButtonElement>('.dialog-previous, .dialog-next').forEach(button => { button.disabled = matches.length < 2; });
}
cards.forEach(card => card.addEventListener('click', () => {
  if (!dialog) return;
  opener = card;
  showRecord(matchingCards().indexOf(card));
  dialog.showModal();
}));
dialog?.querySelector('.dialog-previous')?.addEventListener('click', () => showRecord(currentIndex - 1));
dialog?.querySelector('.dialog-next')?.addEventListener('click', () => showRecord(currentIndex + 1));
zoomButton?.addEventListener('click', () => {
  const zoomed = stage?.classList.toggle('is-zoomed') ?? false;
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.textContent = zoomed ? 'Ver imagen completa' : 'Ampliar detalle';
  if (stage) { stage.scrollTop = 0; stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2); }
});
dialog?.addEventListener('keydown', event => {
  if (stage?.classList.contains('is-zoomed')) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); showRecord(currentIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
});
dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog?.addEventListener('close', () => { resetZoom(); opener?.focus({ preventScroll: true }); });

document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => ScrollTrigger.refresh()));

// El contenido y la ilustración estática están disponibles antes de cargar WebGL.
const scene = document.querySelector<HTMLElement>('#tooth-scene');
if (scene) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      import('./tooth-scene').then(module => module.createToothScene(scene, reducedMotion)).catch(() => { /* La ilustración estática permanece visible. */ });
    }
  }, { rootMargin: '100px' });
  observer.observe(scene);
}
