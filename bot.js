const { Wechaty } = require('wechaty') // import { Wechaty } from 'wechaty'
var request = require("request");
var auth = require('./auth.json')

function getRoom(message)
{
    return message.room()
}

function roomName(message)
{

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
    var sentmessage = message.toString();
    sentmessage = sentmessage.toLowerCase();
    sentmessage = sentmessage.trim();
    if(sentmessage.includes('help')&&!(message.self()))
    {
        getRoom(message).say(`Hello ${getMessageSender(message)}, if you need help, try "get" followed by a keyword (without the quotes). Type "get list" to show available keywords. Example: get website`)
        return;
    }  
    else
    {
        return;
    } 
})

.on('message', message =>{
    var megalul = message.toString();
    megalul = megalul.toLowerCase();
    megalul = megalul.trim();
    var chatroom = getRoom(message)
    if(megalul.includes('get')&&!(message.self()))
    {
        megalul = megalul.replace('get ','')
        if(megalul === 'website')
        {
            chatroom.say('www.smicschool.com')
        }
        else if(megalul === 'list')
        {
            getRoom(message).say('Currently, the available key words are:' + '\n' + 'not coded yet lul')
        }
        else if(megalul === 'services')
        {
            chatroom.say('We are community of freelance developers who will satisfy all of your software needs!')
        }
    }
})

.on('room-join', user =>{
    //person joins the chat and the bot sends an appropriate message
})

.on('room-leave', user=>    {
    //person leaves the chat and the bot sends an appropriate message
})

.on('message', message=>
{
    var imagerequest = message.toString();
    imagerequest = imagerequest.toLocaleLowerCase();
    imagerequest = imagerequest.trim();
    if (imagerequest.includes('imgsearch')&&!(message.self()))
    {
        imagerequest = imagerequest.replace('imgsearch ','')
        request(auth.requesturl + imagerequest,
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