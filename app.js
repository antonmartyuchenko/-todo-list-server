/*const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log('Hello World');
});*/

/*let name = process.argv[2];
let eat = process.argv[3];*/

const fs = require('fs');
const args = require('yargs').argv;
const {method} = args;
let messages = [];

const addMessage = ({message}) => {

    if (typeof method !== 'string' || message == "") throw new Error('Enter your message');

    let lineBreak = '';

    if (fs.existsSync("log.txt") && fs.readFileSync("log.txt", "utf8") !== '') {
        lineBreak = '\n';
    }

    fs.appendFileSync('log.txt', `${lineBreak}${message}`);

    return message;

}

const findAll = () => {

    if (fs.existsSync("log.txt")) { 
        messages = fs.readFileSync("log.txt", "utf8").split('\n');
    }

    return messages;

}

if (typeof method == 'string') {
    if (method.toLowerCase() === 'post') {
        addMessage(args);
    } else if (method.toLowerCase() === 'get') {
        findAll();
    } else {
        throw new Error('To send messages use the method "POST" or method "GET" to get all messages');
    }
} else {
    throw new Error('Enter method: POST or GET');
}