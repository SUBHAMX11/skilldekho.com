// this is the custom server to use proxy so that both client and server runs on same domain
// Refernce - nextjs.org documentation of custom server
const express = require("express");
const next = require("next");

const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = process.env.NODE_ENV !== "production"; //if not production then we ar in development mode
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    //apply proxy in dev mode
    if (dev) {
      server.use(
        "/api",
        createProxyMiddleware({
          target: "http://localhost:8000",
          changeOrigin: true,
        })
      );
    }

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("ready on localhost 8000");
    });
  })
  .catch((err) => {
    console.log("error", err);
  });
