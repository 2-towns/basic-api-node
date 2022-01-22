const esbuild = require("esbuild")
const childProcess = require("child_process");

const argv = process.argv;
const cwd = process.cwd()
const [, , ...childProcessArgv] = argv;

let child

const watch = {
    onRebuild(error, result) {
        if (error) {
            console.error('watch build failed:', error)
        }
        else {
            console.info("======================================")

            if (child) {
                child.kill('SIGINT');
            }

            child = childProcess.fork(cwd + "/dist/index.js", [...childProcessArgv, "--enable-source-maps"]);
        }
    },
}

esbuild.build({
    bundle: true,
    minify: false,
    sourcemap: true,
    write: true,
    entryPoints: [
        "./src/index.ts",
    ],
    platform: "node",
    target: "node16",
    outdir: "./dist",
    watch
}).then(() => {
    child = childProcess.fork("./dist/index.js", [...childProcessArgv, "--enable-source-maps"]);
})