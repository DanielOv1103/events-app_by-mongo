const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de cines.
 * @returns {Promise<Array>} Lista de cines
 */
async function listCinemas() {
    const response = await fetch(`${API_URL}/cinema`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener los cines')
    }
    return response.json()
}

async function getCinema(cinemaId) {
    try {
        const response = await fetch(`${API_URL}/cinema/${cinemaId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener la cinema');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea un nuevo cine.
 * @param {Object} cinema Datos del cine
 * @returns {Promise<Object>} Cine creado
 */
async function createCinema(cinema) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...cinema }
    const response = await fetch(`${API_URL}/cinema/`, {
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
            throw new Error(text || 'Error al crear cine')
        }
    }
    return JSON.parse(text)
}


async function updateCinema(cinemaId, cinemaData) {
    try {

        const response = await fetch(`${API_URL}/cinema/${cinemaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cinemaData), // no excluyas _id
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


export async function removeCinema(cinemaId) {
    try {
        const response = await fetch(`${API_URL}/cinema/${cinemaId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar cine');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listCinemas, removeCinema, updateCinema, createCinema, getCinema }