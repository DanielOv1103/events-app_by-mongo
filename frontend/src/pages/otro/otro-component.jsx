import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function Otro() {
    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 w-full">
                <div className="text-lg font-bold text-green-600 w-full">Escoge tu servicio</div>
                <div className="ml-auto md:ml-0 md:mx-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[180px] border border-gray-100 justify-between">
                                label api
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent  align="center" className="bg-white w-[180px]">
                            {/* {apiOptions.map((option) => ( */}
                            <DropdownMenuItem
                                // key={option.value}
                                className="flex items-center justify-between"
                            // onSelect={() => {
                            //     onApiChange(option.value)
                            //     setIsOpen(false)
                            // }}
                            >
                                items
                                {/* {option.label}
                                {option.value === selectedApi && <Check className="h-4 w-4" />} */}
                            </DropdownMenuItem>
                            {/* // ))} */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <hr className="border-gray-200 my-4" />
            <div>
                <p>content</p>
            </div>
        </div>
    )
}