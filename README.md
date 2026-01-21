# Chat App

A real-time chat application built with ASP.NET Core Web API and React.

## Prerequisites

- .NET 9 SDK
- Node.js 18+ and npm
- SQL Server

## Backend Setup

```bash
cd ChatApp.Backend/ChatApp.Api
dotnet restore
dotnet ef database update --project ../ChatApp.Infrastructure
dotnet run
```

Backend runs on `http://localhost:5121`

## Frontend Setup

```bash
cd chat-app.frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Demo Data

The database is automatically seeded with demo users, chats, and messages on first startup.
