# OnionSure — SIH 26031

**AI-Powered Quality. Transparent Procurement.**

Mobile-first responsive web application/PWA for onion quality inspection. OnionSure separates AI observations from a deterministic, configurable grading engine and preserves an auditable workflow.

> **Important:** Demo AI is deterministic and illustrative. It is not scientifically validated, does not detect invisible internal defects, and is not government certification.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + React Router + TanStack Query + React Hook Form + Zod + Recharts + Lucide + vite-plugin-pwa
- Backend: Python + FastAPI + Pydantic + OpenCV + NumPy + Pillow + ReportLab
- Production AI seam: PyTorch + Ultralytics YOLO + ONNX Runtime
- Firebase: Authentication, Firestore, Storage

## Quick start (demo mode)

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

Demo login values are prefilled:

- `officer@onionsure.demo`
- `OnionSure@Demo123`

Demo mode does not require Firebase credentials. The inspection history uses browser local storage and the backend DemoAIProvider.

### 2. Backend

Python 3.12+ is recommended.

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:
```bash
source .venv/bin/activate
```

Then:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend: **http://localhost:8000**
Health: **http://localhost:8000/health**

### 3. Production Firebase mode

Create a Firebase project, enable Email/Password Authentication, Firestore and Storage. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_USE_FIREBASE=true` plus the Firebase web config values.

Deploy rules:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Create user documents at `users/{uid}` with `role` equal to `ADMIN` or `PROCUREMENT_OFFICER` and `active: true`.

The backend can receive Firebase Admin credentials through `backend/.env` for server-side extensions. Never put Admin credentials in frontend environment variables.

### 4. Firebase Emulator Suite

Install Firebase CLI separately, then from the repository root:
```bash
firebase emulators:start
```

Ports configured: Auth 9099, Firestore 8080, Storage 9199, Emulator UI 4000.

## Workflow

Login → batch details → camera calibration → camera/gallery → AI analysis → explainable results → manual review → PDF report → QR verification → audit trail.

The demo UI falls back to deterministic results if the FastAPI service is unavailable so a clean frontend demo can still be explored. Production deployments should treat AI-service failure as a real operational error rather than silently accepting demo output.

## AI architecture

`AIModelProvider` is the stable interface. `DemoAIProvider` produces deterministic synthetic observations. `ProductionAIProvider` is the explicit seam for trained YOLO weights; set `ONIONSURE_MODEL_PATH` to the model path and connect the trained inference adapter before enabling production inference. The current repository intentionally raises an error instead of fabricating production predictions.

Place model assets under `ai/models/` and document their version, license, training data, evaluation and intended deployment in `ai/README.md`.

## Size calibration

The intended production pipeline is ArUco marker → known physical marker dimension → pixel/mm conversion → segmentation contour → diameter estimate. `/api/ai/calibrate` validates that an image is supplied; a full marker-detection adapter should be configured with the actual physical marker size used at the procurement station. Demo calibration is explicitly labelled as estimated.

## Grading

The engine consumes observations and a versioned rules object. Example demo profile: 45–65 mm Grade A diameter, no sprouting/major damage/rot. These values are **demo configuration only** and must be replaced with the applicable verified procurement specification before operational use.

Every historical inspection must retain the exact rule version. Do not mutate historical rules in place.

## Reports

ReportLab generates a professional PDF and SHA-256 hash from canonical inspection data. The QR points to `/verify/{verificationId}`. The demo verification page is intentionally transparent: production verification must retrieve the stored canonical report and compare its hash rather than trusting client-provided values.

## Security

Firestore and Storage rules restrict roles and ownership, with audit logs append-only from the normal UI. Secrets are excluded from source control. Add backend Firebase token verification and deployment-specific CORS allowlists before production deployment.

## Testing

```bash
cd backend
pytest -q
```

Frontend:
```bash
cd frontend
npm run lint
npm run build
```

## PWA

The Vite PWA plugin supplies an installable manifest and offline shell. The repository also exposes online/offline state in the UI. Full IndexedDB queueing for offline inspection uploads should be enabled before field deployment; the demo keeps the current workflow loss-resistant via local state but does not claim a production-grade sync queue.

## Troubleshooting

- Camera denied: use browser permissions or Gallery upload.
- CORS: set `VITE_API_BASE_URL` to the FastAPI origin and configure a deployment allowlist.
- Firebase login fails: verify Authentication provider, user document, role and `active` field.
- Storage permission denied: deploy `storage.rules` and ensure the user profile exists.
- Production AI unavailable: remove `ONIONSURE_MODEL_PATH` to use DemoAIProvider, or install a validated model adapter.

## Known limitations

1. Demo AI is synthetic and not a real onion detector.
2. Production YOLO weights are not included.
3. A complete field-calibrated ArUco setup requires the actual physical reference marker dimensions and station procedure.
4. Demo verification is not cryptographic verification against a live Firestore record.
5. The included frontend has a local-storage demo mode; Firebase-backed production history is enabled when configured.
6. Ordinary RGB images cannot reliably reveal internal defects with no external indication.
