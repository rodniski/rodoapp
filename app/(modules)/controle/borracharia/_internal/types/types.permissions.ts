 // types/permissions.ts
export const PERMISSION_KEYS = {
    BORRACHARIA: 'canAccessBorracharia',
    PORTARIA: 'canAccessPortaria',
    HISTORICO: 'canAccessHistorico',
} as const;

export type PortariaAccess = {
    [PERMISSION_KEYS.BORRACHARIA]: boolean;
    [PERMISSION_KEYS.PORTARIA]: boolean;
    [PERMISSION_KEYS.HISTORICO]: boolean;
};

export type PermissionKey = keyof PortariaAccess;