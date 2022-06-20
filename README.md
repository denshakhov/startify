<div align="center"><img src="https://user-images.githubusercontent.com/107560822/174556810-34917878-4fd2-4d40-84eb-f7ea9ee07bab.png"/></div><br>

Deployable monorepo boilerplate powered by **[fastify](https://github.com/fastify/fastify)** (node.js) and **React**. Ideal for rapid prototyping and going to production as fast as possible.

## 📋 Features

- Monorepo project structure
- Local development with **docker** and **docker-compose** with convenient local domain setup:
    - [mywebapp.test](http://mywebapp.test:8080) - SPA, static files
    - [api.mywebapp.test](http://api.mywebapp.test) - API endpoints
- [Deployable ↓](#-deploy-github-actions--netlify-and-heroku) (staging, production):
    - From **CI/CD (GitHub Actions)** to **Netlify** (SPA) and **Heroku** (API)
    - More coming soon...
- [Integration Tests with examples ↓](#-testing) (**jest**)
- [Database Migrations ↓](#-migrations) (**knex**)
- [GitLab Flow ↓](#-gitlab-flow)
- Linting with `eslint`, `prettier` and `lint-staged`, pre-commit hooks with `husky`
- [Basic Todo App ↓](#todo-app-example) to show all the features of the startify
- Frontend Stack
    - React ([CRA](https://create-react-app.dev))
- Backend Stack
    - Node.js ([fastify](https://github.com/fastify/fastify))
    - TypeScript
    - PostgreSQL
    - Nginx (reverse proxy)

## 📦 Requirements

- **Node.js** v16+
- **Docker** v20.10+ and **Docker Compose** v1.29+

## 🚀 Getting started

```bash
git clone --origin=upstream --branch=main --single-branch https://github.com/denshakhov/startify.git myproject
cd myproject

npm run setup         # Install dependencies
npm run all:build:dev # Build all projects
npm start             # Run docker-compose (backend services)
npm webapp:start      # Run the WebApp (React)

# Append to the hosts file (AS ADMIN)
# /etc/hosts (Linux/MacOS)
# %SystemRoot%\System32\drivers\etc\hosts (Windows)
127.0.0.1 mywebapp.test
127.0.0.1 api.mywebapp.test
```

The web app and API will become available at:

- http://mywebapp.test:8080 - SPA (client-webapp)
- http://api.mywebapp.test - API (server-api)

Startify includes example **Todo App**, read more about it [below ↓](#todo-app-example).

Start developing using the following commands:

```bash
npm run all:watch    # Watch all projects for changes
npm run api:test     # Run the integration and unit tests (API)
npm stop             # Stop docker-compose
```

See all commands [below ↓](#commands).

> 💡 **Linux users** can lower cpu usage by disabling chokidar's polling:<br>
> In `./docker-compose.dev.yml` delete flag `--legacy-watch`

## 🌳 Project Structure

Monorepo structure:

- Frontend projects start with **client-\*** (e.g. client-adminapp).
- Backend projects start with **server-\*** (e.g. server-payments, server-worker).
- Database projects start with **storage-\*** (e.g. storage-payments, storage-cache).

> 💡 Monorepo ≠ Monolith, you can add additional sub-projects/microservices, e.g. `server-worker`, `server-payments`, `client-adminapp`.

```bash
/.github            # GitHub Actions deploy configs
/.husky             # Git hooks
/.vscode            # VS Code settings
/infrastructure     # Infrastructure configs
/client-webapp      # React application (SPA)
/storage-main       # Database migrations and scripts for the main db (PostgreSQL)
/server-api         # API app
 └── /src
    ├── /config     # Configs for different environments
    ├── /modules    # Modules (see below)
    ├── /plugins    # Fastify plugins
    ├── app.js
    └── main.js
```

Recommended module structure:

```bash
/mymodule
 ├── /tests
 │  ├── mymodule.int.test.js  # Integration tests
 │  └── mymodule.unit.test.js # Unit tests
 ├── mymodule.repository.js   # DAL, SQL
 ├── mymodule.routes.js       # Routes/controllers
 ├── mymodule.schemas.js      # JSON schemas (validation)
 └── mymodule.service.js      # Service (optional)
```

## 🐙 GitLab Flow

- The `main` branch deploys to the **production** environment
- The `develop` branch deploys to the **staging** environment
- The `feature` branch merged (via pull request) to the `develop` branch
- The `develop` branch merged to the `main` branch

### See also

- [Introduction to GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
- [Project Guidelines](https://github.com/elsewhencode/project-guidelines)

## 🚢 Deploy (GitHub Actions ↦ Netlify and Heroku)

The Deployment scheme.
The `RUN_ENV` environment variable highlighted in bold.

```mermaid
graph LR
    PR["Pull Request"]--"merge"-->GH["GitHub Repo<br><em>main, develop</em>"]
    DEV["Local Environment<br><b>development</b>"]--"git push"-->GH
    GH-->CICD["CI/CD GitHub Actions<br><em>lint, test, build, deploy</em><br><b>ci</b>"]
    CICD--"storage-main<br>(migrations)"-->HRKPG["Heroku (PostgreSQL)<br><b>production, staging</b>"]
    CICD--"server-api"-->HRK["Heroku (API)<br><b>production, staging</b>"]
    CICD--"client-webapp"-->NTL["Netlify (SPA)<br><b>production, staging</b>"]
```

### 📦 Requirements

- **[GitHub CLI](https://cli.github.com/)** installed and logged in (`gh auth login`)
- **[Netlify CLI](https://docs.netlify.com/cli/get-started/#installation)** installed and logged in (`netlify login`)
- **[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)** installed and logged in (`heroku login`)

### 💲 Pricing

> **⚠️** Additional charges may apply, make sure you don't exceed FREE plans limits.

- GitHub Actions is **FREE ([Free plan](https://github.com/pricing))**, 2000 mins per months.
- Netlify is **FREE ([Starter plan](https://www.netlify.com/pricing/))**, 100GB/month.
- Heroku is **FREE ([Free plan](https://www.heroku.com/pricing))**, hybernates after 30 mins of inactivity, takes ~10s to wake up and other limitations.

### 🛠️ Initial setup for production environment

> **⚠️** The deploy jobs are **DISABLED BY DEFAULT**! Read the following instruction to enable them.

```bash
cd <your_repo_dir>

# Create a new netlify site and disable features we don't need (forms and assets processing)
# The NETLIFY_SITE_NAME_PRODUCTION must be unique, e.g. my-project-999
# Copy the "Site ID" from the output to the NETLIFY_SITE_ID_PRODUCTION
netlify sites:create --disable-linking --name <NETLIFY_SITE_NAME_PRODUCTION>
netlify api updateSite --data '{ "site_id": "<NETLIFY_SITE_ID_PRODUCTION>", "body": { "processing_settings": { "skip": true, "ignore_html_forms": true } } }'

# Create a new heroku app and add the PostgreSQL addon
# The HEROKU_APP_NAME_PRODUCTION must be unique, e.g. my-project-999-api
heroku apps:create --no-remote --stack=container --addons=heroku-postgresql:hobby-dev <HEROKU_APP_NAME_PRODUCTION>

# Set env vars, the PORT and DATABASE_URL vars are set by Heroku
heroku config:set --app <HEROKU_APP_NAME_PRODUCTION> NODE_ENV=production RUN_ENV=production WEBAPP_URL=https://<NETLIFY_SITE_NAME_PRODUCTION>.netlify.app

# Create a new private GitHub repo and push all the code there
gh repo create <GITHUB_REPO_NAME> --private --push --remote origin --source .

# Set CI/CD (GitHub Actions) secrets
# Get the HEROKU_API_KEY on Heroku's Account Settings page: https://dashboard.heroku.com/account
# Create the NETLIFY_AUTH_TOKEN on Netlify's Applications page https://app.netlify.com/user/applications
# !! Type a space before each command so the keys won't end up in your bash history
gh secret set HEROKU_API_KEY -b "<HEROKU_API_KEY>" -R <YOUR_GITHUB_USERNAME>/<GITHUB_REPO_NAME>
gh secret set NETLIFY_AUTH_TOKEN -b "<NETLIFY_AUTH_TOKEN>" -R <YOUR_GITHUB_USERNAME>/<GITHUB_REPO_NAME>
gh secret set HEROKU_APP_NAME_PRODUCTION -b "<HEROKU_APP_NAME_PRODUCTION>" -R <YOUR_GITHUB_USERNAME>/<GITHUB_REPO_NAME>
gh secret set NETLIFY_SITE_ID_PRODUCTION -b "<NETLIFY_SITE_ID_PRODUCTION>" -R <YOUR_GITHUB_USERNAME>/<GITHUB_REPO_NAME>

echo "REACT_APP_API_URL=https://<HEROKU_APP_NAME_PRODUCTION>.herokuapp.com" >> ./client-webapp/.env.production

# ENABLE DEPLOY JOBS
# Comment the line which contains `if: false` and
# uncomment the line next to it in the following files:
# .github/workflows/server-api.yml
# .github/workflows/client-webapp.yml

# Push changes
# It'll trigger the client-webapp workflow and will deploy our app to Netlify
git add .
git commit -m "Production setup"
git push

# Run the server-api workflow manually because we didn't change any file in server-api dir
# It'll deploy the API service to Heroku
gh workflow run server-api.yml

# Watch the run until it completes
gh run watch
```
Your production site will become available at `https://<NETLIFY_SITE_NAME_PRODUCTION>.netlify.app`.

You can now push changes to the `develop` branch and create a pull request to the `main` branch. After you merge the pull request, CI/CD (GitHub Actions) will automatically deploy your app to the production environment.

> 💡 PostgreSQL: It is recommended that you create multiple roles with specific sets of permissions based on application and access requirements (not available on the hobby-dev plan).<br>
> See https://devcenter.heroku.com/articles/heroku-postgresql-credentials.

### 🛠️ Initial setup for staging environment (optional)

```bash
# HEROKU_APP_NAME_STAGING = e.g. my-project-999-staging
# NETLIFY_SITE_NAME_STAGING = e.g. my-project-999-api-staging
cd <your_repo_dir>

git switch -c develop
git push --set-upstream origin develop

netlify sites:create --disable-linking --name <NETLIFY_SITE_NAME_STAGING>
netlify api updateSite --data '{ "site_id": "<NETLIFY_SITE_ID_STAGING>", "body": { "processing_settings": { "skip": true, "ignore_html_forms": true } } }'

heroku apps:create --no-remote --stack=container --addons=heroku-postgresql:hobby-dev <HEROKU_APP_NAME_STAGING>
heroku config:set --app <HEROKU_APP_NAME_STAGING> NODE_ENV=production RUN_ENV=staging WEBAPP_URL=https://<NETLIFY_SITE_NAME_STAGING>.netlify.app

gh secret set HEROKU_APP_NAME_STAGING -b "<HEROKU_APP_NAME_STAGING>" -R <YOUR_GITHUB_USERNAME>/<GITHUB_REPO_NAME>
gh secret set NETLIFY_SITE_ID_STAGING -b "<NETLIFY_SITE_ID_STAGING>" -R <YOUR_GITHUB_USERNAME>/<GITHUB_REPO_NAME>

echo "REACT_APP_API_URL=https://<HEROKU_APP_NAME_STAGING>.herokuapp.com" >> ./client-webapp/.env.staging

git add .
git commit -m "Staging setup"
git push

gh workflow run server-api.yml --ref develop
```

## 🚚 Migrations

Startify uses **knex** for database migrations.

- Migration files location: `./storage-main/src/migrations/`.
- Migrations run automatically in the **development** and **ci** environments when **docker-compose** starts.
- In the **production** and **staging** environments migrations run in a separate container before release phase (Heroku).
- In the **development** environment, it's possible to run migrations manually using commands:
    - `npm run storage:migrate:latest`
    - `npm run storage:migrate:up`
    - `npm run storage:migrate:down`

### See also

- [Knex documentation](https://knexjs.org/guide/migrations.html)
- [Migrating a production database without any downtime](https://teamplify.com/blog/zero-downtime-DB-migrations/)


## 🧪 Testing

Integration tests examples: `./server-api/src/modules/tasks/tests/tasks.int.test.ts`.

Test commands:

- `npm run webapp:test`
- `npm run api:test`
- `npm run api:test:int`
- `npm run api:test:unit`

> ⚠️ Integration and unit tests for the backend services are run from the inside of the container so make sure you have docker-compose running (`npm start`).

### Integration tests execution

All integration tests run sequentially to avoid side effects from parallel tests. You have to manually clean tables after each test, e.g. `afterEach(async () => fastifyApp.pg.query('TRUNCATE TABLE tasks'))`. The test run looks like this:

```mermaid
graph LR
    SETUP["Test Setup<br><em>create the test table</em>"]-->MIGRATION
    MIGRATION["Apply Migrations<br><em>applied to the test table</em>"]-->TESTING
    TESTING["Run integration tests<br><em>Your tests</em>"]-->CLEANUP
    CLEANUP["Test Teardown<br><em>delete the test table</em>"]
```

### See also

- [IntegreSQL](https://github.com/allaboutapps/integresql)
- [Integration tests best practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)

## 🛠️ Debugging

Debugging is **DISABLED BY DEFAULT** for the **server-api** service! To enable debugging uncomment line with `--inspect` flag in the `docker-compose.dev.yml` and restart docker-compose. You can now attach your debugger to the process which listening on `127.0.0.1:9229`.

> ⚠️ The `nodemon` with `--inspect` flag doesn't pass signals (SIGTERM, SIGINT, etc) to the child processes, so graceful shutdown won't work while debugging.
> See https://github.com/remy/nodemon/issues/1861.


### VS Code

Startify includes debugger configuration (`.vscode/launch.json`) for VS Code. In order to start a debug session, first select the configuration named **Debug Server API** or **Debug Client WebApp** using the Configuration dropdown in the Run view. Once you have your launch configuration set, start your debug session with `F5`.

## Todo App example

To simplify development process, the example app uses modified REST API (which is similar to the JSON-RPC):

- The name of the called procedure is in the url, e.g. `/tasks/create`
- Only POST http method is used, e.g. `POST /tasks/create`, `POST /tasks/get-all`
- All params of the procedure are in the http body as json

### See also

- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

## Environment variables

Environment variables loaded from the `.env` file used only in the `development` and `ci` environments.

| Variable | Description |
|---|---|
| `WEBAPP_URL` | The URL of to your SPA, e.g. `http://mywebapp.test:8080` (used by the CORS plugin) |
| `RUN_ENV` | Running environment |
| `NODE_ENV` | Node environment |
| `PORT` | Port |
| `DATABASE_URL` | Database connection string, e.g. `postgres://user:password@hostname:5432/database` |
| `DATABASE_TESTING_URL` | Testing database connection string |

## Commands

List of the available commands. Run the commands from the root of the repo as `npm run <command>`.

### Common commands

`<project> = all | webapp | storage | api`

| Command | Description |
|---|---|
| `start`                  | Start docker-compose for development |
| `stop`                   | Stop docker-compose |
| `<project>:prettier`     | Run prettier (only check) |
| `<project>:prettier:fix` | Run prettier (fix) |
| `<project>:lint`         | Run eslint (only check) |
| `<project>:build`        | Build the project |
| `<project>:build:dev`    | Build the project with source maps |
| `<project>:watch`        | Watch for changes |
| `all:watch`              | Watch for changes in all **server-\*** and **storage-\*** projects |

### WebApp commands

| Command | Description |
|---|---|
| `webapp:watch` | Watch for changes in the **client-webapp** project |
| `webapp:test`  | Run tests |

### API commands

> 💡 Make sure you have docker-compose running before running the following commands.

| Command | Description |
|---|---|
| `api:test`      | Run integration & unit tests |
| `api:test:int`  | Run integration tests |
| `api:test:unit` | Run unit tests |
| `api:ssh`       | SSH into the container |
| `api:logs`      | Fetch the logs of the container |

### Storage commands

| Command | Description |
|---|---|
| `storage:migrate:latest` | Run all migrations that have not yet been run |
| `storage:migrate:up`     | Run the next migration that has not yet been run |
| `storage:migrate:down`   | Undo the last migration that was already run |
| `storage:psql`           | Run **psql** CLI |
| `storage:ssh`            | SSH into the container |
| `storage:logs`           | Fetch the logs of the container |

## Exposed local ports

| IP / Host | Description |
|---|---|
| **127.0.0.1:80** (api.mywebapp.test) | Nginx |
| **127.0.0.1:8080** (mywebapp.test) | React web server |
| **127.0.0.1:3000** | Node.js API app |
| **127.0.0.1:9229** (disabled by default) | Node.js API debug |
| **127.0.0.1:5432** | PostgreSQL |
