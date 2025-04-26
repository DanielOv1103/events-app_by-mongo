
const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de aeropuertos.
 * @returns {Promise<Array>} Lista de aeropuertos
 */
async function listAirports() {
    const response = await fetch(`${API_URL}/airport`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener los aeropuertos')
    }
    return response.json()
}

async function getAirport(airportId) {
    try {
        const response = await fetch(`${API_URL}/airport/${airportId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener el aeropuerto');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea un nuevo aeropuerto.
 * @param {Object} airport Datos del aeropuerto
 * @returns {Promise<Object>} Aeropuerto creado
 */
async function createAirport(airport) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...airport }
    const response = await fetch(`${API_URL}/airport/`, {
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
            throw new Error(text || 'Error al crear aeropuerto')
        }
    }
    return JSON.parse(text)
}


async function updateAirport(airportId, airportData) {
    try {

        const response = await fetch(`${API_URL}/airport/${airportId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(airportData), // no excluyas _id
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


export async function removeAirport(airportId) {
    try {
        const response = await fetch(`${API_URL}/airport/${airportId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar aeropuerto');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listAirports, removeAirport, updateAirport, createAirport, getAirport }