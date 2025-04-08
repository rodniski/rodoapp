import {useGrupoFilial} from '.';

type PortariaAccess = {
    canAccessBorracharia: boolean;
    canAccessPortaria: boolean;
    canAccessHistorico: boolean;
};

export const usePortariaPermissions = () => {
    const {data: gruposFiliais, isLoading} = useGrupoFilial();

    const hasAccessToGrupo = (grupo: string): boolean => {
        return gruposFiliais?.some(g =>
            g.Grupo === grupo &&
            g.Filial.some(f => f.Loja === '0101')
        ) ?? false;
    };

    const isAdmin = gruposFiliais?.some(g => g.Grupo === '000000') ?? false;

    const permissions: PortariaAccess = {
        canAccessBorracharia: isAdmin || hasAccessToGrupo('000172'),
        canAccessPortaria: isAdmin || hasAccessToGrupo('000171'),
        canAccessHistorico: true,
    };

    return {
        permissions,
        isLoading,
        isAdmin,
    };
};