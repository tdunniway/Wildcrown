import { createServer } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputDirectory = resolve("qa");
const outputPath = resolve(outputDirectory, "implementation.png");

const server = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/capture") {
    response.writeHead(404).end("Not found");
    return;
  }

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, Buffer.concat(chunks));
  response.writeHead(200, { "Content-Type": "text/plain" }).end(outputPath);
  server.close();
});

server.listen(4180, "127.0.0.1", () => {
  console.log("Screenshot receiver ready on http://127.0.0.1:4180/capture");
});
