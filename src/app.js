const http = require("http")

module.exports.App = class {
    #posts = {};
    #gets = {};
    #middlewares = [];

    get(url, handler) {
        this.#gets[url] = handler;
    }

    post(url, handler) {
        this.#posts[url] = handler;
    }

    use(handler) {
        this.#middlewares.push(handler);
    }

    async handle(req, res) {
        const url = req.url
        const method = req.method
        let f

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

    start(port) {
        http.createServer(this.handle.bind(this)).listen(port, '0.0.0.0', () => {
            console.info("Started");
        });
    }
}