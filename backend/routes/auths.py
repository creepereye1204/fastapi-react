from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import os

auth_router = APIRouter(
    prefix="/auths"
)


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


class GoogleVerifyRequest(BaseModel):
    id_token: str


@auth_router.post("/google-verify")
async def google_verify(payload: GoogleVerifyRequest):

    id_token = payload.id_token
    print(id_token)

    verify_endpoint = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
    resp = requests.get(verify_endpoint)
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    token_info = resp.json()

    if token_info["aud"] != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=400, detail="Token audience mismatch")

    user_email = token_info["email"]

    return {"access_token":  user_email, "token_type": "bearer"}
