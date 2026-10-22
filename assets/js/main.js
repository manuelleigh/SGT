/**
 * Gestión del Servicio de TI - UTP
 * Utilitarios de interfaz e interacción
 */

document.addEventListener('DOMContentLoaded', () => {
  // Manejo de botones de copia de código si existen
  document.querySelectorAll('.btn-copy-code').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        navigator.clipboard.writeText(targetElement.innerText).then(() => {
          const originalText = button.innerHTML;
          button.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Copiado';
          setTimeout(() => {
            button.innerHTML = originalText;
          }, 2000);
        });
      }
    });
  });

  // Manejo de pestañas interactivas si existen
  document.querySelectorAll('.tab-trigger').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabGroup = tab.closest('.tab-wrapper');
      if (!tabGroup) return;

      const targetPaneId = tab.getAttribute('data-tab');

      tabGroup.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = tabGroup.querySelector(`#${targetPaneId}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Filtros interactivos del Mapa Conceptual (Caso 03)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const branchCards = document.querySelectorAll('.map-branch-card');

  if (filterButtons.length > 0 && branchCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        branchCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
