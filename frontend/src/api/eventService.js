// src/api/eventService.js

// URL completa de la API
const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de eventos.
 * @returns {Promise<Array>} Lista de eventos
 */
async function list() {
  const response = await fetch(`${API_URL}/events`)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Error al obtener los eventos')
  }
  return response.json()
}

/**
 * Crea un nuevo evento.
 * @param {Object} event Datos del evento
 * @returns {Promise<Object>} Evento creado
 */
async function createEvent (event) {
  // Incluimos _id como null para ajustar el modelo Pydantic en backend
  const payload = { _id: null, ...event }
  const response = await fetch(`${API_URL}/events/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const text = await response.text()
  if (!response.ok) {
    try {
      const errorData = JSON.parse(text)
      throw new Error(errorData.detail || JSON.stringify(errorData))
    } catch {
      throw new Error(text || 'Error al crear evento')
    }
  }
  return JSON.parse(text)
}



export async function updateEvent(eventId, eventData) {
  try {

    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData), // no excluyas _id
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error details:', errorDetails);
      throw new Error(`Update failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update Error:', error);
    throw new Error(error.message || 'Error de conexión');
  }
}


/**
 * Elimina un evento por ID
 * @param {string} id ID del evento
 * @returns {Promise<void>}
 */
async function remove(id) {
  if (!id || typeof id !== 'string') {
    console.error("ID inválido:", id);
    throw new Error("ID del evento no definido o inválido");
  }

  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al eliminar evento');
  }
}

export default { list, remove, updateEvent, createEvent }