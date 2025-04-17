import type React from "react"
import {
    BookOpen,
    Building2,
    Car,
    ClipboardList,
    DoorOpenIcon as GateOpen,
    FileInput,
    FileSpreadsheet,
    FileText,
    Globe,
    Headphones,
    History,
    LifeBuoy,
    TruckIcon,
    User,
} from "lucide-react"

interface CardIconProps {
    icon: string
}

export default function CardIcon({icon}: CardIconProps) {
    const iconMap: Record<string, React.ReactNode> = {
        "book-open": <BookOpen className="size-4 fhd:size-6"/>,
        globe: <Globe className="size-4 fhd:size-6"/>,
        "file-text": <FileText className="size-4 fhd:size-6"/>,
        truck: <TruckIcon className="size-4 fhd:size-6"/>,
        building: <Building2 className="size-4 fhd:size-6"/>,
        "life-buoy": <LifeBuoy className="size-4 fhd:size-6"/>,
        headphones: <Headphones className="size-4 fhd:size-6"/>,
        spreadsheet: <FileSpreadsheet className="size-4 fhd:size-6"/>,
        "file-input": <FileInput className="size-4 fhd:size-6"/>,
        clipboard: <ClipboardList className="size-4 fhd:size-6"/>,
        history: <History className="size-4 fhd:size-6"/>,
        car: <Car className="size-4 fhd:size-6"/>,
        gate: <GateOpen className="size-4 fhd:size-6"/>,
        user: <User className="size-4 fhd:size-6"/>,
    }
    return (
        <div className="flex p-2 items-center justify-center rounded-lg bg-muted">
            {iconMap[icon] || <Globe className="size-4"/>}
        </div>
    )
}

