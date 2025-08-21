## Recipe Book (Expo + GraphQL + MongoDB)

### Overview
Recipe Book is a full‑stack mobile-first app built with Expo Router (React Native) on the frontend and an Express + Apollo GraphQL API with MongoDB on the backend. Users can sign up, sign in, browse recipes, and create/edit/delete their own recipes.

### Features
- **Authentication**: Email/password signup and login with JWT; token stored in AsyncStorage.
- **Recipe browsing**: Search by text, filter by category, and view rich recipe cards and details.
- **Guest preview**: Non-authenticated users can view up to 3 recipes to explore the app.
- **CRUD for owners**: Authenticated users can add, edit, and delete only their own recipes.
- **UI/UX**: Modern gradients, animations, toasts, modals, and responsive layouts for mobile/web.
- **Validation**: Client-side validation in the recipe form for required fields and numeric values.
- **Pagination-ready API**: Server returns `RecipeConnection` with `pageInfo` for pagination.

### Architecture
- **Frontend (Expo + React Native)**
  - Routing via Expo Router with screens: `index` (landing), `home`, `login`, `signup`.
  - Apollo Client for GraphQL (Bearer token added from AsyncStorage).
  - Components: `RecipeCard`, `RecipeDetails` (modal), `RecipeForm` (modal with validation).
  - Libraries: `expo-linear-gradient`, `react-native-reanimated`, `react-native-toast-message`.
  - Codegen ready: GraphQL Code Generator set up in `codegen.yml` and outputs `graphql/generated.tsx`.

- **Backend (Express + Apollo Server + Mongoose)**
  - GraphQL schema in `src/graphql/schema.js` and resolvers in `src/graphql/resolvers.js`.
  - JWT auth: token parsed from `Authorization: Bearer <token>`; user added to context.
  - Mongoose models: `User` (hashed password) and `Recipe` (with `createdBy` relation).
  - Ownership rules: Only the creating user can update/delete their recipe.
  - Endpoint: `POST /graphql` with CORS enabled; dev health route at `/`.

### Data Model
- **User**: `id`, `email`, `password (hashed)`, timestamps.
- **Recipe**: `id`, `title`, `description`, `category`, `ingredients[]`, `steps[]`, `imageUrl`, `prepTimeMins`, `cookTimeMins`, `servings`, `createdBy`, timestamps.

### Repository Layout
- Frontend app (Expo): `app/` screens and `app/components/` UI components.
- Backend API (Node): `src/` with `index.js`, `db.js`, `graphql/`, `models/`, and `controllers/`.
- Shared tooling: `codegen.yml` and generated types in `graphql/generated.tsx`.

### Setup
#### Prerequisites
- Node.js 18+ and npm
- A running MongoDB instance (local or remote)
- Expo tooling (`npx expo`)

#### Backend (API)
1. Configure environment variables by creating `src/.env` (or set in shell):
   ```env
   MONGODB_URI=mongodb://localhost:27017/recipe_book
   JWT_SECRET=replace-with-a-long-random-secret
   PORT=4000
   ```
2. Install and start the API:
   ```bash
   cd src
   npm install
   npm run dev   # or: npm start
   ```
   The server should be available at `http://localhost:4000/graphql`.

#### Frontend (Expo app)
1. Install dependencies at the repository root:
   ```bash
   npm install
   ```
2. Configure the GraphQL URL used by the app:
   - Update the `uri` in these files to point to your API:
     - `app/home.tsx`
     - `app/login.tsx`
     - `app/signup.tsx`
   - Examples:
     - iOS simulator: `http://localhost:4000/graphql`
     - Android emulator: `http://10.0.2.2:4000/graphql`
     - Real device on same Wi‑Fi: `http://<your-computer-LAN-IP>:4000/graphql`
3. Start the app:
   ```bash
   npx expo start
   # or
   npm run android
   npm run ios
   npm run web
   ```

### How Frontend and Backend differ
- **Frontend**
  - Platform: Expo Router (React Native + Web)
  - Responsibilities: UI, navigation, local state, form validation, fetching via Apollo Client, token storage in AsyncStorage, and sending `Authorization` headers.
  - Key files: `app/_layout.tsx`, `app/index.tsx`, `app/home.tsx`, `app/login.tsx`, `app/signup.tsx`, `app/components/*`.

- **Backend**
  - Platform: Node.js with Express and Apollo Server
  - Responsibilities: GraphQL schema/resolvers, data access via Mongoose, authentication (JWT), authorization (ownership checks), pagination, and validation.
  - Key files: `src/index.js`, `src/db.js`, `src/graphql/schema.js`, `src/graphql/resolvers.js`, `src/models/*`.

### GraphQL Quick Reference
- Endpoint: `POST /graphql`
- Example queries:
  ```graphql
  query Recipes {
    recipes(page: 1, pageSize: 20) {
      nodes { id title category createdBy { id email } }
      pageInfo { total page pageSize hasNextPage }
    }
  }
  ```
  ```graphql
  mutation AddRecipe($input: RecipeInput!) {
    addRecipe(input: $input) { id title }
  }
  ```
  ```graphql
  mutation Signup($email: String!, $password: String!) {
    signup(input: { email: $email, password: $password }) { token user { id email } }
  }
  ```

### Scripts
- Frontend (root `package.json`):
  - `start`, `android`, `ios`, `web`, `lint`, `codegen`, `reset-project`
- Backend (`src/package.json`):
  - `dev` (nodemon), `start`, `seed` (optional)

### Notes & Limitations
- Token expiry is 1 day; there is no refresh flow.
- Recipe images are provided by URL; no asset upload service is included.
- The app hardcodes the API URL in a few screens; consider moving it to a shared config.

### License
MIT (or your preferred license)
