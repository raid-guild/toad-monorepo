# TOAD UI

TOAD (Trustless Onchain Autonomous Delegate) is an AI-powered voting delegate system. This repo contains the UI and AI agent. The UI is built with Vercel AI SDK and the AI agent uses GOAT. 

## Development

1. Modify the .env.example file with your own information
2. Rename .env.example to .env
3. To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- A domain name with DNS access
- A server with ports 80 and 443 accessible
- This assumes you have a DNS setup of: 
  - dao.domain.com -> your TOAD agent UI
### Environment Variables
Create a file called dao.env and replace the info given with your own
```
# These two should likely be the same
WALLET_PRIVATE_KEY=0x123...
TOAD_WALLET_PRIVATE_KEY=0x123...
# The address of the TOAD contract
TOAD=0x123...
# The address of the governor contract
GOVERNOR_ADDRESS=0x789fC99093B09aD01C34DC7251D0C89ce743e5a4
# Requests per hour
RATE_LIMIT=10

# The RPC URL/chain id for the chain you want to use
RPC_URL=https://sepolia.gateway.tenderly.co
CHAIN_ID=11155111

# The base URL for the Discourse instance you want to use
DISCOURSE_BASE_URL=https://governance.toadn.com/

# Optional, if you are getting rate limited by Discourse, you can sign in to get higher limits
DISCOURSE_API_KEY=
DISCOURSE_USERNAME=

# The governance organization slug as it appears on Tally
GOVERNANCE_ORGANIZATION_NAME=toad-dao
# This description is passed as a system prompt to the Agent
ORGANIZATION_DESCRIPTION="A testing DAO for TOAD"

# OpenAI Compatible API Key
OPENAI_BASE_URL=
OPENAI_API_KEY=sk-proj-123...
OPENAI_MODEL=

# The governance organization slug as it appears on Tally
GOVERNANCE_ORGANIZATION_NAME=toad-dao
# The API key for Tally
TALLY_API_KEY=123...
# The log level you want to use
DEBUG_MODE=false
TOAD_API_ENDPOINT=https://sepolia.toadn.com/api/
MULTICALL_ADDRESS=0xcA11bde05977b3631167028862bE2a173976CA11

# Application Configuration (Mostly a copy of the others so that the front-end has access)
NEXT_PUBLIC_MULTICALL=0xcA11bde05977b3631167028862bE2a173976CA11
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.gateway.tenderly.co
NEXT_PUBLIC_APP_URL=http://localhost:3000 
NEXT_PUBLIC_GOVERNANCE_ORGANIZATION_NAME=toad-dao
NEXT_PUBLIC_SUPPORTED_CHAINS=11155111
NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS=0xe3282BeA7c7d56aCD1A4CD4495671A942404e0bC
NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=0x47e169F261411a7Ac478AC0D251c243f9f96707D
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=123...
NEXT_PUBLIC_DISCOURSE_BASE_URL=https://forum.arbitrum.foundation/
```
### Setup Instructions

1. Create a `docker-compose.yaml` file with the following content:

```yaml
services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: always
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=home_web"
  toad-ui-dao:
    image: pupcakes/toad-ui
    container_name: toad-ui-dao
    restart: always
    expose:
      - "3000"
    volumes:
      - ./dao.env:/app/.env
    networks:
      - web
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 300s
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=home_web"
      - "traefik.http.routers.toad-ui-dao.rule=Host(`dao.domain.com`)"
      - "traefik.http.routers.toad-ui-dao.entrypoints=web"
      - "traefik.http.routers.toad-ui-dao.service=toad-ui-dao"
      - "traefik.http.services.toad-ui-dao.loadbalancer.server.port=3000"
      - "traefik.http.services.toad-ui-dao.loadbalancer.healthcheck.path=/"
      - "traefik.http.services.toad-ui-dao.loadbalancer.healthcheck.interval=10s"
      - "traefik.http.services.toad-ui-dao.loadbalancer.healthcheck.timeout=5s"

  toad-wallet-dao:
    image: pupcakes/toad-wallet
    container_name: toad-wallet-dao
    restart: always
    volumes:
      - ./dao.env:/usr/src/app/.env

networks:
  web:
    name: home_web
    driver: bridge
```

2. Configure your environment:
   - Create a `dao.env` file with your environment variables
   - Update the domain in the docker-compose.yaml file (replace `dao.domain.com` with your actual domain)

3. DNS Configuration:
   - Point your domain's DNS A record to your server's IP address
   - If using a subdomain (recommended), create a CNAME record pointing to your main domain

4. Deployment Steps:
   ```bash
   # First, bring up the TOAD UI container
   docker compose up -d toad-ui-dao

   # Check the logs
   docker compose logs toad-ui-dao

   # Once the UI is running, bring up the rest of the services
   docker compose up -d
   ```

5. Verify the deployment:
   - Access your TOAD UI at `http://dao.domain.com` (replace with your actual domain)
   - Check the Traefik dashboard for service status
   - Monitor container logs if needed: `docker compose logs -f`

### Notes
- Make sure to replace `dao.domain.com` with your actual domain in the docker-compose.yaml file
- The deployment assumes you're using Traefik as a reverse proxy
- Health checks are configured to ensure service availability
- All services are configured to restart automatically in case of failure
