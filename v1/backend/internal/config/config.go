package config

import (
	_ "embed"
	"fmt"
)

const (
	mssqlUser = "rodoapp"
	mssqlPass = "@25%Rodo#6987"
	mssqlHost = "172.16.99.197"
	mssqlPort = "1433"
	mssqlDB   = "protheus_prod"

	redisURL = "172.16.99.182:6379"
)

//go:embed queries/sql_query_prenotas.sql
var sqlQueryPreNotas string

//go:embed queries/sql_query_timeline.sql
var sqlQueryTimeline string

func MSSQLConnectionString() string {
	return fmt.Sprintf(
		"server=%s,%s;database=%s;user id=%s;password=%s;encrypt=true;TrustServerCertificate=true",
		mssqlHost,
		mssqlPort,
		mssqlDB,
		mssqlUser,
		mssqlPass,
	)
}

func RedisURL() string {
	return redisURL
}

func GetSQLQueryPreNotas() string {
	return sqlQueryPreNotas
}

func GetSQLQueryTimelineEventos() string {
	return sqlQueryTimeline
}
