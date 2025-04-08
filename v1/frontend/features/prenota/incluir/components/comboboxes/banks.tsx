import { useEffect, useState } from "react"
import { Combobox, Input, Label } from "ui"

interface Bank {
    ispb: string
    name: string
    code: number
    fullName: string
}

export interface DadosBancarios {
    banco: string
    agencia: string
    agenciaDigito: string
    conta: string
    contaDigito: string
    cnpjFornecedor: string
}

interface BankOption {
    value: string
    label: string
}

function useBanksList() {
    const [banks, setBanks] = useState<BankOption[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await fetch("https://brasilapi.com.br/api/banks/v1")
                if (!response.ok) {
                    throw new Error("Falha ao buscar lista de bancos")
                }

                const data: Bank[] = await response.json()

                // Ordena os bancos por código
                const sortedBanks = data
                    .filter((bank) => bank.code)
                    .sort((a, b) => a.code - b.code)
                    .map((bank) => ({
                        value: String(bank.code),
                        label: `${String(bank.code).padStart(3, "0")} - ${bank.fullName}`,
                    }))

                setBanks(sortedBanks)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar bancos")
                console.error("Erro ao buscar bancos:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchBanks()
    }, [])

    return { banks, loading, error }
}

export function DadosBancariosForm({
                                       dados,
                                       onChange,
                                   }: {
    dados: DadosBancarios
    onChange: (dados: DadosBancarios) => void
}) {
    const { banks, loading, error } = useBanksList()

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 z-50">
                    <Label htmlFor="banco">Banco</Label>
                    <Combobox
                        items={banks}
                        placeholder={loading ? "Carregando bancos..." : "Selecione o banco"}
                        onSelect={(value) => onChange({ ...dados, banco: value || "" })}
                        selectedValue={dados.banco}
                    />
                    {error && <p className="text-sm text-red-500">Erro ao carregar bancos. Por favor, tente novamente.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cnpjFornecedor">CNPJ do Fornecedor</Label>
                    <Input
                        id="cnpjFornecedor"
                        value={dados.cnpjFornecedor}
                        onChange={(e) => onChange({ ...dados, cnpjFornecedor: e.target.value })}
                        placeholder="CNPJ do fornecedor"
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2 col-span-3">
                    <Label htmlFor="agencia">Agência</Label>
                    <Input
                        id="agencia"
                        value={dados.agencia}
                        onChange={(e) => onChange({ ...dados, agencia: e.target.value })}
                        placeholder="Número da agência"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="agenciaDigito">Dígito</Label>
                    <Input
                        id="agenciaDigito"
                        value={dados.agenciaDigito}
                        onChange={(e) => onChange({ ...dados, agenciaDigito: e.target.value })}
                        placeholder="Dígito"
                        maxLength={1}
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2 col-span-3">
                    <Label htmlFor="conta">Conta</Label>
                    <Input
                        id="conta"
                        value={dados.conta}
                        onChange={(e) => onChange({ ...dados, conta: e.target.value })}
                        placeholder="Número da conta"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contaDigito">Dígito</Label>
                    <Input
                        id="contaDigito"
                        value={dados.contaDigito}
                        onChange={(e) => onChange({ ...dados, contaDigito: e.target.value })}
                        placeholder="Dígito"
                        maxLength={1}
                    />
                </div>
            </div>
        </div>
    )
}