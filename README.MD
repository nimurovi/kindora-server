# 🌱 Kindora Backend — Powering Community Impact

Kindora Backend is the server-side foundation of the Kindora Social Development Events Platform. It handles event management, database operations, user-related activities, and secure communication between the frontend and backend.

Built with Node.js, Express.js, and MongoDB, it helps communities connect and participate in meaningful social initiatives.

## 🔗 Project Links

- **Live Website:** [Kindora](https://kindora-iota.vercel.app)
- **Frontend:** Next.js
- **Backend:** Node.js + Express.js

## 🚀 Core Features

- 📡 **RESTful API:** Provides structured API endpoints for frontend communication.
- 📝 **Event Creation:** Store and manage social development events.
- 🔍 **Event Discovery:** Retrieve upcoming events and individual event details.
- ✏️ **Event Management:** Update and delete events created by authorized users.
- 🤝 **Event Participation:** Allow users to join social development events.
- 👥 **Joined Events Tracking:** Retrieve events that users have joined.
- 🗄️ **MongoDB Integration:** Efficiently store and retrieve event and participation data.
- 🔐 **JWT Authentication:** Verify tokens to protect restricted API endpoints.
- 🌐 **CORS Configuration:** Enable communication with the Kindora frontend.
- ⚠️ **Error Handling:** Handle API errors and invalid requests appropriately.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| JWT | API authentication |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

## 📦 Installation

### 1. Clone the Repository

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
```

### 2. Navigate to the Backend Directory

```bash
cd kindora-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

Add any additional authentication or JWT environment variables required by your implementation.

### 5. Start the Server

For development:

```bash
npm run dev
```

Or:

```bash
node index.js
```

The backend will run at:

```text
http://localhost:8000
```

## 🔌 API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/recent-upcoming-events` | GET | Retrieve upcoming events |
| `/create-event` | POST | Create a new event |
| `/get-event/:email` | GET | Retrieve events created by a user |
| `/update-event/:email` | PATCH/PUT | Update an event |
| `/delete-event/:email` | DELETE | Delete an event |
| `/get-event-by-id/:id` | GET | Retrieve event details |
| `/join-event` | POST | Join an event |
| `/my-joined-events` | GET | Retrieve joined events |

*Adjust the HTTP methods if your implementation differs.*

## 🎯 Project Goal

Kindora Backend aims to provide a reliable and secure API infrastructure for community-driven social development activities, helping people organize events and create positive change.

---

**Kindora Backend — Connecting technology with social good.**
