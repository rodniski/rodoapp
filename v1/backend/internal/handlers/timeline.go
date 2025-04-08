package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rodniski/websocket/internal/timeline"
)

// 🎯 Handler para a rota `/timeline`
func TimelineHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		recF1Str := c.GetHeader("rec_f1")
		recF1, err := strconv.ParseInt(recF1Str, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "rec_f1 inválido"})
			return
		}

		eventos, err := timeline.GetTimelineFromSQL(db, recF1)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar timeline"})
			return
		}

		c.JSON(http.StatusOK, eventos)
	}
}
