# Auth Testing Playbook — Instituto Motivar

## Credenciais
Ver /app/memory/test_credentials.md (admin: admin@institutomotivar.org / motivar@2026).

## 1. Verificação MongoDB
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
```
Esperado: password_hash começando com `$2b$`; índice único em users.email; índice em login_attempts.identifier.

## 2. Teste de API
```
curl -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@institutomotivar.org","password":"motivar@2026"}'
# → retorna user + access_token
TOKEN=<access_token>
curl http://localhost:8001/api/auth/me -H "Authorization: Bearer $TOKEN"
# → retorna o mesmo usuário
curl -X PUT http://localhost:8001/api/admin/content -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"key":"hero_title","value":"Teste"}'
# → confirma rota protegida
```

## 3. Bloqueio por força bruta
5 tentativas com senha errada no mesmo e-mail/IP → HTTP 429 por 15 minutos.

## 4. Logout
POST /api/auth/logout limpa cookies; frontend remove o token do localStorage.
