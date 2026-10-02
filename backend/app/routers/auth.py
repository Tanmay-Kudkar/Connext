# ── Auth Router ───────────────────────────────────────────────────────────────
# Handles mock OTP-based college email verification (hackathon prototype)
# Production: replace with real email OTP + JWT signing

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()

# In-memory OTP store (prototype only — never use in production)
_otp_store: dict[str, str] = {}

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str
    handle: str
    display_name: str

@router.post("/request-otp", summary="Send mock OTP to college email")
async def request_otp(body: OTPRequest):
    """Mock OTP — always sends '123456' in the prototype."""
    # Validate college domain (simple check)
    allowed_domains = ["xie.edu.in", "vjti.ac.in", "coep.ac.in", "nitt.edu", "edu", "ac.in"]
    domain = body.email.split("@")[-1]
    if not any(domain.endswith(d) for d in allowed_domains):
        raise HTTPException(status_code=400, detail="Please use your college email address.")
    _otp_store[body.email] = "123456"   # Fixed OTP for demo
    return {"message": f"OTP sent to {body.email} (demo: use 123456)", "demo_otp": "123456"}

@router.post("/verify-otp", summary="Verify OTP and create session")
async def verify_otp(body: OTPVerify):
    """Verify the mock OTP and return a demo session token."""
    expected = _otp_store.get(body.email)
    if not expected or body.otp != expected:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP.")
    _otp_store.pop(body.email, None)
    # Return demo token (production: sign a real JWT)
    return {
        "token": f"demo-token-{body.handle}",
        "user": {
            "handle": body.handle,
            "display_name": body.display_name,
            "email": body.email,
        },
        "message": "Verified. Welcome to Connext.",
    }
