import { Play, Pause, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

export default function DetailMusicModal({
    selectedSong,
    onClose,
    currentSong,
    isPlaying,
    onSongSelect
}) {
    if (!selectedSong) return null

    return (
        <Dialog className="bg-white" open={!!selectedSong} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-white sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">{selectedSong.name}</DialogTitle>
                    <DialogClose className="absolute right-4 top-4">
                        <X className="h-4 w-4" />
                    </DialogClose>
                </DialogHeader>

                <div className=" grid gap-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                            <img
                                src={selectedSong.image || "/placeholder.svg?height=96&width=96"}
                                alt={selectedSong.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{selectedSong.name}</h3>
                            <p className="text-violet-700">{selectedSong.artist}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-violet-50 text-violet-700">
                                    {selectedSong.genre}
                                </Badge>
                                {/* <span className="text-xs text-gray-500">{formatDuration(selectedSong.duration)}</span> */}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-1">Descripción</h4>
                        <p className="text-gray-700 text-sm">{selectedSong.description}</p>
                    </div>

                    {/* AQUÍ VA EL NUEVO CÓDIGO DEL ENLACE DE YOUTUBE */}
                    <div>
                        <h4 className="font-medium mb-1">Enlace de YouTube</h4>
                        <a
                            href={selectedSong.music_yt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-600 hover:underline text-sm"
                        >
                            {selectedSong.music_yt}
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1 text-sm">Discográfica</h4>
                            <p className="text-gray-700 text-sm">{selectedSong.discography}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1 text-sm">Género</h4>
                            <p className="text-gray-700 text-sm">{selectedSong.genre}</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            onSongSelect(selectedSong)
                            onClose()
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                        {currentSong?.id === selectedSong.id && isPlaying ? (
                            <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pausar
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Reproducir
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}