# fsdweek2

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
