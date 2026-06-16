import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  console.log(`listening on port ${port}`);
  res.render("index.ejs");
});

app.post("/find-me", async (req, res) => {
  try {
    const customIp = req.body.customIp ? req.body.customIp.trim() : "";
    
    
    let apiUrl = `https://api.country.is/?fields=location`;
    if (customIp !== "") {
      apiUrl = `https://api.country.is/${customIp}?fields=location`;
    }

    console.log(`geolocation data from: ${apiUrl}`);
    const result = await axios.get(apiUrl);
    const rawData = result.data;

    const cleanedData = {
      countryCode: (rawData.country || 'Unknown').toUpperCase(),
      userIp: rawData.ip ? rawData.ip.trim() : "IP Not Found",
      lat: rawData.location?.latitude || null,
      lon: rawData.location?.longitude || null,
      mapUrl: null
    };

    res.render("index.ejs", { data: cleanedData });

  } catch(error) {
    console.error("Lookup Error:", error.message);
    res.status(500).render("index.ejs", {
      data: { countryCode: "INVALID IP / ERROR", userIp: "0.0.0.0", lat: null, lon: null, mapUrl: null }
    });
  }
});

app.post("/map-me", (req, res) => {
  console.log("--- Hidden Form Body Received ---");
  console.log(req.body); 

  const lat = parseFloat(req.body.lat);
  const lon = parseFloat(req.body.lon);
  const countryCode = req.body.countryCode;
  const userIp = req.body.userIp;

  let embedMapUrl = null;

  if (!isNaN(lat) && !isNaN(lon)) {
    const delta = 0.02;
    const minLon = lon - delta;
    const minLat = lat - delta;
    const maxLon = lon + delta;
    const maxLat = lat + delta;

    embedMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat},${lon}`;
  }

  const updatedData = {
    countryCode: countryCode || "Unknown",
    userIp: userIp || "0.0.0.0",
    lat: lat,
    lon: lon,
    mapUrl: embedMapUrl 
  };

  res.render("index.ejs", { data: updatedData });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});