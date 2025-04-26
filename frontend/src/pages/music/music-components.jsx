import { useState, useEffect } from "react"
import { GenreTabs, CardMusic, DetailMusicModal, MusicPlayer } from "../../modules/index"
import { listMusic } from "../../api/musicService"

export default function MusicPage() {
    const [songs, setSongs] = useState([])
    const [currentSong, setCurrentSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [selectedSong, setSelectedSong] = useState(null)
    const [currentTab, setCurrentTab] = useState("todos")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const data = await listMusic()
                setSongs(data.map(song => ({
                    ...song,
                    isFavorite: false
                })))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchSongs()
    }, [])

    // Filtrar canciones según la pestaña seleccionada
    const displayedSongs =
        currentTab === "todos"
            ? songs
            : currentTab === "favoritos"
                ? songs.filter((song) => song.isFavorite)
                : songs.filter((song) => song.genre.toLowerCase() === currentTab.toLowerCase())

    // Obtener géneros únicos para las pestañas
    const genres = Array.from(new Set(songs.map((song) => song.genre)))

    const handleSongSelect = (song) => {
        if (currentSong?._id === song._id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentSong(song)
            setIsPlaying(true)
        }
    }

    const handleSongInfo = (song, e) => {
        e.stopPropagation()
        setSelectedSong(song)
    }

    const toggleFavorite = (id, e) => {
        e.stopPropagation()
        setSongs(songs.map((song) => (song._id === id ? { ...song, isFavorite: !song.isFavorite } : song)))
    }

    if (loading) return <div className="container mx-auto py-6 px-4">Cargando...</div>
    if (error) return <div className="container mx-auto py-6 px-4">Error: {error}</div>

    return (
        <div className="container mx-auto py-6 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Biblioteca Musical</h1>
                </div>
                <GenreTabs
                    genres={genres}
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedSongs.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No se encontraron canciones</p>
                        </div>
                    ) : (
                        displayedSongs.map((song) => (
                            <CardMusic
                                key={song._id}
                                song={song}
                                isCurrent={currentSong?._id === song._id}
                                isPlaying={currentSong?._id === song._id && isPlaying}
                                onSelect={handleSongSelect}
                                onToggleFavorite={toggleFavorite}
                                onShowInfo={handleSongInfo}
                            />
                        ))
                    )}
                </div>

                <DetailMusicModal
                    selectedSong={selectedSong}
                    onClose={() => setSelectedSong(null)}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onSongSelect={handleSongSelect}
                />

                <MusicPlayer
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                />
            </div>
            )
}