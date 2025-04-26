const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de recetas.
 * @returns {Promise<Array>} Lista de recetas
 */
async function listRecetas() {
    const response = await fetch(`${API_URL}/recetas`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener las recetas')
    }
    return response.json()
}

async function getReceta(recetaId) {
    try {
        const response = await fetch(`${API_URL}/recetas/${recetaId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener la receta');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea una nueva receta.
 * @param {Object} receta Datos de la receta
 * @returns {Promise<Object>} Receta creada 
 */
async function createReceta(receta) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...receta }
    const response = await fetch(`${API_URL}/recetas/`, {
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
            throw new Error(text || 'Error al crear receta')
        }
    }
    return JSON.parse(text)
}


async function updateReceta(recetaId, recetaData) {
    try {

        const response = await fetch(`${API_URL}/recetas/${recetaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recetaData), // no excluyas _id
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


export async function removeReceta(recetaId) {
    try {
        const response = await fetch(`${API_URL}/recetas/${recetaId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar receta');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listRecetas, removeReceta, updateReceta, createReceta, getReceta }