import http, { IncomingMessage, ServerResponse } from "http";

type Handler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>

export class App {
    #posts: Record<string, Handler> = {};
    #gets: Record<string, Handler> = {};
    #middlewares: Handler[] = []

    get(url: string, handler: Handler) {
        this.#gets[url] = handler;
    }

    post(url: string, handler: Handler) {
        this.#posts[url] = handler;
    }

    use(handler: Handler) {
        this.#middlewares.push(handler);
    }

    async handle(req: IncomingMessage, res: ServerResponse) {
        const url = req.url
        const method = req.method
        let f: Handler

        setImmediate(async () => {
            for (const middleware of this.#middlewares) {
                try {
                    await middleware(req, res)
                } catch (e) {
                    res.writeHead(500);
                    res.end();
                }
            }

            if (method === "GET") {
                f = this.#gets[url]
            } else {
                f = this.#posts[url]
            }

            if (!f) {
                res.writeHead(404);
                res.end();
                return
            }

            try {
                await f(req, res)
            } catch (e) {
                res.writeHead(500);
                res.end();
            }
        })
    }

    start(port: number) {
        http.createServer(this.handle.bind(this)).listen(port, '0.0.0.0', () => {
            console.info("Started");
        });
    }
}