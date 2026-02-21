# 🚀 CollabSphere

> A scalable real-time collaborative document editing engine built with NestJS and Next.js.

CollabSphere is a Google Docs–like system that enables multiple users to edit the same document simultaneously with low latency and consistency guarantees.
It uses a hybrid real-time communication architecture combining **WebSockets, Server-Sent Events (SSE), and Polling** to ensure reliability, scalability, and fault tolerance.

---

## ✨ Key Features

* ⚡ Real-time multi-user document editing
* 👥 Live cursor tracking & presence awareness
* 🔐 Role-based access control (Viewer / Editor)
* 🧠 Conflict resolution using Operational Transformation / CRDT principles
* 📜 Document version history & recovery
* 🔄 Autosave & state reconciliation
* 🌐 Horizontal scalability with Redis Pub/Sub
* 🔁 Auto-reconnect & recovery handling

---

## 🏗️ System Architecture

![Image](https://substackcdn.com/image/fetch/%24s_%21Zgn9%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1ffbdbb0-1511-49e9-b43f-4b95469a4bec_2144x1742.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AZOvd7h41rtYPVvxUcyP5Kw.png)

![Image](https://bunnyacademy.b-cdn.net/What-is-SSE-Server-Sent-Events-and-how-do-they-work.svg)

CollabSphere follows a hybrid communication model:

### 🔹 WebSockets

* Real-time document edits
* Cursor synchronization
* Delta broadcasting
* Room-based collaboration

### 🔹 Server-Sent Events (SSE)

* Presence updates (user joined/left)
* Typing indicators
* Permission updates
* System notifications

### 🔹 Polling

* Periodic autosave
* Version mismatch detection
* State recovery after reconnect

This design balances performance with reliability.

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* Socket.IO Client
* Rich Text Editor (TipTap / Slate / Quill)

### Backend

* NestJS
* Socket.IO
* REST APIs
* JWT Authentication

### Database & Infrastructure

* PostgreSQL
* Redis (Pub/Sub & in-memory session state)
* Docker (optional)
* Nginx (production-ready setup)

---

## 🔄 Real-Time Flow

1. User authenticates via REST API.
2. Client establishes WebSocket connection with JWT.
3. User joins a document room.
4. Edits are sent as deltas.
5. Server validates and broadcasts updates.
6. Clients apply transformation logic.
7. Polling ensures version consistency.
8. Periodic snapshots are persisted.

---

## 📈 Scalability Design

![Image](https://socket.io/images/broadcasting-redis.png)

![Image](https://ik.imagekit.io/ably/ghost/prod/2022/10/horizontal-scaling-diagram.png)

![Image](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a79a64a389ab1c9f/2017/05/03/PubSub.png)

![Image](https://websocket.org/_astro/websockets-pubsub-pattern.DGkS3Znz_Zpb6FO.webp)

To support horizontal scaling:

* Multiple stateless NestJS instances
* Redis adapter for WebSocket synchronization
* Load balancer distribution
* Version-based conflict management

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/collabsphere.git
cd collabsphere
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

* User logs in via REST endpoint
* JWT issued upon successful authentication
* JWT sent during WebSocket handshake
* Role-based authorization enforced per document

---

## 📌 Engineering Highlights

* Hybrid real-time communication model
* Delta-based document synchronization
* Conflict resolution strategy
* Distributed session management
* Modular NestJS architecture
* Production-scalable infrastructure design

---

## 🧪 Future Improvements

* Full CRDT-based distributed editing
* Comments & mentions
* Activity timeline
* File uploads
* Real-time analytics dashboard
* End-to-end encryption

---

## 🎯 Project Vision

CollabSphere is designed to demonstrate real-world distributed system thinking, scalable real-time communication, and strong backend architecture principles.

It serves as a production-grade portfolio project showcasing:

* System design capability
* Backend engineering depth
* Real-time application development
* Scalable architecture patterns
