import { IncomingMessage, ServerResponse } from "http";
import { App } from "./app";

const app = new App();

app.use((req, res) => {
    console.info("coucou")
})

app.get("/", (_: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200);
    res.end('Hello, World!');
})

app.post("/test", async (req: IncomingMessage, res: ServerResponse) => {
    const chunks = [];

    for await (const chunk of req) {
        chunks.push(chunk);
    }

    const json = JSON.parse(Buffer.concat(chunks).toString())

    console.info(json)

    // Produce json
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ hello: "World" }));
})

app.start(8080)
/*import http, { IncomingMessage, ServerResponse } from "http";

const requestListener = async function (req: IncomingMessage, res: ServerResponse) {
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200);
        res.end('Hello, World!');
        return
    }

    if (req.method === "POST" && req.url === "/test") {
        const chunks = [];

        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for-await...of
        for await (const chunk of req) {
            chunks.push(chunk);
        }

        console.info(Buffer.concat(chunks).toString())

        res.writeHead(200);
        res.end('Hello, World!');

        return
    }
}

const server = http.createServer(requestListener);

// Start on port 8080
server.listen(8080)

console.info("Server started on port 8080")*/