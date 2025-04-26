
import { Play, Pause, Heart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function CardMusic({
    song,
    isCurrent,
    isPlaying,
    onSelect,
    onToggleFavorite,
    onShowInfo
}) {
    return (
        <Card
            className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
            onClick={() => onSelect(song)}
        >
            <div className="aspect-square bg-gray-100 relative">
                <img
                    src={song.image || "/placeholder.svg?height=200&width=200"}
                    alt={song.name}
                    className="w-full h-full object-cover"
                />
                {isCurrent && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {isPlaying ? (
                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                <Pause className="h-5 w-5 text-violet-600" />
                            </div>
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                <Play className="h-5 w-5 text-violet-600" />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{song.name}</h3>
                    <div className="flex space-x-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleFavorite(song.id, e)
                            }}
                        >
                            <Heart
                                className="h-4 w-4"
                                fill={song.isFavorite ? "currentColor" : "none"}
                                color={song.isFavorite ? "#ec4899" : "currentColor"}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation()
                                onShowInfo(song, e)
                            }}
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-violet-700 font-medium">{song.artist}</p>
                <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="bg-violet-50 text-violet-700">
                        {song.genre}
                    </Badge>
                    
                </div>
            </CardContent>
        </Card>
    )
}