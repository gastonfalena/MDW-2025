const pkg = require("./package.json");

process.stdin.on("data", (data) => {
  const [a, b] = data
    .toString()
    .trim()
    .split("\n")
    .map((data) => Number(data));
  console.log(a + b);
});

// Get-Content input.txt | node index.js | Out-File salida.txt
