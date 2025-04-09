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
  Receipt,
  NotebookPen,
  Warehouse,
  FileCheck,
  FileSearch,
  FileClock,
  Table,
} from "lucide-react"

interface CardIconProps {
  icon: string
}

export function CardIcon({ icon }: CardIconProps) {
  // Mapeia o "nome" do ícone para o componente do Lucide
  const iconMap: Record<string, React.ReactNode> = {
    "book-open": <BookOpen className="size-4 lg:size-4.25 fhd:size-8" />,
    globe: <Globe className="size-4 lg:size-4.25 fhd:size-8" />,
    "file-text": <FileText className="size-4 lg:size-4.25 fhd:size-8" />,
    truck: <TruckIcon className="size-4 lg:size-4.25 fhd:size-8" />,
    building: <Building2 className="size-4 lg:size-4.25 fhd:size-8" />,
    "life-buoy": <LifeBuoy className="size-4 lg:size-4.25 fhd:size-8" />,
    headphones: <Headphones className="size-4 lg:size-4.25 fhd:size-8" />,
    spreadsheet: <FileSpreadsheet className="size-4 lg:size-4.25 fhd:size-8" />,
    "file-input": <FileInput className="size-4 lg:size-4.25 fhd:size-8" />,
    clipboard: <ClipboardList className="size-4 lg:size-4.25 fhd:size-8" />,
    history: <History className="size-4 lg:size-4.25 fhd:size-8" />,
    car: <Car className="size-4 lg:size-4.25 fhd:size-8" />,
    gate: <GateOpen className="size-4 lg:size-4.25 fhd:size-8" />,
    user: <User className="size-4 lg:size-4.25 fhd:size-8" />,
    receipt: <Receipt className="size-4 lg:size-4.25 fhd:size-8" />,
    warehouse: <Warehouse className="size-4 lg:size-4.25 fhd:size-8" />,
    "file-search": <FileSearch className="size-4 lg:size-4.25 fhd:size-8" />,
    "notebook-pen": <NotebookPen className="size-4 lg:size-4.25 fhd:size-8" />,
    "file-check": <FileCheck className="size-4 lg:size-4.25 fhd:size-8" />,
    "file-clock": <FileClock className="size-4 lg:size-4.25 fhd:size-8" />,
    "table": <Table className="size-4 lg:size-4.25 fhd:size-8" />,
  }

  return (
    <div className="flex p-2 items-center justify-center rounded border border-primary text-foreground aspect-square">
      {iconMap[icon] || <Globe className="size-4 lg:size-4.25 fhd:size-8" />}
    </div>
  )
}
