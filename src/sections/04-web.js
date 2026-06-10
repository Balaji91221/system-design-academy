// Section 4 — Web Concepts in System Design
export default {
  sec: "Web Concepts in System Design", color: "#bb9af7",
  lessons: [
    { id: "session", title: "Web Sessions: Managing State", anim: "session",
      what: "How stateless HTTP remembers who you are across requests.",
      points: [
        "Server-side sessions: state lives in a store (Redis); the client holds only a session ID cookie.",
        "Token-based (JWT): signed token carries the state, so servers stay stateless and scale freely.",
        "Cookies transport the identifier; flags (HttpOnly, Secure, SameSite) harden them.",
        "Stateless tokens make horizontal scaling easy — any server can validate them.",
      ],
      use: "When you log into Gmail and stay logged in, a session/token identifies you on every request. With JWTs, any of Google's thousands of servers can verify you without a shared session lookup.",
      code: `import jwt, time   # PyJWT

SECRET = "super-secret"

# Stateless JWT: the signed token carries the claims
token = jwt.encode({"uid": 1, "exp": time.time() + 3600},
                   SECRET, algorithm="HS256")

# Any server can verify it without a shared session store
claims = jwt.decode(token, SECRET, algorithms=["HS256"])
print(claims["uid"])   # 1` },
    { id: "serial", title: "Serialization: Data Exchange Formats", anim: "serial",
      what: "Converting in-memory objects into bytes for transport or storage, and back.",
      points: [
        "JSON: human-readable, ubiquitous, but verbose and slower to parse.",
        "Protocol Buffers / Avro / MessagePack: compact binary, fast, schema-driven.",
        "XML: verbose and legacy, still common in enterprise/SOAP systems.",
        "Choice trades readability vs. size/speed; binary wins at high scale.",
      ],
      use: "A public REST API returns JSON because developers read it directly. Internally, high-throughput services serialize with Protocol Buffers to shrink payloads and cut CPU spent parsing.",
      code: `import json

user = {"id": 1, "name": "Ada", "roles": ["admin"]}

# Serialize: object -> string for transport or storage
blob = json.dumps(user)
print(blob)               # {"id": 1, "name": "Ada", "roles": ["admin"]}

# Deserialize: bytes/string -> object
restored = json.loads(blob)
print(restored["name"])   # Ada` },
    { id: "cors", title: "CORS: Cross-Origin Resource Sharing", anim: "cors",
      what: "The browser rule controlling which sites may call which APIs.",
      points: [
        "By default, browsers block JS from reading responses from a different origin (same-origin policy).",
        "The server opts in via Access-Control-Allow-Origin and related headers.",
        "Preflight OPTIONS requests check permissions before non-simple requests.",
        "It's a browser-enforced policy — not a substitute for real server-side auth.",
      ],
      use: "Your frontend at app.com calling api.com fails unless api.com sends CORS headers allowing app.com. This is why integrating a third-party API from the browser sometimes requires the provider to whitelist your domain.",
      code: `from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
# Server opts in: only this origin may read responses from JS
CORS(app, resources={r"/api/*": {"origins": "https://app.com"}})

@app.get("/api/data")
def data():
    return {"ok": True}   # browser now lets app.com read this response` },
  ],
};
