const API_URL = 'http://127.0.0.1:8000'

export async function getMusicById(id) {
    const response = await fetch(`${API_URL}/music/${id}`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener la canción')
    }
    return response.json()
}

export async function listMusic() {
    const response = await fetch(`${API_URL}/music`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener las canciones')
    }
    return response.json()
}

export async function createMusic(music) {
    const payload = { _id: null, ...music }
    const response = await fetch(`${API_URL}/music/`, {
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
            throw new Error(text || 'Error al crear música')
        }
    }
    return JSON.parse(text)
}

export async function updateMusic(musicId, musicData) {
    const response = await fetch(`${API_URL}/music/${musicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(musicData),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al actualizar la canción')
    }
    return response.json()
}

export async function removeMusic(id) {
    if (!id || typeof id !== 'string') {
        throw new Error("ID de la música no definido o inválido")
    }

    const response = await fetch(`${API_URL}/music/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al eliminar música')
    }
}