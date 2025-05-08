interface TableData {
    aplicativo: string
    relatorio: string
    conteudo: string
  }
  
  interface DataTableProps {
    data: TableData[]
  }
  
  export default function DataTableDocs({ data }: DataTableProps) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full  text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-left font-normal">Aplicativos</th>
              <th className="p-4 text-left font-normal">Relatório</th>
              <th className="p-4 text-left font-normal">Conteúdo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-4">{row.aplicativo}</td>
                <td className="p-4">{row.relatorio}</td>
                <td className="p-4">{row.conteudo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  