/**
 * Sistema Web de Gestión de Citas y Servicios Clínicos (MediVal)
 * Motor de Base de Datos Relacional en Cliente (LocalStorage)
 */

const DB_KEYS = {
  PACIENTES: 'medival_pacientes',
  MEDICOS: 'medival_medicos',
  CITAS: 'medival_citas',
  ATENCIONES: 'medival_atenciones',
  EVALUACIONES: 'medival_evaluaciones'
};

const INITIAL_MEDICOS = [
  { id: 1, nombres: 'Dra. Carmen Mendoza', especialidad: 'Medicina General', consultorio: '101' },
  { id: 2, nombres: 'Dr. Alejandro Ruiz', especialidad: 'Cardiología', consultorio: '204' },
  { id: 3, nombres: 'Dra. Sofía Paredes', especialidad: 'Pediatría', consultorio: '105' },
  { id: 4, nombres: 'Dr. Martín Morales', especialidad: 'Odontología', consultorio: '302' }
];

const INITIAL_PACIENTES = [
  { id: 1, dni: '74839201', nombres: 'Luis Alberto Ramos', telefono: '987654321' },
  { id: 2, dni: '45892014', nombres: 'María Elena Gómez', telefono: '912345678' }
];

const INITIAL_CITAS = [
  {
    id: 1,
    idPaciente: 1,
    idMedico: 1,
    fecha: '2026-10-22',
    hora: '09:00',
    modalidad: 'Presencial',
    motivo: 'Control de rutina y chequeo general',
    estado: 'Atendida',
    fechaRegistro: '2026-10-21 10:00'
  },
  {
    id: 2,
    idPaciente: 2,
    idMedico: 2,
    fecha: '2026-10-22',
    hora: '10:30',
    modalidad: 'Teleconsulta',
    motivo: 'Evaluación de presión arterial y dolor torácico leve',
    estado: 'Pendiente',
    fechaRegistro: '2026-10-21 11:15'
  }
];

const INITIAL_ATENCIONES = [
  {
    id: 1,
    idCita: 1,
    diagnostico: 'Z00.0 - Examen médico general de rutina',
    tratamiento: 'Paciente con parámetros normales. Mantener dieta balanceada.',
    receta: 'Multivitamínico 1 tableta cada 24 horas por 30 días.',
    fecha: '2026-10-22 09:25'
  }
];

const INITIAL_EVALUACIONES = [
  {
    id: 1,
    idCita: 1,
    calificacion: 5,
    tiempoEsperaMin: 5,
    recomienda: true,
    comentario: 'Excelente atención y puntualidad en el consultorio.'
  }
];

// Gestor de Base de Datos Local
const db = {
  get: (key) => JSON.parse(localStorage.getItem(key)) || [],
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  init: () => {
    if (!localStorage.getItem(DB_KEYS.MEDICOS)) {
      db.set(DB_KEYS.MEDICOS, INITIAL_MEDICOS);
    }
    if (!localStorage.getItem(DB_KEYS.PACIENTES)) {
      db.set(DB_KEYS.PACIENTES, INITIAL_PACIENTES);
    }
    if (!localStorage.getItem(DB_KEYS.CITAS)) {
      db.set(DB_KEYS.CITAS, INITIAL_CITAS);
    }
    if (!localStorage.getItem(DB_KEYS.ATENCIONES)) {
      db.set(DB_KEYS.ATENCIONES, INITIAL_ATENCIONES);
    }
    if (!localStorage.getItem(DB_KEYS.EVALUACIONES)) {
      db.set(DB_KEYS.EVALUACIONES, INITIAL_EVALUACIONES);
    }
  },
  reset: () => {
    localStorage.setItem(DB_KEYS.MEDICOS, JSON.stringify(INITIAL_MEDICOS));
    localStorage.setItem(DB_KEYS.PACIENTES, JSON.stringify(INITIAL_PACIENTES));
    localStorage.setItem(DB_KEYS.CITAS, JSON.stringify(INITIAL_CITAS));
    localStorage.setItem(DB_KEYS.ATENCIONES, JSON.stringify(INITIAL_ATENCIONES));
    localStorage.setItem(DB_KEYS.EVALUACIONES, JSON.stringify(INITIAL_EVALUACIONES));
  },
  clear: () => {
    localStorage.removeItem(DB_KEYS.MEDICOS);
    localStorage.removeItem(DB_KEYS.PACIENTES);
    localStorage.removeItem(DB_KEYS.CITAS);
    localStorage.removeItem(DB_KEYS.ATENCIONES);
    localStorage.removeItem(DB_KEYS.EVALUACIONES);
  }
};

// Controladores de UI y Eventos
document.addEventListener('DOMContentLoaded', () => {
  db.init();
  renderApp();
  setupEventListeners();
});

function renderApp() {
  populateSelects();
  renderCitasTable();
  renderEvaluacionesView();
  renderDbExplorer();
  renderMetrics();
}

function populateSelects() {
  const selectPaciente = document.getElementById('select-paciente');
  const selectMedico = document.getElementById('select-medico');
  const selectCitaEval = document.getElementById('select-cita-eval');

  if (selectPaciente) {
    const pacientes = db.get(DB_KEYS.PACIENTES);
    selectPaciente.innerHTML = '<option value="">-- Seleccionar Paciente Registrado --</option>' +
      pacientes.map(p => `<option value="${p.id}">${p.dni} - ${p.nombres}</option>`).join('');
  }

  if (selectMedico) {
    const medicos = db.get(DB_KEYS.MEDICOS);
    selectMedico.innerHTML = '<option value="">-- Seleccionar Médico Especialista --</option>' +
      medicos.map(m => `<option value="${m.id}">${m.nombres} (${m.especialidad} - Cons. ${m.consultorio})</option>`).join('');
  }

  if (selectCitaEval) {
    const citas = db.get(DB_KEYS.CITAS).filter(c => c.estado === 'Atendida');
    const evaluaciones = db.get(DB_KEYS.EVALUACIONES);
    const evaluadasIds = evaluaciones.map(e => Number(e.idCita));
    const pendientesEval = citas.filter(c => !evaluadasIds.includes(Number(c.id)));
    const pacientes = db.get(DB_KEYS.PACIENTES);

    if (pendientesEval.length === 0) {
      selectCitaEval.innerHTML = '<option value="">No hay citas atendidas pendientes de evaluar</option>';
    } else {
      selectCitaEval.innerHTML = '<option value="">-- Seleccionar Cita a Calificar --</option>' +
        pendientesEval.map(c => {
          const pac = pacientes.find(p => p.id === c.idPaciente);
          return `<option value="${c.id}">Cita #${c.id} - ${pac ? pac.nombres : 'Paciente'} (${c.fecha} ${c.hora})</option>`;
        }).join('');
    }
  }
}

function renderCitasTable() {
  const tableBody = document.getElementById('citas-table-body');
  if (!tableBody) return;

  const citas = db.get(DB_KEYS.CITAS);
  const pacientes = db.get(DB_KEYS.PACIENTES);
  const medicos = db.get(DB_KEYS.MEDICOS);
  const atenciones = db.get(DB_KEYS.ATENCIONES);

  if (citas.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-subtle); padding: 1.5rem;">No hay citas registradas en la base de datos.</td></tr>`;
    return;
  }

  tableBody.innerHTML = citas.map(cita => {
    const paciente = pacientes.find(p => p.id === cita.idPaciente) || { nombres: 'Desconocido', dni: '-' };
    const medico = medicos.find(m => m.id === cita.idMedico) || { nombres: 'Desconocido', especialidad: '-' };
    const atencion = atenciones.find(a => a.idCita === cita.id);

    let statusStyle = 'color: #d97706; font-weight: 700;';
    if (cita.estado === 'Atendida') statusStyle = 'color: #0d9488; font-weight: 700;';
    if (cita.estado === 'Cancelada') statusStyle = 'color: #c8102e; font-weight: 700;';

    let actionButtons = '';
    if (cita.estado === 'Pendiente') {
      actionButtons = `
        <button class="btn btn-sm btn-success" onclick="openAtenderModal(${cita.id})">Atender</button>
        <button class="btn btn-sm btn-outline" style="color: var(--accent); border-color: var(--accent);" onclick="cancelarCita(${cita.id})">Cancelar</button>
      `;
    } else if (cita.estado === 'Atendida') {
      actionButtons = `<button class="btn btn-sm btn-outline" onclick="verAtencionModal(${cita.id})">Ver Ficha</button>`;
    } else {
      actionButtons = `<span style="font-size: 0.75rem; color: var(--text-subtle);">Cancelada</span>`;
    }

    return `
      <tr>
        <td><strong>#${cita.id}</strong></td>
        <td>
          <strong>${paciente.nombres}</strong>
          <div style="font-size: 0.75rem; color: var(--text-subtle);">DNI: ${paciente.dni}</div>
        </td>
        <td>
          <strong>${medico.nombres}</strong>
          <div style="font-size: 0.75rem; color: var(--text-subtle);">${medico.especialidad}</div>
        </td>
        <td>
          <div>${cita.fecha} &bull; ${cita.hora}</div>
          <div style="font-size: 0.75rem; color: var(--text-subtle);">${cita.modalidad}</div>
        </td>
        <td style="max-width: 200px; font-size: 0.8rem; color: var(--text-muted);">${cita.motivo}</td>
        <td style="${statusStyle}">${cita.estado}</td>
        <td>${actionButtons}</td>
      </tr>
    `;
  }).join('');
}

function renderEvaluacionesView() {
  const container = document.getElementById('evaluaciones-list');
  if (!container) return;

  const evaluaciones = db.get(DB_KEYS.EVALUACIONES);
  const citas = db.get(DB_KEYS.CITAS);
  const pacientes = db.get(DB_KEYS.PACIENTES);

  if (evaluaciones.length === 0) {
    container.innerHTML = `<p style="color: var(--text-subtle); font-size: 0.85rem;">No se han emitido encuestas aún.</p>`;
    return;
  }

  container.innerHTML = evaluaciones.map(ev => {
    const cita = citas.find(c => c.id === Number(ev.idCita));
    const pac = cita ? pacientes.find(p => p.id === cita.idPaciente) : null;
    return `
      <div style="background: var(--background); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.75rem; margin-bottom: 0.5rem; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <strong>${pac ? pac.nombres : 'Paciente'} (Cita #${ev.idCita})</strong>
          <span style="font-weight: 700; color: #2563eb;">Calificación: ${ev.calificacion} / 5</span>
        </div>
        <div style="color: var(--text-muted); font-size: 0.8rem;">
          Tiempo espera en sala: <strong>${ev.tiempoEsperaMin} min</strong> &bull; Recomienda: <strong>${ev.recomienda ? 'Sí' : 'No'}</strong>
        </div>
        ${ev.comentario ? `<div style="margin-top: 0.35rem; font-style: italic; color: var(--text-muted);">"${ev.comentario}"</div>` : ''}
      </div>
    `;
  }).join('');
}

function renderMetrics() {
  const citas = db.get(DB_KEYS.CITAS);
  const evaluaciones = db.get(DB_KEYS.EVALUACIONES);

  const totalCitas = citas.length;
  const atendidas = citas.filter(c => c.estado === 'Atendida').length;
  const pendientes = citas.filter(c => c.estado === 'Pendiente').length;

  let csatPromedio = 0;
  let esperaPromedio = 0;
  if (evaluaciones.length > 0) {
    const sumaCalif = evaluaciones.reduce((acc, curr) => acc + Number(curr.calificacion), 0);
    csatPromedio = (sumaCalif / evaluaciones.length).toFixed(1);

    const sumaEspera = evaluaciones.reduce((acc, curr) => acc + Number(curr.tiempoEsperaMin), 0);
    esperaPromedio = Math.round(sumaEspera / evaluaciones.length);
  }

  const elTotal = document.getElementById('metric-total');
  const elAtendidas = document.getElementById('metric-atendidas');
  const elCsat = document.getElementById('metric-csat');
  const elEspera = document.getElementById('metric-espera');

  if (elTotal) elTotal.innerText = totalCitas;
  if (elAtendidas) elAtendidas.innerText = `${atendidas} (${totalCitas > 0 ? Math.round((atendidas / totalCitas) * 100) : 0}%)`;
  if (elCsat) elCsat.innerText = evaluaciones.length > 0 ? `${csatPromedio} / 5` : 'S/D';
  if (elEspera) elEspera.innerText = evaluaciones.length > 0 ? `${esperaPromedio} min` : 'S/D';
}

function renderDbExplorer() {
  const jsonPre = document.getElementById('db-json-view');
  if (!jsonPre) return;

  const fullDb = {
    pacientes: db.get(DB_KEYS.PACIENTES),
    medicos: db.get(DB_KEYS.MEDICOS),
    citas: db.get(DB_KEYS.CITAS),
    atenciones: db.get(DB_KEYS.ATENCIONES),
    evaluaciones: db.get(DB_KEYS.EVALUACIONES)
  };

  jsonPre.innerText = JSON.stringify(fullDb, null, 2);
}

function setupEventListeners() {
  // Manejo de tabs del sistema
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Toggle para registrar nuevo paciente
  const chkNuevo = document.getElementById('chk-nuevo-paciente');
  const formNuevoPaciente = document.getElementById('box-nuevo-paciente');
  const selectPaciente = document.getElementById('select-paciente');

  if (chkNuevo && formNuevoPaciente && selectPaciente) {
    chkNuevo.addEventListener('change', () => {
      if (chkNuevo.checked) {
        formNuevoPaciente.style.display = 'block';
        selectPaciente.disabled = true;
      } else {
        formNuevoPaciente.style.display = 'none';
        selectPaciente.disabled = false;
      }
    });
  }

  // Formulario de Reserva de Cita
  const formCita = document.getElementById('form-nueva-cita');
  if (formCita) {
    formCita.addEventListener('submit', (e) => {
      e.preventDefault();
      registrarCita();
    });
  }

  // Formulario de Evaluación
  const formEval = document.getElementById('form-evaluacion');
  if (formEval) {
    formEval.addEventListener('submit', (e) => {
      e.preventDefault();
      registrarEvaluacion();
    });
  }

  // Formulario de Atención Médica (Modal)
  const formAtencion = document.getElementById('form-atencion-medica');
  if (formAtencion) {
    formAtencion.addEventListener('submit', (e) => {
      e.preventDefault();
      guardarAtencionMedica();
    });
  }
}

function registrarCita() {
  const chkNuevo = document.getElementById('chk-nuevo-paciente').checked;
  const selectPaciente = document.getElementById('select-paciente');
  const selectMedico = document.getElementById('select-medico');
  const txtFecha = document.getElementById('txt-fecha');
  const txtHora = document.getElementById('txt-hora');
  const selectModalidad = document.getElementById('select-modalidad');
  const txtMotivo = document.getElementById('txt-motivo');

  let pacienteId = null;

  if (chkNuevo) {
    const dni = document.getElementById('nuevo-dni').value.trim();
    const nombres = document.getElementById('nuevo-nombres').value.trim();
    const telefono = document.getElementById('nuevo-telefono').value.trim();

    if (!dni || !nombres) {
      alert('Debe completar el DNI y Nombres del paciente.');
      return;
    }

    const pacientes = db.get(DB_KEYS.PACIENTES);
    const yaExiste = pacientes.find(p => p.dni === dni);
    if (yaExiste) {
      pacienteId = yaExiste.id;
    } else {
      const nuevoId = pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
      const nuevoObj = { id: nuevoId, dni, nombres, telefono };
      pacientes.push(nuevoObj);
      db.set(DB_KEYS.PACIENTES, pacientes);
      pacienteId = nuevoId;
    }
  } else {
    pacienteId = Number(selectPaciente.value);
    if (!pacienteId) {
      alert('Seleccione un paciente o marque registrar nuevo.');
      return;
    }
  }

  const medicoId = Number(selectMedico.value);
  const fecha = txtFecha.value;
  const hora = txtHora.value;

  if (!medicoId || !fecha || !hora) {
    alert('Complete todos los campos de médico, fecha y hora.');
    return;
  }

  // Regla de Negocio / Integridad en BD: Evitar solapamiento de turno
  const citas = db.get(DB_KEYS.CITAS);
  const conflicto = citas.find(c =>
    c.idMedico === medicoId &&
    c.fecha === fecha &&
    c.hora === hora &&
    c.estado !== 'Cancelada'
  );

  if (conflicto) {
    alert(`Conflicto de BD: El médico ya tiene la cita #${conflicto.id} reservada el ${fecha} a las ${hora}. Elija otro horario.`);
    return;
  }

  const nuevoIdCita = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
  const nuevaCita = {
    id: nuevoIdCita,
    idPaciente: pacienteId,
    idMedico: medicoId,
    fecha: fecha,
    hora: hora,
    modalidad: selectModalidad.value,
    motivo: txtMotivo.value.trim() || 'Consulta médica general',
    estado: 'Pendiente',
    fechaRegistro: new Date().toISOString().slice(0, 16).replace('T', ' ')
  };

  citas.push(nuevaCita);
  db.set(DB_KEYS.CITAS, citas);

  alert(`Cita #${nuevoIdCita} registrada con éxito en la base de datos.`);
  document.getElementById('form-nueva-cita').reset();
  document.getElementById('box-nuevo-paciente').style.display = 'none';
  document.getElementById('select-paciente').disabled = false;

  renderApp();
}

function cancelarCita(id) {
  if (!confirm(`¿Está seguro de cancelar la cita #${id}?`)) return;
  const citas = db.get(DB_KEYS.CITAS);
  const index = citas.findIndex(c => c.id === id);
  if (index !== -1) {
    citas[index].estado = 'Cancelada';
    db.set(DB_KEYS.CITAS, citas);
    renderApp();
  }
}

function openAtenderModal(idCita) {
  const citas = db.get(DB_KEYS.CITAS);
  const cita = citas.find(c => c.id === idCita);
  if (!cita) return;

  const pacientes = db.get(DB_KEYS.PACIENTES);
  const medicos = db.get(DB_KEYS.MEDICOS);
  const paciente = pacientes.find(p => p.id === cita.idPaciente);
  const medico = medicos.find(m => m.id === cita.idMedico);

  document.getElementById('atencion-id-cita').value = idCita;
  document.getElementById('atencion-info-paciente').innerText = `${paciente ? paciente.nombres : 'Paciente'} (DNI: ${paciente ? paciente.dni : '-'})`;
  document.getElementById('atencion-info-medico').innerText = `${medico ? medico.nombres : 'Médico'}`;
  document.getElementById('atencion-info-motivo').innerText = cita.motivo;

  document.getElementById('modal-atencion').style.display = 'flex';
}

function closeModalAtencion() {
  document.getElementById('modal-atencion').style.display = 'none';
  document.getElementById('form-atencion-medica').reset();
}

function guardarAtencionMedica() {
  const idCita = Number(document.getElementById('atencion-id-cita').value);
  const diagnostico = document.getElementById('atencion-diagnostico').value.trim();
  const tratamiento = document.getElementById('atencion-tratamiento').value.trim();
  const receta = document.getElementById('atencion-receta').value.trim();

  if (!diagnostico || !tratamiento) {
    alert('Complete el diagnóstico y el tratamiento.');
    return;
  }

  // Actualizar Cita a 'Atendida'
  const citas = db.get(DB_KEYS.CITAS);
  const citaIdx = citas.findIndex(c => c.id === idCita);
  if (citaIdx !== -1) {
    citas[citaIdx].estado = 'Atendida';
    db.set(DB_KEYS.CITAS, citas);
  }

  // Guardar en tabla Atenciones
  const atenciones = db.get(DB_KEYS.ATENCIONES);
  const nuevaAtencion = {
    id: atenciones.length > 0 ? Math.max(...atenciones.map(a => a.id)) + 1 : 1,
    idCita: idCita,
    diagnostico,
    tratamiento,
    receta,
    fecha: new Date().toISOString().slice(0, 16).replace('T', ' ')
  };
  atenciones.push(nuevaAtencion);
  db.set(DB_KEYS.ATENCIONES, atenciones);

  alert(`Atención clínica registrada para la cita #${idCita}.`);
  closeModalAtencion();
  renderApp();
}

function verAtencionModal(idCita) {
  const atenciones = db.get(DB_KEYS.ATENCIONES);
  const atencion = atenciones.find(a => a.idCita === idCita);
  if (!atencion) {
    alert('No se encontraron registros clínicos para esta cita.');
    return;
  }

  alert(`Ficha Clínica (Cita #${idCita}):\n\nDiagnóstico: ${atencion.diagnostico}\n\nTratamiento: ${atencion.tratamiento}\n\nReceta: ${atencion.receta || 'Sin prescripción'}\n\nFecha: ${atencion.fecha}`);
}

function registrarEvaluacion() {
  const idCita = Number(document.getElementById('select-cita-eval').value);
  const calificacion = Number(document.getElementById('select-calificacion').value);
  const tiempoEspera = Number(document.getElementById('txt-espera-min').value);
  const recomienda = document.getElementById('select-recomienda').value === 'true';
  const comentario = document.getElementById('txt-comentario-eval').value.trim();

  if (!idCita || !calificacion) {
    alert('Seleccione una cita y una calificación.');
    return;
  }

  const evaluaciones = db.get(DB_KEYS.EVALUACIONES);
  const nuevaEval = {
    id: evaluaciones.length > 0 ? Math.max(...evaluaciones.map(e => e.id)) + 1 : 1,
    idCita,
    calificacion,
    tiempoEsperaMin: tiempoEspera,
    recomienda,
    comentario
  };

  evaluaciones.push(nuevaEval);
  db.set(DB_KEYS.EVALUACIONES, evaluaciones);

  alert('Evaluación de servicio guardada con éxito.');
  document.getElementById('form-evaluacion').reset();
  renderApp();
}

function exportDatabaseJson() {
  const fullDb = {
    pacientes: db.get(DB_KEYS.PACIENTES),
    medicos: db.get(DB_KEYS.MEDICOS),
    citas: db.get(DB_KEYS.CITAS),
    atenciones: db.get(DB_KEYS.ATENCIONES),
    evaluaciones: db.get(DB_KEYS.EVALUACIONES)
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullDb, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'medival_db_backup.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function resetDatabase() {
  if (confirm('¿Restablecer la base de datos a los valores de prueba iniciales?')) {
    db.reset();
    renderApp();
    alert('Base de datos restablecida.');
  }
}
