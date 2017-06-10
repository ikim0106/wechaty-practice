const { Wechaty } = require('wechaty') // import { Wechaty } from 'wechaty'
var request = require("request");

function getRoom(message)
{
    return message.room()
}

function getContent(message)
{
    return message.content()
}

function getMessageSender(message)
{
    return message.from()
}

Wechaty.instance()
.on('scan', (url, code) => console.log(`Scan QR Code to login: ${code}\n${url}`))

.on('login',       user => console.log(`User ${user} has logged in`))

.on('message',  message => {
    console.log(`${message.from()} said "${message}"`);
    const chat = message.room()
    if(`${message}`==="help")
    {
        getRoom(message).say(`Hello ${getMessageSender(message)}, how may I help you?`)
    }   
})

.on('room-join', user =>{
    getRoom(user).say(`${user} has joined this chat`)
})

.on('room-leave', user=>{
    
})

.on('message', message=>
{
    var imagerequest = message.toString();
    if (imagerequest.includes('imgsearch'))
    {
        imagerequest = imagerequest.replace('imgsearch ','')
        request("https://www.googleapis.com/customsearch/v1?key=+AIzaSyBiw58K8MJOzZYIbDNTcJN0aSw8K1MOtSI&cx=005095525797302733243:qcilnmzij7q&num=1&searchType=image&q=" + imagerequest,
            function (err, res, body)
            {
                var data, error;
                try
                {
				    data = JSON.parse(body);
                }
                catch (error)
                {
				    console.log(error)
				    return;
			    }
                if (!data)
                {
				    console.log(data);
				    getRoom(message).say( "Error:\n" + JSON.stringify(data));
				    return;
			    }
                else if (!data.items || data.items.length == 0)
                {
				    console.log(data);
				    getRoom(message).say( "No result for '" + imagerequest + "'");
				    return;
			    }
			var result = data.items[0];
			getRoom(message).say( result.title + '\n' + result.link);
		})
        return;
    }
    else
    {
        return;
    }
})

.init()