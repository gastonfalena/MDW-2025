const pkg = require('./package.json');

process.stdin.on("data", (data) => {
    const [a, b] = data.toString().trim().split('\n').map((data) => Number(data));
    console.log(data);
});


if (process.argv.includes('--v')) {
    console.log('version 1.1.0');
}