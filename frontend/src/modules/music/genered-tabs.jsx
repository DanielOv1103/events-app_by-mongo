
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GenreTabs({ genres, currentTab, onTabChange }) {
    return (
        <Tabs defaultValue="todos" className="mb-6" onValueChange={onTabChange}>
            <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
                {genres.slice(0, 5).map((genre) => (
                    <TabsTrigger key={genre} value={genre.toLowerCase()}>
                        {genre}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs> 
    )
}