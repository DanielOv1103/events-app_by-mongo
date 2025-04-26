const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de filmes.
 * @returns {Promise<Array>} Lista de filmes
 */
async function listFilms() {
    const response = await fetch(`${API_URL}/filmes`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener los filmes')
    }
    return response.json()
}

async function getFilm(filmeId) {
    try {
        const response = await fetch(`${API_URL}/filmes/${filmeId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener la filme');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea un nuevo filme.
 * @param {Object} filme Datos del filme
 * @returns {Promise<Object>} Filme creado
 */
async function createFilm(filme) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...filme }
    const response = await fetch(`${API_URL}/filmes/`, {
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
            throw new Error(text || 'Error al crear filme')
        }
    }
    return JSON.parse(text)
}


async function updateFilm(filmeId, filmeData) {
    try {

        const response = await fetch(`${API_URL}/filmes/${filmeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filmeData), // no excluyas _id
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


export async function removeFilm(filmeId) {
    try {
        const response = await fetch(`${API_URL}/filmes/${filmeId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar filme');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listFilms, removeFilm, updateFilm, createFilm, getFilm }