const fs = require('fs');
const args = require('yargs').argv;
const method = args.method;

const addMessage = (message) => {

    if (typeof message !== 'string' || message === '') { throw new Error('Enter your message') };

    let lineBreak = '';

    if (fs.existsSync('log.txt') && fs.readFileSync('log.txt', 'utf8') !== '') {
        lineBreak = '\n';
    }

    fs.appendFileSync('log.txt', `${lineBreak}${message}`);

    return message;

}

const findAll = () => {

    if (fs.existsSync('log.txt')) {

        const fileData = fs.readFileSync('log.txt', 'utf8');

        if (fileData) {
            return fileData.split('\n');
        }
    }

    return [];

}

const findOne = id => {

    if (fs.existsSync('log.txt')) {

        const fileData = fs.readFileSync('log.txt', 'utf8');

        if (fileData) {

            let message = fileData.split('\n')[id];

            if (!message) {
                throw new Error('Message does not exist') 
            }
               
            return message
            
        }
    }

    return '';

}

const deleteMessage = id => {

    if (fs.existsSync('log.txt')) {

        const fileData = fs.readFileSync('log.txt', 'utf8');

        if (fileData) {

            let messages = fileData.split('\n');

            if (id >= messages.length) {
                throw new Error('Message does not exist') 
            }
             
            messages.splice(id, 1);

            fs.writeFileSync('log.txt', messages.join('\n'));
   
        }
    }

}

if (typeof method == 'string') {

    if (method.toLowerCase() === 'post') {

        addMessage(args.message);

    } else if (method.toLowerCase() === 'get') {

        let id = args.id;

        if (id === true || id < 0) {
            throw new Error('Enter id message') 
        }

        if (id || id === 0) {   
            console.log(findOne(id));
        } else {
            console.log(findAll());
        }

    } else if (method.toLowerCase() === 'delete') { 
    
        let id = args.id;

        if (id === true || id < 0) {
            throw new Error('Enter id message') 
        }

        if (id || id === 0) {   
            deleteMessage(id);
        }

    } else {
        throw new Error('To send messages use the method "POST" or method "GET" to get messages or method "DELETE" to delete messages');
    }

} else {
    throw new Error('Enter method: POST or GET');
}