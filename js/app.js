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

const VALID_TRANSITIONS = {
  'Nuevo': ['En proceso', 'Cancelado'],
  'En proceso': ['Resuelto', 'Cancelado'],
  'Resuelto': ['Cerrado'],
  'Cerrado': [],
  'Cancelado': []
};

let tickets = [...initialTickets];

const ticketsContainer = document.getElementById('tickets-container');
const emptyState = document.getElementById('empty-state');
const ticketModal = document.getElementById('ticket-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelTicket = document.getElementById('btn-cancel-ticket');
const ticketForm = document.getElementById('ticket-form');

const metricTotal = document.getElementById('metric-total');
const metricNew = document.getElementById('metric-new');
const metricProcess = document.getElementById('metric-process');
const metricResolved = document.getElementById('metric-resolved');

const searchInput = document.getElementById('search-input');
const statusButtons = document.querySelectorAll('.filter-button[data-status]');
const priorityFilter = document.getElementById('priority-filter');

let searchTerm = '';
let activeStatusFilter = 'Todos';
let activePriorityFilter = 'Todas';

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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

function getActionButtonsHTML(ticket) {
  const allowed = VALID_TRANSITIONS[ticket.status] || [];
  if (allowed.length === 0) {
    return `<span style="font-size: 0.8rem; color: var(--color-text-soft);">Ticket finalizado</span>`;
  }

  return allowed
    .map(nextStatus => {
      const isCancel = nextStatus === 'Cancelado';
      const btnClass = isCancel ? 'button button-secondary' : 'button button-primary';
      const label = nextStatus === 'En proceso'
        ? 'Atender'
        : nextStatus === 'Resuelto'
        ? 'Resolver'
        : nextStatus === 'Cerrado'
        ? 'Cerrar'
        : 'Cancelar';
      return `<button type="button" class="${btnClass}" style="font-size: 0.8rem; padding: 0.35rem 0.7rem;" data-action="change-status" data-target="${nextStatus}" data-id="${ticket.id}">${label}</button>`;
    })
    .join(' ');
}

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
        <div class="ticket-actions">
          ${getActionButtonsHTML(ticket)}
        </div>
      </article>
    `)
    .join('');
}

function updateMetrics() {
  if (!metricTotal || !metricNew || !metricProcess || !metricResolved) return;
  metricTotal.textContent = tickets.length;
  metricNew.textContent = tickets.filter(t => t.status === 'Nuevo').length;
  metricProcess.textContent = tickets.filter(t => t.status === 'En proceso').length;
  metricResolved.textContent = tickets.filter(t => t.status === 'Resuelto').length;
}

function changeTicketStatus(ticketId, targetStatus) {
  const ticket = tickets.find(t => t.id === Number(ticketId));
  if (!ticket) return;

  ticket.status = targetStatus;
  renderTickets(getFilteredTickets());
  updateMetrics();
}

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

function generateNextFolio() {
  const maxId = tickets.reduce((max, t) => Math.max(max, t.id || 0), 0);
  const nextId = maxId + 1;
  const folio = `HD-${String(nextId).padStart(4, '0')}`;
  return { id: nextId, folio };
}

function handleTicketSubmit(e) {
  e.preventDefault();

  const titleInput = document.getElementById('ticket-title');
  const descriptionInput = document.getElementById('ticket-description');
  const categoryInput = document.getElementById('ticket-category');
  const priorityInput = document.getElementById('ticket-priority');

  const title = titleInput ? titleInput.value.trim() : '';
  const description = descriptionInput ? descriptionInput.value.trim() : '';
  const category = categoryInput ? categoryInput.value : '';
  const priority = priorityInput ? priorityInput.value : '';

  if (!title || !description || !category || !priority) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  const { id, folio } = generateNextFolio();
  const newTicket = {
    id,
    folio,
    title,
    description,
    category,
    priority,
    status: 'Nuevo',
    createdAt: new Date().toISOString()
  };

  tickets.unshift(newTicket);
  closeModal();
  renderTickets(getFilteredTickets());
  updateMetrics();
}

function getFilteredTickets() {
  const term = searchTerm.toLowerCase().trim();

  return tickets.filter(ticket => {
    const matchesSearch = !term || (
      ticket.folio.toLowerCase().includes(term) ||
      ticket.title.toLowerCase().includes(term) ||
      ticket.description.toLowerCase().includes(term)
    );

    const matchesStatus = activeStatusFilter === 'Todos' || ticket.status === activeStatusFilter;
    const matchesPriority = activePriorityFilter === 'Todas' || ticket.priority === activePriorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

function handleSearch(e) {
  searchTerm = e.target.value;
  renderTickets(getFilteredTickets());
}

if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
if (btnCancelTicket) btnCancelTicket.addEventListener('click', closeModal);

if (ticketModal) {
  ticketModal.addEventListener('click', (e) => {
    if (e.target === ticketModal) closeModal();
  });
}

if (ticketForm) {
  ticketForm.addEventListener('submit', handleTicketSubmit);
}

if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}

statusButtons.forEach(button => {
  button.addEventListener('click', () => {
    statusButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    activeStatusFilter = button.getAttribute('data-status') || 'Todos';
    renderTickets(getFilteredTickets());
  });
});

if (priorityFilter) {
  priorityFilter.addEventListener('change', (e) => {
    activePriorityFilter = e.target.value;
    renderTickets(getFilteredTickets());
  });
}

if (ticketsContainer) {
  ticketsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="change-status"]');
    if (!btn) return;
    changeTicketStatus(btn.dataset.id, btn.dataset.target);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTickets(getFilteredTickets());
  updateMetrics();
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  renderTickets(getFilteredTickets());
  updateMetrics();
}
