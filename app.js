const express = require("express");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// Middleware 1: JSON Parser
// -----------------------------
app.use(express.json());

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
    res.send("Welcome to ExpressJS!");
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
// 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).send("Route Not Found");
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
