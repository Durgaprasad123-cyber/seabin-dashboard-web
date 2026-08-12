# 🌊 SeaBin IoT Monitoring System

A full-stack, production-ready IoT monitoring system for smart **SeaBins** written in **100% JavaScript**. 

Each SeaBin uses an ESP32 micro-controller to capture ocean debris telemetry (trash level % and inner bin water level %) and sends it to the Node.js backend. The backend validates the payload, updates device status in **Supabase PostgreSQL**, and serves dynamic JSON APIs to the React dashboard.

---

## 🏗️ System Architecture

```text
                    ┌──────────────┐
                    │    ESP32     │
                    │    SeaBin    │
                    └──────┬───────┘
                           │
                       POST JSON
                           │
                           ▼
                  ┌──────────────────┐
                  │    AWS EC2       │
                  │                  │
                  │     Nginx        │
                  │       ↓          │
                  │ Node.js Express  │
                  └────────┬─────────┘
                           │
                      Supabase API
                           │
                           ▼
                  ┌──────────────────┐
                  │    Supabase      │
                  │   PostgreSQL     │
                  │                  │
                  │    devices       │
                  │ sensor_readings  │
                  └────────┬─────────┘
                           │
                         GET
                           │
                           ▼
                  ┌──────────────────┐
                  │ React + Vite     │
                  │ Tailwind CSS     │
                  │                  │
                  │ Dashboard        │
                  │ Devices          │
                  │ Locations        │
                  │ Device Details   │
                  └──────────────────┘
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 + Vite (JavaScript `.jsx`)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js (JavaScript `.js`)
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`)
- **Security & Utilities**: `cors`, `helmet`, `express-rate-limit`, `dotenv`

---

## 📁 Repository Structure

```text
seabin-monitoring-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   │   ├── deviceController.js
│   │   │   └── locationController.js
│   │   ├── services/
│   │   │   ├── deviceService.js
│   │   │   └── locationService.js
│   │   ├── routes/
│   │   │   ├── deviceRoutes.js
│   │   │   ├── locationRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── utils/
│   │   │   ├── deviceStatus.js
│   │   │   └── validation.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (Sidebar, Navbar, Layout)
│   │   │   ├── dashboard/ (LevelCard, StatusCard, LocationCard, LastUpdated)
│   │   │   ├── devices/ (DeviceCard, DeviceGrid)
│   │   │   ├── locations/ (LocationCard)
│   │   │   └── common/ (ProgressBar, StatusBadge, Loading, EmptyState, ErrorMessage)
│   │   ├── pages/ (Dashboard, Devices, DeviceDetails, Locations)
│   │   ├── services/ (api, deviceService, locationService)
│   │   ├── hooks/ (useDevices)
│   │   ├── utils/ (statusUtils, formatUtils)
│   │   ├── routes/ (AppRoutes)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🗄️ Supabase PostgreSQL Setup

### 1. Create Tables in Supabase SQL Editor

Open your Supabase Project -> **SQL Editor** and run the following script:

```sql
-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create `devices` table
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT UNIQUE NOT NULL,
    city TEXT DEFAULT 'Unknown City',
    location_name TEXT DEFAULT 'Unspecified Location',
    latitude DOUBLE PRECISION DEFAULT 0,
    longitude DOUBLE PRECISION DEFAULT 0,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create `sensor_readings` table
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    trash_level INTEGER NOT NULL CHECK (trash_level >= 0 AND trash_level <= 100),
    inner_bin_water_level INTEGER NOT NULL CHECK (inner_bin_water_level >= 0 AND inner_bin_water_level <= 100),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_devices_device_id ON devices(device_id);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_lookup ON sensor_readings(device_id, timestamp DESC);
```

---

## 🔑 Environment Variables Setup

### Backend `.env` (`backend/.env`)

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_side_service_role_key
NODE_ENV=development
DEVICE_OFFLINE_TIMEOUT=120
```

> [!CAUTION]
> The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security (RLS) and must **ONLY** be kept securely on the Node.js backend. **NEVER** expose this key in the frontend code or public repositories!

### Frontend `.env` (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 💻 Local Development Setup

### 1. Start Backend API Server
```bash
cd backend
npm install
npm run dev
```
Backend will run at `http://localhost:5000`.

### 2. Start Frontend React Dashboard
```bash
cd frontend
npm install
npm run dev
```
Dashboard will run at `http://localhost:3000`.

---

## 🧪 Testing Telemetry & Auto-Registration (curl / Postman)

### Ingest Telemetry for `SEABIN-001` (Chennai)
```bash
curl -X POST http://localhost:5000/api/v1/devices/data \
-H "Content-Type: application/json" \
-d '{
  "deviceId": "SEABIN-001",
  "trashLevel": 72,
  "innerBinWaterLevel": 35,
  "city": "Chennai",
  "locationName": "Marina Beach",
  "latitude": 13.0500,
  "longitude": 80.2824
}'
```

### Ingest Telemetry for New Device `SEABIN-002` (Hyderabad)
Sending data for an unregistered device will **automatically** create a new record in Supabase and display it on the React dashboard without any code changes:
```bash
curl -X POST http://localhost:5000/api/v1/devices/data \
-H "Content-Type: application/json" \
-d '{
  "deviceId": "SEABIN-002",
  "trashLevel": 25,
  "innerBinWaterLevel": 15,
  "city": "Hyderabad",
  "locationName": "Hussain Sagar / Tank Bund",
  "latitude": 17.4239,
  "longitude": 78.4738
}'
```

---

## ☁️ AWS EC2 Ubuntu Deployment Guide

### Step 1: Create AWS EC2 Instance
- Launch an **Ubuntu 22.04 LTS** EC2 instance.
- Configure Security Group:
  - Allow **SSH (Port 22)**
  - Allow **HTTP (Port 80)**
  - Allow **HTTPS (Port 443)**
  - *Do NOT expose Port 5000 directly to the internet.*

### Step 2: Connect to Server via SSH
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Required Packages (Node.js, PM2, Nginx)
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### Step 4: Clone Codebase & Install Backend
```bash
git clone https://github.com/your-username/seabin-monitoring-system.git
cd seabin-monitoring-system/backend
npm install --production
```

### Step 5: Configure Production `.env`
```bash
nano .env
```
Paste environment configuration:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
DEVICE_OFFLINE_TIMEOUT=120
```

### Step 6: Start Backend Process with PM2
```bash
pm2 start src/server.js --name seabin-api
pm2 save
pm2 startup
```

### Step 7: Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/seabin-api
```
Add Nginx configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site & test configuration:
```bash
sudo ln -s /etc/nginx/sites-available/seabin-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Enable SSL / HTTPS with Let's Encrypt (Certbot)
```bash
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🛡️ Security Features
- **Centralized API Security**: Express backend uses `helmet` for HTTP headers, `cors` for restricted domain access, and `express-rate-limit` for DDoS prevention.
- **Dynamic Device Status**: Device status (`ONLINE` / `OFFLINE`) is calculated dynamically from the `last_seen` timestamp vs `DEVICE_OFFLINE_TIMEOUT` threshold rather than stored statically.
