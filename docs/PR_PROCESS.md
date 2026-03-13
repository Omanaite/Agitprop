# PR Process (Security-Gated)

## Reglas
1. Cada push relevante debe abrir un Pull Request.
2. El PR debe correr **Claude Code Security Review**.
3. El PR solo se integra tras aprobación de las directrices de seguridad.

## Implementación
Se usa el workflow del repositorio `claude-code-security-review-main`.
Este workflow requiere un `CLAUDE_API_KEY` configurado en GitHub Secrets.
