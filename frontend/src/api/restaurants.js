const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de restaurantes.
 * @returns {Promise<Array>} Lista de restaurantes
 */
async function listRestaurants() {
    const response = await fetch(`${API_URL}/restaurantes`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener los restaurantes')
    }
    return response.json()
}

async function getRestaurant(restaurantId) {
    try {
        const response = await fetch(`${API_URL}/restaurantes/${restaurantId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener el restaurante');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea un nuevo restaurante.
 * @param {Object} restaurant Datos del restaurante
 * @returns {Promise<Object>} Restaurante creado
 */
async function createRestaurant(restaurant) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...restaurant }
    const response = await fetch(`${API_URL}/restaurantes/`, {
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
            throw new Error(text || 'Error al crear restaurante')
        }
    }
    return JSON.parse(text)
}


async function updateRestaurant(restaurantId, restaurantData) {
    try {

        const response = await fetch(`${API_URL}/restaurantes/${restaurantId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(restaurantData), // no excluyas _id
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


export async function removeRestaurant(restaurantId) {
    try {
        const response = await fetch(`${API_URL}/restaurantes/${restaurantId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar restaurante');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listRestaurants, removeRestaurant, updateRestaurant, createRestaurant, getRestaurant }