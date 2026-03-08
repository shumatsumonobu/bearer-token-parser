# Sandbox

Minimal Express app for manual testing. Token is `mytoken123`.

## Start

```bash
npm run build   # Build the library from project root
cd sandbox
npm install

# ESM
npm start           # http://localhost:3000
# Stop with Ctrl+C, then try CJS
npm run start:cjs   # http://localhost:3000
```

## Test Commands

```bash
# Header (GET /header)
curl -i -H "Authorization: Bearer mytoken123" http://localhost:3000/header   # → 200
curl -i http://localhost:3000/header                                          # → 401

# Query (GET /query)
curl -i http://localhost:3000/query?access_token=mytoken123   # → 200
curl -i http://localhost:3000/query                            # → 401

# Body (POST /body)
curl -i -X POST -H "Content-Type: application/json" \
  -d '{"access_token":"mytoken123"}' http://localhost:3000/body   # → 200
curl -i -X POST -H "Content-Type: application/json" \
  -d '{}' http://localhost:3000/body                               # → 401
```

- **200** — `{"message":"Authenticated","token":"mytoken123"}`
- **401** — `WWW-Authenticate` header with error details
