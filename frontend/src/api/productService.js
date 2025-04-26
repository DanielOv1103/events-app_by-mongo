const API_URL = 'http://127.0.0.1:8000'

/**
 * Obtiene la lista de productos.
 * @returns {Promise<Array>} Lista de productos
 */
async function listProducts() {
    const response = await fetch(`${API_URL}/products`)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al obtener los productos')
    }
    return response.json()
}

async function getProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener el producto');
        }
        return await response.json();
    } catch (error) {
        console.error('Get Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

/**
 * Crea un nuevo producto.
 * @param {Object} product Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
async function createProduct(product) {
    // Incluimos _id como null para ajustar el modelo Pydantic en backend
    const payload = { _id: null, ...product }
    const response = await fetch(`${API_URL}/products/`, {
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
            throw new Error(text || 'Error al crear producto')
        }
    }
    return JSON.parse(text)
}

async function updateProduct(productId, productData) {
    try {

        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData), // no excluyas _id
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


export async function removeProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al eliminar producto');
        }

        return await response.json();
    } catch (error) {
        console.error('Remove Error:', error);
        throw new Error(error.message || 'Error de conexión');
    }
}

export default { listProducts, removeProduct, updateProduct, createProduct, getProduct }