
# Noona-Vault

**Noona-Vault** is the central data handler of The Noona Project. It exposes a REST API for CRUD operations and connects to internal MongoDB and Redis instances to persist and cache data.

---

## Features

- Accepts standardized JSON requests from other Noona services
- Handles create/read/update/delete operations
- Dynamic MongoDB collections via the `target` field
- Redis support for fast caching and pub-sub (planned)
- Verifies JWT tokens from `noona-warden` for secure access

---

## API Payload Structure

```json
{
  "database": "mongo",
  "action": "create",
  "target": "pastNotify",
  "data": {
    "title": "System Alert",
    "timestamp": "2025-03-21T15:00:00Z"
  }
}```