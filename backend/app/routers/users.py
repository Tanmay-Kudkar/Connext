# ── Users Router ──────────────────────────────────────────────────────────────
from fastapi import APIRouter, HTTPException, Depends
from app.data import get_store

router = APIRouter()

@router.get("/", summary="List all users (seeded)")
async def list_users(store=Depends(get_store)):
    return store["users"]

@router.get("/{user_id}", summary="Get user by ID")
async def get_user(user_id: str, store=Depends(get_store)):
    user = next((u for u in store["users"] if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    institution = next((i for i in store["institutions"] if i["id"] == user["institution_id"]), None)
    return {**user, "institution": institution}

@router.get("/handle/{handle}", summary="Get user by handle")
async def get_user_by_handle(handle: str, store=Depends(get_store)):
    user = next((u for u in store["users"] if u["handle"] == handle), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    institution = next((i for i in store["institutions"] if i["id"] == user["institution_id"]), None)
    return {**user, "institution": institution}
