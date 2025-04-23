import { Link } from "react-router-dom"

const NavBar = () => {
    return (
        <nav className="bg-white p-4 shadow mb-6">
            <Link to="/" className="mr-4 text-blue-600 hover:underline">Home</Link>
            <Link to="/create" className="text-blue-600 hover:underline">Crear Eventos</Link>
        </nav>
    )
}