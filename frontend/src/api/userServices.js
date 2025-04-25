// URL completa de la API
const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de usuarios.
 * @returns {Promise<Array>} Lista de usuarios
 */
async function list() {
    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener los usuarios')
    }
    return response.json()
}

/**
 * Crea un nuevo usuario.
 * @param {Object} user Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
async function createUser(user) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...user }
    const response = await fetch(`${API_URL}/users/`, {
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
            throw new Error(text || 'Error al crear usuario')
        }
    }
    return JSON.parse(text)
}



export async function updateUser(userId, userData) {
    try {

        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData), // no excluyas _id
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
 * Elimina un usuario por ID
 * @param {string} id ID del usuario
 * @returns {Promise<void>}
 */
async function remove(id) {
    if (!id || typeof id !== 'string') {
        console.error("ID inválido:", id);
        throw new Error("ID del usuario no definido o inválido");
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar usuario');
    }
}

export default { list, remove, updateUser, createUser }