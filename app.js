const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fsdweek3";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || "local-demo-secret-change-before-deployment",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000, httpOnly: true }
}));

// -----------------------------
// Middleware 1: JSON Parser
// -----------------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------
// Middleware 2: Logger
// -----------------------------
function logger(req, res, next) {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    next();
}

// -----------------------------
// Middleware 3: Request Timer
// -----------------------------
function timer(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} Request completed in ${duration} ms`
        );
    });

    next();
}

// Apply middleware globally
app.use(logger);
app.use(timer);

// =====================================================
// PART (a) – ROUTES, PARAMETERS AND URL HANDLING
// =====================================================

// Basic Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route Parameter
app.get("/user/:id", (req, res) => {
    const userId = req.params.id;

    res.send(`User ID: ${userId}`);
});

// Query Parameters
app.get("/search", (req, res) => {
    const query = req.query.q;
    const limit = req.query.limit;

    res.send(`Searching for '${query}', limit ${limit}`);
});

// URL Building using req.originalUrl
app.get("/current-url", (req, res) => {
    res.send(`Current URL: ${req.originalUrl}`);
});

app.get("/url", (req, res) => {
    res.json({
        message: "Current requested URL",
        url: req.originalUrl
    });
});

// Redirect Example
app.get("/home", (req, res) => {
    res.redirect("/");
});

// =====================================================
// PART (b) – BOOK RESOURCE / CRUD OPERATIONS
// =====================================================

// In-memory book collection
let books = [
    {
        id: 1,
        title: "The Hobbit",
        author: "Tolkien"
    },
    {
        id: 2,
        title: "Dune",
        author: "Herbert"
    }
];

let nextId = 3;

// GET /books – Get all books
app.get("/books", (req, res) => {
    res.json(books);
});

// GET /books/:id – Get a specific book
app.get("/books/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).send("Book Not Found");
    }

    res.json(book);
});

// POST /books – Add a new book
app.post("/books", (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            error: "Title and author are required"
        });
    }

    const newBook = {
        id: nextId++,
        title: title,
        author: author
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// DELETE /books/:id – Delete a book
app.delete("/books/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).send("Book Not Found");
    }

    books.splice(index, 1);

    res.status(204).send();
});

// =====================================================
// PART (c) – ROUTE-SPECIFIC MIDDLEWARE
// =====================================================

function checkApiKey(req, res, next) {
    if (req.headers["x-api-key"] === "12345") {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

// This route requires the API key
app.get("/protected", checkApiKey, (req, res) => {
    res.send("Access granted to protected route");
});

// =====================================================
// PART (d) – EJS USER LIST AND REGISTRATION
// =====================================================

app.get("/users", (req, res) => {
    const users = [
        { name: "John Doe", email: "john@example.com", age: 25 },
        { name: "Jane Smith", email: "jane@example.com", age: 30 }
    ];

    res.render("users", { users });
});

app.get("/register", (req, res) => {
    res.render("register", {
        error: "",
        values: { name: "", email: "", age: "" }
    });
});

app.post("/register", (req, res) => {
    const values = {
        name: typeof req.body.name === "string" ? req.body.name.trim() : "",
        email: typeof req.body.email === "string" ? req.body.email.trim() : "",
        age: typeof req.body.age === "string" ? req.body.age.trim() : ""
    };
    const age = Number(values.age);

    if (!values.name || !values.email || !values.age) {
        return res.status(400).render("register", {
            error: "All fields are required.",
            values
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        return res.status(400).render("register", {
            error: "Enter a valid email address.",
            values
        });
    }

    if (!Number.isInteger(age) || age < 0) {
        return res.status(400).render("register", {
            error: "Enter a valid age.",
            values
        });
    }

    res.render("success", {
        name: values.name,
        email: values.email,
        age
    });
});

// =====================================================
// PART (e) – SESSION MANAGEMENT AND AUTHENTICATION
// =====================================================

app.get("/session-demo", (req, res) => {
    res.render("session-home");
});

app.get("/set-session", (req, res, next) => {
    req.session.username = "admin";
    req.session.visitCount = 0;
    req.session.save(error => {
        if (error) return next(error);
        res.send('Session created. <a href="/session-info">View Session</a>');
    });
});

app.get("/session-info", (req, res, next) => {
    if (!req.session.username) {
        return res.render("session-info", { sessionData: null });
    }

    req.session.visitCount = (req.session.visitCount || 0) + 1;
    req.session.save(error => {
        if (error) return next(error);
        res.render("session-info", {
            sessionData: {
                username: req.session.username,
                visitCount: req.session.visitCount,
                sessionId: req.sessionID
            }
        });
    });
});

app.get("/destroy-session", (req, res, next) => {
    req.session.destroy(error => {
        if (error) return next(error);
        res.clearCookie("connect.sid");
        res.send('Session destroyed. <a href="/session-demo">Home</a>');
    });
});

app.get("/login", (req, res) => {
    res.render("login", { error: "" });
});

app.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    if (username !== "admin" || password !== "1234") {
        return res.status(401).render("login", {
            error: "Invalid username or password."
        });
    }

    req.session.regenerate(error => {
        if (error) return next(error);
        req.session.user = username;
        req.session.visitCount = 0;
        req.session.save(saveError => {
            if (saveError) return next(saveError);
            res.redirect("/dashboard");
        });
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/login");
}

app.get("/dashboard", isAuthenticated, (req, res, next) => {
    req.session.visitCount = (req.session.visitCount || 0) + 1;
    req.session.save(error => {
        if (error) return next(error);
        res.render("dashboard", {
            username: req.session.user,
            sessionId: req.sessionID,
            visitCount: req.session.visitCount
        });
    });
});

app.get("/logout", (req, res, next) => {
    req.session.destroy(error => {
        if (error) return next(error);
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
});

// =====================================================
// PART (f) – MONGOOSE ITEM CRUD API
// =====================================================

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: false }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

app.use("/api/items", (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            error: "MongoDB is not connected. Start MongoDB and restart the app."
        });
    }
    next();
});

function validateItemInput(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { error: "Request body must be a JSON object." };
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return { error: "Item name is required." };

    if (body.price === undefined || body.price === null || body.price === "") {
        return { error: "Price is required." };
    }
    const price = typeof body.price === "number" ? body.price : Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
        return { error: "Price must be a non-negative number." };
    }

    if (body.description !== undefined && typeof body.description !== "string") {
        return { error: "Description must be a string." };
    }

    if (body.inStock !== undefined && typeof body.inStock !== "boolean") {
        return { error: "inStock must be a boolean." };
    }

    return {
        value: {
            name,
            description: body.description?.trim() || "",
            price,
            inStock: body.inStock ?? false
        }
    };
}

function validItemId(req, res, next) {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({ error: "Invalid item ID." });
    }
    next();
}

app.post("/api/items", async (req, res, next) => {
    const input = validateItemInput(req.body);
    if (input.error) return res.status(400).json({ error: input.error });

    try {
        const item = await Item.create(input.value);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
});

app.get("/api/items", async (req, res, next) => {
    try {
        res.json(await Item.find().sort({ createdAt: -1 }));
    } catch (error) {
        next(error);
    }
});

app.get("/api/items/:id", validItemId, async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found." });
        res.json(item);
    } catch (error) {
        next(error);
    }
});

app.put("/api/items/:id", validItemId, async (req, res, next) => {
    const input = validateItemInput(req.body);
    if (input.error) return res.status(400).json({ error: input.error });

    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { $set: input.value },
            { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ error: "Item not found." });
        res.json(item);
    } catch (error) {
        next(error);
    }
});

app.delete("/api/items/:id", validItemId, async (req, res, next) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found." });
        res.json({ message: "Item deleted successfully." });
    } catch (error) {
        next(error);
    }
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).send("Route Not Found");
});

app.use((error, req, res, next) => {
    console.error("Request failed:", error);
    if (res.headersSent) return next(error);

    const status = error.name === "ValidationError" ||
        error.name === "CastError" ||
        error.type === "entity.parse.failed"
        ? 400
        : 500;
    res.status(status).json({
        error: status === 400 ? error.message : "A server error occurred."
    });
});

// =====================================================
// START SERVER
// =====================================================

mongoose.set("bufferCommands", false);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB.");
    })
    .catch(error => {
        console.error("MongoDB connection error:", error.message);
    });
