const pkg = require("./package.json");

process.stdin.on("data", (data) => {
  const numbers = data
    .toString()
    .trim()
    .split("\n")
    .map((data) => {
      const num = Number(data);
      return isNaN(num) ? 0 : num;
    });

  const result = numbers.reduce((total, num) => total + num, 0);
  console.log(result);
});

// Get-Content input.txt | node index.js | Out-File salida.txt
