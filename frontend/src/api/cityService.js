const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de ciudades.
 * @returns {Promise<Array>} Lista de ciudades
 */
async function listCitys() {
    const response = await fetch(`${API_URL}/city`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener las ciudades')
    }
    return response.json()
}

async function getCity(cityId) {
    try {
        const response = await fetch(`${API_URL}/city/${cityId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener la ciudad');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea una nueva ciudad.
 * @param {Object} city Datos de la ciudad
 * @returns {Promise<Object>} Ciudad creada 
 */
async function createCity(city) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...city }
    const response = await fetch(`${API_URL}/city/`, {
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
            throw new Error(text || 'Error al crear ciudad')
        }
    }
    return JSON.parse(text)
}


async function updateCity(cityId, cityData) {
    try {

        const response = await fetch(`${API_URL}/city/${cityId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cityData), // no excluyas _id
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


export async function removeCity(cityId) {
    try {
        const response = await fetch(`${API_URL}/city/${cityId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar ciudad');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listCitys, removeCity, updateCity, createCity, getCity }