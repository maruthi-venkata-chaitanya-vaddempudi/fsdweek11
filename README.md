# fsdweek6

## React props, state, Sass, and events

Run `npm start`, then open `http://localhost:3000/products.html`. The React
products SPA demonstrates product props, `useState`, cart updates, controlled
form events, and interactive card hover events. Styles are authored in
`src/products-app.scss`; the start script compiles Sass and bundles the JSX.

## ReactJS building blocks

Install dependencies with `npm install`, then run `npm start`. Open
`http://localhost:3000/react-demo.html` to see HTML rendered without JSX,
JSX expressions and inline styles, and nested function and class components.
The JSX source is in `src/react-demo.jsx`; the start script bundles it for the
browser with esbuild. A link to this demo is also available from the item page.

## MongoDB CRUD and SPA

Install the project dependencies with `npm install`. Copy `.env.example` to
`.env` and set `MONGO_URI` to your local MongoDB or private Atlas connection
string. Start MongoDB, then run `npm start` and open `http://localhost:3000`.
The item form uses the Fetch API and `/api/items` REST endpoints to create,
list, update, and delete MongoDB records without reloading the page.
If MongoDB is unavailable, the app reports the connection error and the item
API responds with HTTP 503; start MongoDB and restart the app to connect.

The application also retains the earlier Express demos: `/users` and
`/register` for EJS, and `/session-demo` or `/login` for sessions and
authentication.

## ExpressJS EJS user registration demo

Install dependencies and start the server:

```sh
npm install
node app.js
```

Open `http://localhost:3000/users` to view the rendered user list or
`http://localhost:3000/register` to submit the registration form. Form
submissions are validated and rendered by the EJS success template.

## ExpressJS sessions and authentication demo

Start the server with `node app.js` and open `http://localhost:3000/session-demo`
to set, inspect, or destroy a session, or `http://localhost:3000/login` to test
the protected dashboard. Demo credentials are `admin` / `1234`. Set
`SESSION_SECRET` to a private value outside local demonstrations. The default
in-memory session store is for learning only and is not suitable for production.

# fsdweek7
