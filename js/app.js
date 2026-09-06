/**
 * HelpDesk Lite - Sistema de Gestión de Tickets
 * Aplicaciones de Internet — Universidad de Guanajuato (DICIS)
 * 
 * Módulo de Gestión de Tickets (Sesión 3 - JavaScript + DOM)
 */

// Colección inicial de tickets de ejemplo
const initialTickets = [
  {
    id: 1,
    folio: 'HD-0001',
    title: 'Computadora de laboratorio 3 no enciende',
    description: 'El equipo no da video ni enciende la fuente de poder al presionar el botón de encendido.',
    category: 'Hardware',
    priority: 'Alta',
    status: 'Nuevo',
    createdAt: '2026-09-02T10:35:00'
  },
  {
    id: 2,
    folio: 'HD-0002',
    title: 'Error de autenticación en portal de alumnos',
    description: 'Varios estudiantes reportan que sus credenciales institucionales son rechazadas al intentar iniciar sesión.',
    category: 'Accesos',
    priority: 'Crítica',
    status: 'En proceso',
    createdAt: '2026-09-03T11:20:00'
  },
  {
    id: 3,
    folio: 'HD-0003',
    title: 'Fallo de conectividad WiFi en biblioteca',
    description: 'El punto de acceso del segundo piso pierde señal de forma intermitente durante horas pico.',
    category: 'Red',
    priority: 'Media',
    status: 'Resuelto',
    createdAt: '2026-09-04T14:15:00'
  }
];

// Estado de la aplicación
let tickets = [...initialTickets];

// Referencias al DOM
const ticketsContainer = document.getElementById('tickets-container');
const emptyState = document.getElementById('empty-state');
const ticketModal = document.getElementById('ticket-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelTicket = document.getElementById('btn-cancel-ticket');
const ticketForm = document.getElementById('ticket-form');

// Métricas del Dashboard
const metricTotal = document.getElementById('metric-total');
const metricNew = document.getElementById('metric-new');
const metricProcess = document.getElementById('metric-process');
const metricResolved = document.getElementById('metric-resolved');

/**
 * Escapa caracteres HTML para prevenir inyección de código
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Formatea una fecha ISO a formato legible DD/MM/AAAA HH:mm
 * @param {string} isoString
 * @returns {string}
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Renderiza dinámicamente el listado de tickets en el contenedor principal
 * @param {Array} ticketsToRender
 */
function renderTickets(ticketsToRender) {
  if (!ticketsContainer || !emptyState) return;

  if (ticketsToRender.length === 0) {
    ticketsContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  ticketsContainer.innerHTML = ticketsToRender
    .map(ticket => `
      <article class="ticket-card" data-priority="${ticket.priority}" data-status="${ticket.status}" data-id="${ticket.id}">
        <div class="ticket-header">
          <span class="ticket-folio">${ticket.folio}</span>
          <span class="badge badge-priority" data-priority="${ticket.priority}">${ticket.priority}</span>
        </div>
        <h3 class="ticket-title">${escapeHTML(ticket.title)}</h3>
        <p class="ticket-description" style="color: var(--color-text-soft); font-size: 0.88rem; margin-bottom: 0.75rem;">
          ${escapeHTML(ticket.description)}
        </p>
        <div class="ticket-meta">
          <span><strong>Categoría:</strong> ${ticket.category}</span> · 
          <span class="badge badge-status" data-status="${ticket.status}">${ticket.status}</span> · 
          <span>${formatDate(ticket.createdAt)}</span>
        </div>
      </article>
    `)
    .join('');
}

/**
 * Actualiza los contadores de métricas del Dashboard
 */
function updateMetrics() {
  if (!metricTotal || !metricNew || !metricProcess || !metricResolved) return;
  metricTotal.textContent = tickets.length;
  metricNew.textContent = tickets.filter(t => t.status === 'Nuevo').length;
  metricProcess.textContent = tickets.filter(t => t.status === 'En proceso').length;
  metricResolved.textContent = tickets.filter(t => t.status === 'Resuelto').length;
}

/**
 * Control del modal de nuevo ticket
 */
function openModal() {
  if (ticketModal) {
    ticketModal.classList.remove('hidden');
    const titleInput = document.getElementById('ticket-title');
    if (titleInput) titleInput.focus();
  }
}

function closeModal() {
  if (ticketModal) {
    ticketModal.classList.add('hidden');
    if (ticketForm) ticketForm.reset();
  }
}

// Asignación de eventos del modal
if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
if (btnCancelTicket) btnCancelTicket.addEventListener('click', closeModal);

if (ticketModal) {
  ticketModal.addEventListener('click', (e) => {
    if (e.target === ticketModal) {
      closeModal();
    }
  });
}

// Inicialización de render y métricas
document.addEventListener('DOMContentLoaded', () => {
  renderTickets(tickets);
  updateMetrics();
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  renderTickets(tickets);
  updateMetrics();
}
