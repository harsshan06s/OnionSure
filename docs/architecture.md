# Architecture

```text
Mobile browser / desktop
        |
        | Firebase Auth / Firestore / Storage
        v
 React + Vite PWA
        |
        | REST
        v
 FastAPI
   |       |        |
   v       v        v
 OpenCV   AI       ReportLab
 ArUco    Provider  PDF + SHA-256 + QR
   |       |
   |    Demo / Production YOLO
   v
 Size + observations
        |
 Deterministic grading engine
        |
 Grade A / URS / Reject / Manual Review
```
