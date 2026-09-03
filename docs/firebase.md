# Firebase setup

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Create Firestore in production mode.
4. Create Storage.
5. Add web app credentials to `frontend/.env`.
6. Deploy `firebase/firestore.rules`, `firebase/storage.rules` and indexes.
7. Create user profiles in `users/{uid}`.
8. Use Admin SDK credentials only on trusted backend infrastructure.

Never commit `.env` or service-account private keys.
