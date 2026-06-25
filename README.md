# IP Geolocation & Mapping App

A lightweight Express.js web app that resolves an IP address to geographical coordinates and dynamically renders an interactive OpenStreetMap embed.

---

## 🚀 Features

* **Dual API Integration:** Uses `country.is` for IP-to-coordinates and `OpenStreetMap` for mapping.
* **Interactive Map Iframe:** Embeds OpenStreetMap directly for native panning/zooming, with coordinates updated dynamically via URL string modifications.
* **Data Sanitization:** Pre-cleans external API data on the server side before passing payloads to EJS templates.
* **Dockerized:** Fully containerized for instant, consistent environment setup.

---

## 🛠️ Architecture & Data Flow

The project showcases two architectural patterns for handling dependent API workflows:

### 1. Current Architecture: The Frontend "Bridge"
Splits the workflow into two distinct steps, using the client UI to pass state:
1. **`/find-me` (Server):** Takes the IP, fetches coordinates from `api.country.is`, cleans the data, and sends it to `index.ejs`.
2. **The "Bridge" (Frontend):** Receives the coordinates and populates a hidden form. The user clicks a button to submit it.
3. **`/map-me` (Server):** Reads the form coordinates, calculates the map bounding box (`bbox`), creates the OpenStreetMap iframe URL, and re-renders the final view.

### 2. Alternative Architecture: Backend API Chaining
Consolidates the flow into a single server-side request lifecycle:

POST "/find-me"
└── 1. Get IP input
└── 2. Fetch data from api.country.is
└── 3. Extract coordinates
└── 4. IF valid -> Calculate bounding box & generate OpenStreetMap URL
       ELSE     -> Set map link to null
└── 5. Send combined data (IP, country, map link) back in a single view render

## 🐳 Docker Setup

1. **Build the image:**
```bash
docker build -t ip-geolocation-app .

```


2. **Run the container:**
```bash
docker run -p 3000:3000 ip-geolocation-app

```


3. **Access the app:** Open your browser and navigate to `http://localhost:3000`.

---

## 🔧 Tech Stack

* **Backend:** Node.js, Express.js, EJS
* **DevOps:** Docker
* **APIs:** [country.is](https://country.is/) & [OpenStreetMap API](https://wiki.openstreetmap.org/wiki/API)


----
## 🛠️ Next Up: The "To-Do" List (Future Upgrades)

No project is ever truly finished! Here is what I found as suggestions that could have made this app more robust:
* **Adding a Brain (Caching with Redis):** Upstream APIs can get grumpy or rate-limit us. Integrating a Redis cache will let the app remember previously searched IPs, making repeat lookups lightning-fast.
* **Bulletproofing the Inputs:** Adding strict validation to stop weird formatting or broken IP strings before they even hit the server. 
* **Writing the Tests I Skipped:** Setting up an automated testing suite with **Jest** and **Supertest** to make sure a future update doesn’t accidentally break the routes.
