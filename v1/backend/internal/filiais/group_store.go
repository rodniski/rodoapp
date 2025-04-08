package filiais

import (
	"context"
	"sort"
	"strings"

	"github.com/redis/go-redis/v9"
	"strconv"
)

var ctx = context.Background()

// GetOrCreateGroupID retorna o groupID que representa esse conjunto de filiais.
// Se não existir, cria um novo. Em ambos os casos, retorna o ID como string (ex.: "7").
func GetOrCreateGroupID(rdb *redis.Client, filiais []string) (string, error) {
    // 1. Ordena as filiais
    sort.Strings(filiais)

    // 2. Assinatura
    signature := strings.Join(filiais, ",")

    // 3. Tenta pegar se já existe o grupo associado a essa assinatura
    groupID, err := rdb.HGet(ctx, "group:bySignature", signature).Result()
    if err == redis.Nil {
        // ==> Não existe no Redis, então vamos criar um novo grupo
        newID, err := rdb.Incr(ctx, "group:nextId").Result()
        if err != nil {
            return "", err
        }

        // Converte de int64 para string (ex.: "7")
        groupIDStr := strconv.FormatInt(newID, 10)

        // Cria o set com as filiais
        if err := rdb.SAdd(ctx, "group:"+groupIDStr, filiais).Err(); err != nil {
            return "", err
        }

        // Mapeia signature -> groupIDStr
        if err := rdb.HSet(ctx, "group:bySignature", signature, groupIDStr).Err(); err != nil {
            return "", err
        }

        return groupIDStr, nil
    } else if err != nil {
        // Falha de HGET que não seja redis.Nil
        return "", err
    }

    // Se chegou aqui, groupID != "", já existia
    return groupID, nil
}


// AssociarUsuarioAoGrupo salva no Redis: userGroup:<username> = groupID
func AssociarUsuarioAoGrupo(rdb *redis.Client, username, groupID string) error {
    return rdb.HSet(ctx, "userGroup", username, groupID).Err()
}

