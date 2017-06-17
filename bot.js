const { Wechaty } = require('wechaty') // import { Wechaty } from 'wechaty'
var request = require("request");
var auth = require('./auth.json')

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
    if(megalul.includes('get')&&!(message.self()))
    {
        megalul = megalul.replace('get ','')
        if(megalul === 'website')
        {
            getRoom(message).say('www.smicschool.com')
        }
        else if(megalul === 'list')
        {
            getRoom(message).say('Currently, the available key words are:' + '\n' + 'website, list, who')
        }
        else if(megalul === 'who')
        {
            getRoom(message).say('We are the SMIC Computer Club! We are high school students who want to learn about machinese in general, not just coding or computers')
        }
        else
        {
            getRoom(message).say('Sorry, you did not provide a valid keyword')
        }
    }
})

.on('room-join', (room, inviteelist) =>{
    //person joins the chat and the bot sends an appropriate message
    const nameList = inviteelist.map(c => c.name()).join(',')
    room.say(`${nameList} have been invited into this group`)
})

.on('room-leave', (room, leaverList)=>{
    const leavelist = leaverList.map(a=> c.name()).join(',')
    room.say(`${nameList} have left this group`)
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
			getRoom(message).say( 'Here are the top 5 results for your image request' + '\n' + result.link);
		})
        return;
    }
    else
    {
        return;
    }
})

.init()