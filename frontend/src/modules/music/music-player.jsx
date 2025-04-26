import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

export default function MusicPlayer({ currentSong, isPlaying, onTogglePlay }) {
    const iframeRef = useRef(null)

    useEffect(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current
            const videoUrl = currentSong?.music_yt
            const videoId = videoUrl?.split('v=')[1]?.split('&')[0]

            if (videoId) {
                iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`

                // Controlar la reproducción basada en isPlaying
                const message = isPlaying ?
                    JSON.stringify({ event: 'command', func: 'playVideo' }) :
                    JSON.stringify({ event: 'command', func: 'pauseVideo' })

                iframe.contentWindow.postMessage(message, '*')
            }
        }
    }, [currentSong, isPlaying])

    if (!currentSong) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md px-4 py-3 flex items-center z-30">
            <div className="flex items-center space-x-3 flex-1">
                <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                    <img
                        src={currentSong.image || "/placeholder.svg?height=40&width=40"}
                        alt={currentSong.name}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{currentSong.name}</div>
                    <div className="text-xs text-gray-500 truncate">{currentSong.artist}</div>
                </div>
                <Button
                    size="icon"
                    onClick={onTogglePlay}
                    className="rounded-full bg-violet-600 hover:bg-violet-700 h-8 w-8"
                >
                    {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
                </Button>
            </div>

            {/* Iframe oculto para controlar YouTube */}
            <iframe
                ref={iframeRef}
                style={{ display: 'none' }}
                title="YouTube Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}