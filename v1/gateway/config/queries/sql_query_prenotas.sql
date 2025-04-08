SELECT DISTINCT
    SF1.R_E_C_N_O_                                 AS REC,
    TRIM(ISNULL(SF4.F4_TRANFIL, ''))                 AS F4_TRANFIL,
    TRIM(SF1.F1_FILIAL)                              AS F1_FILIAL,
    TRIM(SF1.F1_DOC)                                 AS F1_DOC,
    TRIM(SF1.F1_SERIE)                               AS F1_SERIE,
    TRIM(SF1.F1_STATUS)                              AS F1_STATUS,
    TRIM(SA2.A2_COD)                                 AS A2_COD,
    TRIM(SA2.A2_LOJA)                                AS A2_LOJA,
    TRIM(SA2.A2_NOME)                                AS A2_NOME,
    TRIM(SA2.A2_COD + ' ' + SA2.A2_LOJA + ' - ' + SA2.A2_NOME) AS FORNECE,
    SF1.F1_EMISSAO,
    SF1.F1_DTDIGIT,
    SUM(SD1.D1_TOTAL)                               AS F1_VALBRUT,
    TRIM(SF1.F1_XTIPO)                              AS F1_XTIPO,
    TRIM(SF1.F1_XPRIOR)                             AS F1_XPRIOR,
    TRIM(SF1.F1_XORI)                               AS F1_XORI,
    TRIM(SF1.F1_XUSRRA)                             AS F1_XUSRRA,
    TRIM(SF1.F1_XOBS)                               AS F1_XOBS,
    TRIM(SF1.F1_ZOBSREV)                            AS F1_ZOBSREV,
    TRIM(SF1.F1_XREV)                               AS F1_XREV,
    SUBSTRING(
        (SUBSTRING(SF1.F1_USERLGI, 3, 1) + SUBSTRING(SF1.F1_USERLGI, 7, 1) +
         SUBSTRING(SF1.F1_USERLGI, 11, 1) + SUBSTRING(SF1.F1_USERLGI, 15, 1) +
         SUBSTRING(SF1.F1_USERLGI, 2, 1) + SUBSTRING(SF1.F1_USERLGI, 6, 1) +
         SUBSTRING(SF1.F1_USERLGI, 10, 1) + SUBSTRING(SF1.F1_USERLGI, 14, 1) +
         SUBSTRING(SF1.F1_USERLGI, 1, 1) + SUBSTRING(SF1.F1_USERLGI, 5, 1) +
         SUBSTRING(SF1.F1_USERLGI, 9, 1) + SUBSTRING(SF1.F1_USERLGI, 13, 1) +
         SUBSTRING(SF1.F1_USERLGI, 17, 1) + SUBSTRING(SF1.F1_USERLGI, 4, 1) +
         SUBSTRING(SF1.F1_USERLGI, 8, 1)),
        3, 6
    )                                              AS USUARIO,
    ISNULL(Z10.Z10_VENCTO, '')                     AS VENCIMENTO,
    TRIM(ISNULL(Z07.Z07_DESC, ''))                     AS Z07_DESC,
    TRIM(ISNULL(Z07.Z07_CHAVE, ''))                     AS Z07_CHAVE
FROM SF1010 SF1 WITH (NOLOCK)
     INNER JOIN SD1010 SD1 WITH (NOLOCK)
         ON SD1.D1_FILIAL = SF1.F1_FILIAL
            AND SD1.D1_DOC = SF1.F1_DOC
            AND SD1.D1_SERIE = SF1.F1_SERIE
            AND SD1.D1_FORNECE = SF1.F1_FORNECE
            AND SD1.D1_LOJA = SF1.F1_LOJA
            AND SD1.D_E_L_E_T_ <> '*'
     LEFT JOIN SF4010 SF4 WITH (NOLOCK)
         ON SD1.D1_TES = SF4.F4_CODIGO
            AND SF4.D_E_L_E_T_ <> '*'
            AND SF4.F4_TRANFIL <> '1'
     INNER JOIN SA2010 SA2 WITH (NOLOCK)
         ON SA2.A2_COD = SF1.F1_FORNECE
            AND SA2.A2_LOJA = SF1.F1_LOJA
            AND SA2.D_E_L_E_T_ <> '*'
     LEFT JOIN Z10010 Z10 WITH (NOLOCK)
         ON LTRIM(RTRIM(Z10.Z10_TIPO)) = 'Titulos'
            AND Z10.Z10_CHAVE = SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA
            AND Z10.D_E_L_E_T_ <> '*'
     LEFT JOIN Z07010 Z07 WITH (NOLOCK)
         ON Z07.Z07_CHAVE = SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA
WHERE SF1.D_E_L_E_T_ = ''
  AND (SF1.F1_XORI = 'rodoapp' OR SF4.F4_TRANFIL = '1')
  AND SF1.F1_DTDIGIT >= '20240601'
GROUP BY
    SF1.R_E_C_N_O_,
    SF4.F4_TRANFIL,
    SF1.F1_FILIAL,
    SF1.F1_USERLGI,
    SF1.F1_DOC,
    SF1.F1_SERIE,
    SF1.F1_STATUS,
    SA2.A2_COD,
    SA2.A2_LOJA,
    SA2.A2_NOME,
    SF1.F1_EMISSAO,
    SF1.F1_DTDIGIT,
    SF1.F1_XTIPO,
    SF1.F1_XPRIOR,
    SF1.F1_XORI,
    SF1.F1_XUSRRA,
    SF1.F1_XOBS,
    SF1.F1_ZOBSREV,
    SF1.F1_XREV,
    SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA,
    Z10.Z10_VENCTO,
    Z07.Z07_DESC,
    Z07.Z07_CHAVE
ORDER BY SF1.R_E_C_N_O_ DESC;
