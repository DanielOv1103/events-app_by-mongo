const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de proveedores.
 * @returns {Promise<Array>} Lista de proveedores
 */
async function listProviders() {
    const response = await fetch(`${API_URL}/providers`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener los proveedores')
    }
    return response.json()
}

async function getProvider(providerId) {
    try {
        const response = await fetch(`${API_URL}/providers/${providerId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener el proveedor');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea un nuevo proveedor.
 * @param {Object} provider Datos del proveedor
 * @returns {Promise<Object>} Proveedor creado
 */
async function createProvider(provider) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...provider }
    const response = await fetch(`${API_URL}/providers/`, {
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
            throw new Error(text || 'Error al crear proveedor')
        }
    }
    return JSON.parse(text)
}


async function updateProvider(providerId, providerData) {
    try {

        const response = await fetch(`${API_URL}/providers/${providerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(providerData), // no excluyas _id
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


export async function removeProvider(providerId) {
    try {
        const response = await fetch(`${API_URL}/providers/${providerId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar proveedor');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listProviders, removeProvider, updateProvider, createProvider, getProvider }