from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import base64
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_HOURS = 12


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = await db.users.find_one({"_id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return {"id": user["_id"], "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "admin")}


class LoginInput(BaseModel):
    email: str
    password: str


class ContentUpdate(BaseModel):
    key: str
    value: str


class AcaoInput(BaseModel):
    titulo: str
    descricao: str = ""
    categoria: str = "Geral"
    status: str = "Em Andamento"
    imagem: str = ""
    data: str = ""
    destaque: bool = False


class FotoInput(BaseModel):
    url: str
    legenda: str = ""
    ordem: int = 0


def doc_out(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc


DEFAULT_CONTENT = {
    "hero_eyebrow": "Associação sem fins lucrativos · Feira de Santana/BA",
    "hero_title": "Motivar é transformar vidas, todos os dias.",
    "hero_subtitle": "Reabilitação, acolhimento e cidadania para pessoas com deficiência, famílias em vulnerabilidade e toda a comunidade — com amor, ciência e trabalho voluntário.",
    "hero_image": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85",
    "stat_familias": "50+ famílias",
    "stat_anos": "desde 2022",
    "stat_voluntario": "100% voluntário",
    "about_title": "Uma rede de amor em forma de quebra-cabeça",
    "about_text": "O Instituto Motivar nasceu em setembro de 2022, em Feira de Santana (BA), com uma missão clara: nenhuma família deve caminhar sozinha. Atuamos na reabilitação de pessoas com deficiência — com foco em crianças e adolescentes — por meio de uma equipe multidisciplinar voluntária. Em 2025, a Câmara Municipal reconheceu nosso trabalho como de utilidade pública, fruto de anos de serviço prestado à comunidade, mesmo sem patrocínio ou apoio governamental.",
    "president_name": "Marcia Glayde do Amarante",
    "president_role": "Presidente e Fundadora",
    "president_bio": "Conhecida carinhosamente como Gleide, fundou o Instituto Motivar movida pela convicção de que toda pessoa — independentemente da condição, patologia ou vulnerabilidade — merece atendimento digno e afetuoso. À frente de uma equipe multidisciplinar de voluntários, lidera atendimentos que já alcançam cerca de 50 famílias em Feira de Santana.",
    "president_photo": "https://images.unsplash.com/photo-1758598304332-94b40ce7c7b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwzfHx3b21hbiUyMGNvbW11bml0eSUyMGxlYWRlciUyMHBvcnRyYWl0JTIwc21pbGUlMjBwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzg5MDAxNTI3fDA&ixlib=rb-4.1.0&q=85",
    "pix_key": "motivarinstituto@gmail.com",
    "pix_name": "Associação Instituto Motivar",
    "donate_text": "Sua doação vira terapia, cesta básica, agasalho e esperança. Qualquer valor faz diferença.",
    "volunteer_text": "Fisioterapeutas, psicólogos, pedagogos, advogados ou simplesmente quem quer ajudar: há um lugar para você no nosso quebra-cabeça.",
    "whatsapp": "5575999990000",
    "email": "motivarinstituto@gmail.com",
    "instagram": "https://www.instagram.com/motivar.instituto/",
    "endereco": "Rua Oscar Freitas, 103 – Santa Mônica II, Feira de Santana – BA",
    "cnpj": "48.165.761/0001-20",
}


@api_router.get("/")
async def root():
    return {"message": "Instituto Motivar API"}


@api_router.get("/content")
async def get_content():
    docs = await db.site_content.find({}).to_list(500)
    return {d["key"]: d["value"] for d in docs}


@api_router.get("/acoes")
async def get_acoes():
    docs = await db.acoes.find({}).sort("created_at", -1).to_list(200)
    return [doc_out(d) for d in docs]


@api_router.get("/galeria")
async def get_galeria():
    docs = await db.galeria.find({}).sort([("ordem", 1), ("created_at", -1)]).to_list(300)
    return [doc_out(d) for d in docs]


@api_router.post("/auth/login")
async def login(data: LoginInput, request: Request, response: Response):
    email = data.email.strip().lower()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_until = attempts.get("locked_until")
        if locked_until and datetime.now(timezone.utc) < datetime.fromisoformat(locked_until):
            raise HTTPException(status_code=429, detail="Muitas tentativas. Tente novamente em alguns minutos.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["_id"], email)
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none", max_age=ACCESS_TOKEN_HOURS * 3600, path="/")
    return {"id": user["_id"], "email": email, "name": user.get("name", ""), "role": user.get("role", "admin"), "access_token": token}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.put("/admin/content")
async def update_content(data: ContentUpdate, user: dict = Depends(get_current_user)):
    await db.site_content.update_one(
        {"key": data.key},
        {"$set": {"value": data.value, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"key": data.key, "value": data.value}


@api_router.post("/admin/acoes")
async def create_acao(data: AcaoInput, user: dict = Depends(get_current_user)):
    doc = data.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.acoes.insert_one(doc)
    return doc_out(doc)


@api_router.put("/admin/acoes/{acao_id}")
async def update_acao(acao_id: str, data: AcaoInput, user: dict = Depends(get_current_user)):
    result = await db.acoes.update_one({"_id": acao_id}, {"$set": data.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ação não encontrada")
    doc = await db.acoes.find_one({"_id": acao_id})
    return doc_out(doc)


@api_router.delete("/admin/acoes/{acao_id}")
async def delete_acao(acao_id: str, user: dict = Depends(get_current_user)):
    result = await db.acoes.delete_one({"_id": acao_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ação não encontrada")
    return {"ok": True}


@api_router.post("/admin/galeria")
async def create_foto(data: FotoInput, user: dict = Depends(get_current_user)):
    doc = data.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.galeria.insert_one(doc)
    return doc_out(doc)


@api_router.delete("/admin/galeria/{foto_id}")
async def delete_foto(foto_id: str, user: dict = Depends(get_current_user)):
    result = await db.galeria.delete_one({"_id": foto_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    return {"ok": True}


@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Envie um arquivo de imagem")
    raw = await file.read()
    if len(raw) > 2_000_000:
        raise HTTPException(status_code=400, detail="Imagem muito grande (máx. 2 MB)")
    b64 = base64.b64encode(raw).decode()
    return {"url": f"data:{file.content_type};base64,{b64}"}


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")

    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_password = os.environ.get("ADMIN_PASSWORD")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "_id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Administrador",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    for key, value in DEFAULT_CONTENT.items():
        await db.site_content.update_one({"key": key}, {"$setOnInsert": {"key": key, "value": value}}, upsert=True)

    if await db.acoes.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.acoes.insert_many([
            {"_id": str(uuid.uuid4()), "titulo": "Atendimento Multidisciplinar Semanal", "descricao": "Fisioterapia, psicologia, fonoaudiologia e terapia ocupacional gratuitas para crianças e adolescentes com deficiência, conduzidas por equipe voluntária.", "categoria": "Reabilitação", "status": "Recorrente", "imagem": "https://images.unsplash.com/photo-1622560949450-a36360ef213b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "data": "Toda semana", "destaque": True, "created_at": now},
            {"_id": str(uuid.uuid4()), "titulo": "Orientação Jurídica Comunitária", "descricao": "Atendimento jurídico gratuito para famílias: acesso ao BPC, direitos da pessoa com deficiência, benefícios e documentação.", "categoria": "Jurídico", "status": "Recorrente", "imagem": "https://images.unsplash.com/photo-1621353880071-4752fa42cbc7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "data": "Agendamento mensal", "destaque": False, "created_at": now},
            {"_id": str(uuid.uuid4()), "titulo": "Mutirão de Cestas Básicas", "descricao": "Arrecadação e distribuição de cestas básicas e agasalhos para famílias em situação de vulnerabilidade atendidas pelo instituto.", "categoria": "Assistência", "status": "Em Andamento", "imagem": "https://images.unsplash.com/photo-1621354599227-11f1a2edbe62?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHw0fHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "data": "2025", "destaque": False, "created_at": now},
            {"_id": str(uuid.uuid4()), "titulo": "Dia D da Inclusão", "descricao": "Evento comunitário com atividades recreativas, esportivas e culturais celebrando a diversidade e a inclusão de crianças com deficiência.", "categoria": "Eventos", "status": "Concluído", "imagem": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "data": "Setembro 2025", "destaque": True, "created_at": now},
        ])
        logger.info("Seed ações inseridas")

    if await db.galeria.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.galeria.insert_many([
            {"_id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "legenda": "Dia D da Inclusão", "ordem": 1, "created_at": now},
            {"_id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1622560949450-a36360ef213b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "legenda": "Atendimento multidisciplinar", "ordem": 2, "created_at": now},
            {"_id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1621353880071-4752fa42cbc7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "legenda": "Orientação às famílias", "ordem": 3, "created_at": now},
            {"_id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1621354599227-11f1a2edbe62?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHw0fHxjb21tdW5pdHklMjBzb2NpYWwlMjB3b3JrJTIwYnJhemlsaWFuJTIwY2hpbGRyZW4lMjBoZWxwJTIwdm9sdW50ZWVyfGVufDB8fHx8MTc4OTAwMTUyN3ww&ixlib=rb-4.1.0&q=85", "legenda": "Mutirão de cestas básicas", "ordem": 4, "created_at": now},
        ])
        logger.info("Seed galeria inserida")


app.include_router(api_router)

_origins = [o for o in [os.environ.get("FRONTEND_URL"), "http://localhost:3000", "http://127.0.0.1:3000"] if o]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
