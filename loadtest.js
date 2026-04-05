import http from "http";

for (let i = 0; i < 100; i++) {
  const start = Date.now();
  http.get("http://localhost:3000/users", (res) => {
    console.log(`Request ${i + 1} - Status: ${res.statusCode} - Time: ${Date.now() - start}ms`);
  });
}