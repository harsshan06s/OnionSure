# Deployment

Frontend can be deployed to a static host that supports SPA fallback and HTTPS. Backend can be deployed as a container or Python service.

Set production CORS to the actual frontend origin, configure Firebase secrets in the deployment platform, deploy Firebase rules/indexes, and only enable the production AI provider after model validation.
