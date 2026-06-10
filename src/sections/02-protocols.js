// Section 2 — Protocols
export default {
  sec: "Protocols", color: "#48d6c0",
  lessons: [
    { id: "tcpudp", title: "TCP & UDP", anim: "tcpudp",
      what: "The two core transport protocols — reliable vs. fast.",
      points: [
        "TCP: connection-oriented, ordered, reliable. Three-way handshake, acknowledgements, retransmits lost packets.",
        "UDP: connectionless, no ordering or delivery guarantees, minimal overhead.",
        "TCP for correctness (web, email, file transfer); UDP for speed where occasional loss is fine.",
        "UDP underlies live video, gaming, DNS queries, and VoIP.",
      ],
      use: "A Zoom call uses UDP: if one frame of audio drops, you'd rather skip it than freeze the whole call waiting for a resend. Loading the Zoom website, though, uses TCP — every byte must arrive.",
      code: `import socket

# TCP: connection-oriented, reliable, ordered
tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# tcp.connect((host, port))  # performs the 3-way handshake

# UDP: connectionless, fast, no delivery guarantee
udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
udp.sendto(b"ping", ("127.0.0.1", 9999))  # fire-and-forget, no handshake` },
    { id: "http", title: "HTTP — The Backbone of the Web", anim: "http",
      what: "The request/response protocol every web interaction is built on.",
      points: [
        "Stateless: each request carries everything needed (headers + body).",
        "Methods convey intent: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).",
        "Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error.",
        "HTTP/2 multiplexes requests; HTTP/3 runs over QUIC/UDP for lower latency.",
      ],
      use: "Every time you click a link, your browser sends an HTTP GET. When you submit a form, it's a POST. The status code (200, 404, 500) tells the browser exactly what happened.",
      code: `import requests

r = requests.get("https://api.github.com/repos/python/cpython")
print(r.status_code)          # 200
print(r.json()["stargazers_count"])

# Methods convey intent
requests.post("https://httpbin.org/post", json={"name": "ada"})
requests.put("https://httpbin.org/put", json={"name": "ada"})
requests.delete("https://httpbin.org/delete")` },
    { id: "rest", title: "REST & RESTfulness — API Design Principles", anim: "rest",
      what: "A convention for designing clean, predictable web APIs around resources.",
      points: [
        "Resources are nouns (/users, /orders); HTTP verbs are the actions on them.",
        "Stateless — the server keeps no client context between requests.",
        "Uniform, predictable URLs and standard status codes make APIs self-documenting.",
        "Responses are cacheable, and the same resource has one canonical URL.",
      ],
      use: "GitHub's API is RESTful: GET /repos/{owner}/{repo} fetches a repo, POST /repos creates one, DELETE removes it. Any developer can guess the endpoints because they follow REST conventions.",
      code: `from flask import Flask, jsonify, request

app = Flask(__name__)
users = {}

@app.get("/users/<int:uid>")     # read a resource
def get_user(uid):
    return jsonify(users.get(uid, {}))

@app.post("/users")              # create a resource
def create_user():
    uid = len(users) + 1
    users[uid] = request.json
    return jsonify(id=uid), 201` },
    { id: "realtime", title: "Real-Time Communication Protocols", anim: "realtime",
      what: "Techniques for pushing data instantly instead of waiting for polls.",
      points: [
        "Polling repeatedly asks 'any updates?' — simple but wasteful.",
        "WebSockets open a persistent two-way channel for instant bidirectional messages.",
        "Server-Sent Events (SSE) push one-way updates from server to client over HTTP.",
        "Long-polling is a fallback that holds a request open until data is ready.",
      ],
      use: "WhatsApp uses WebSockets so messages appear the instant they're sent — no refreshing. A live sports scoreboard might use SSE to stream score updates down to your browser.",
      code: `import asyncio
import websockets

# A persistent, two-way channel — push the instant data is ready
async def handler(ws):
    async for message in ws:              # receive whenever client sends
        await ws.send(f"echo: {message}") # push back immediately

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()            # run forever

asyncio.run(main())` },
    { id: "modernapi", title: "Modern API Protocols — Beyond REST", anim: "modernapi",
      what: "gRPC and GraphQL solve REST's pain points for specific use cases.",
      points: [
        "gRPC: binary Protocol Buffers over HTTP/2 — fast, strongly typed, great for service-to-service.",
        "GraphQL: clients request exactly the fields they need from one endpoint — no over/under-fetching.",
        "gRPC supports streaming; payloads are ~7× smaller than JSON.",
        "REST is still ideal for public, cacheable, human-readable APIs.",
      ],
      use: "Internally, Google's microservices talk via gRPC for speed. Facebook built GraphQL so its mobile app could fetch a post, its author, and comments in one request — avoiding dozens of REST calls on a slow connection.",
      code: `import grpc
from concurrent import futures
import demo_pb2, demo_pb2_grpc   # generated from a .proto schema

class Greeter(demo_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        return demo_pb2.Reply(message=f"hi {request.name}")

server = grpc.server(futures.ThreadPoolExecutor())
demo_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
server.add_insecure_port("[::]:50051")  # binary protobuf over HTTP/2
server.start()` },
  ],
};
