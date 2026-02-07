# Books Microservices

Books management application built as a microservices system with Google OAuth2 authentication, API gateway, and deployment to Google Kubernetes Engine (GKE).

## Links

- Cloud URL: http://books-service.strangled.net/
- GitHub repository: https://github.com/loranazarenko/books-microservices
 
Any user with a Google account can sign in via the click "Register", then"Enter with Google" button on the frontend.

## Architecture

- `books-service` – Java Spring Boot REST API for books and authors (PostgreSQL, Liquibase).
- `gateway` – Spring Cloud Gateway with Google OAuth2 login, authorization layer, `/profile` endpoint.
- `frontend` – React application (Redux) consuming gateway API.
- `postgres` – database running in Kubernetes.
- Google Cloud:
    - GKE cluster for all services.
    - Artifact Registry for Docker images.
    - Google OAuth2 for authentication.

## Security Flow

1. User opens frontend through gateway Ingress URL.
2. Frontend calls `/profile`.
3. If response is `401`, frontend shows Login UI and redirects to `/oauth2/authorization/google` when user clicks **Login with Google**.
4. Google authenticates user and redirects back to `/login/oauth2/code/google`.
5. Gateway validates ID token, stores authentication, `/profile` returns user data (name, email).
6. Authenticated user can work with books API via gateway.

## Frontend Usage

- Cloud URL: `http://books-service.strangled.net/`.
- On first open:
    - Frontend calls `/profile`.
    - If not authenticated, shows a simple screen with:
        - current backend host value,
        - **Login** button.
- Login:
    - Click **Login with Google** to start Google OAuth2 login.
    - After successful login, frontend calls `/profile` again and receives user data.
- Main UI:
    - List of books is loaded from `/api/book/_list`.
    - Authors are loaded from `/api/author`.
    - User can:
        - view books list,
        - create, edit, delete books (through gateway to `books-service`),
        - see current authenticated user name in the UI.

## Deployment

Requirements:

- Google Cloud project `books-service-485914`.
- GKE cluster in `europe-central2-a`.
- Artifact Registry repository `books-repo` in `europe-central2`.

Steps:

1. Build and push images (locally or via CI):
    - `frontend`
    - `gateway`
    - `books-service`
2. Apply Kubernetes manifests:
    - namespace, `postgres`, `books-service`, `gateway`, `frontend`, `ingress`.
3. Configure DNS to point domain (for example `books-service.strangled.net`) to Ingress external IP.
4. In Google Cloud Console create OAuth2 Web client:
    - Authorized redirect URI: `http://<domain>/login/oauth2/code/google`.
5. Store client id and secret in Kubernetes secret `google-oauth`.

## CI/CD (GitHub Actions)

On push to `master`:

1. Authenticate to Google Cloud using service account (`GCP_SA_KEY`).
2. Build Docker images for `frontend`, `gateway`, `books-service`.
3. Push images to Artifact Registry:
    - `europe-central2-docker.pkg.dev/books-service-485914/books-repo/*`.
4. Get GKE credentials for the cluster.
5. Update deployments in namespace `books` with new image tags and wait for rollout.

Required repository secrets:

- `GCP_PROJECT_ID`
- `GKE_CLUSTER_NAME`
- `GKE_LOCATION`
- `GCP_SA_KEY`

## Local Run (short)

1. Start PostgreSQL (for example via `docker-compose`).
2. Run `books-service` with local profile.
3. Run `gateway`.
4. In `frontend`:
    - `npm install`
    - `npm start`
5. Configure Google OAuth redirect URI for `http://localhost/login/oauth2/code/google` for local testing.
6. Open `http://localhost/`, click **Register**, then **Enter with Google** to authenticate via Google, then use the UI to manage books.
