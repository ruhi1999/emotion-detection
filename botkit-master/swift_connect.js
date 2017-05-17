

var http = require('http');
var httpserver = require('http').createServer();
var ioserver = require('socket.io')(httpserver);

//initialize an array of scores
//set current index in that array to 0

ioserver.on('connection', function(socket){
	console.log('an emotion client connected');
	//stubsockets.add(socket);

	socket.on('emote', function(data) {
		console.log('incoming emote *** ' + data.response);
        if (data) {
            var emotionResponse = JSON.parse(data.response);

            //add to the index location the data from emotionResponse.scores.anger and so on
            //increment the index
            //arrScores[index].anger = emotionResponse.scores.anger;
            addEntry(data.time, data.channel, emotionResponse[0].scores);
            console.log('added entry:: '+ 'timeStamp:'+ data.time + 'channel:' + data.channel + 'scores' + emotionResponse[0].scores);

        }
    });


		//io.emit('data', data);
		// if emotion is what we want, add response emoji to message referenced by data
		// data.whatever is "whatever": variable in swift code

	socket.on('disconnect', function(){
		console.log('emotion client disconnected');
		stubsockets.delete(socket);
	});

});
		
function sendMessage(){
    console.log('**** &&&&& ***** sendMessage called');
    var msg = 'Ruhi';
    d = new Date();
    if(msg) {
        ioserver.emit('message', {user: msg, time: d.getTime(), channel: "randomChannel"});
        console.log('emit: message');
    } else { 
            console.log('error: **** &&&&& ***** ioserver emit not called'); 
    }
}

//handle failure
ioserver.on('connect_failed', function() {
    console.log('connection_failed on *&&& ***:3000');
});

//test code to call swift emotion detection

function call_emotion(){
    httpserver.listen(3001, function(){
        console.log('stub server listening on *:3001');
        setTimeout(function(){
            sendMessage();
            
           
        }, 20000);

        //add this code to the controller.hears(['emotion' ... after sendMessage
        //wait for 10 miliseconds
        setTimeout(function(){
            var max = 0;
            //check index for number of entries, average, pick dominant emotion score and respond with corresponding emoji
            
            //reset the index of the gloabl scores array to 0
        }, 10000);

    });
}

call_emotion();


//move all code below to the slack_bot
var emotionResults = [];

// TODO: call addEntry every time there is an emotion dataPoint in the controller handler
function addEntry(ts, ch, sc) //(timeStamp, channel, scores) 
{
    var indexFound = 0;
    var addedEntry = false;
    console.log('in addEntry function');

    //check if inputs are valid
    if(ts === undefined || ch == undefined || sc == undefined) {
        console.log('entry empty, not added');
        return;
    }

    //first check if we already have an entry with the same timeStamp & channel
    if(emotionResults.length>0){

        //indexFound = emotionResults.indexOf.timeStamp(ts);
        for (var i = 0; i < emotionResults.length; i++) {
        
            if (emotionResults[i].timeStamp == ts && emotionResults[i].channel == ch){
                indexFound = i;
                break;
            }
        }
       
        if (indexFound != -1) {

                //add the scores together for this entry & the new data, keeping a running sum
                emotionResults[indexFound].scores.anger += sc.anger;
                emotionResults[indexFound].scores.contempt += sc.contempt;
                emotionResults[indexFound].scores.disgust += sc.disgust;
                emotionResults[indexFound].scores.fear += sc.fear;
                emotionResults[indexFound].scores.happiness += sc.happiness;
                emotionResults[indexFound].scores.neutral += sc.neutral;
                emotionResults[indexFound].scores.sadness += sc.sadness;
                emotionResults[indexFound].scores.surprise += sc.surprise; 
                
                //increment the count emotion dataPoints
                emotionResults[indexFound].dataPoints ++;
                addedEntry = true;
                console.log('updated existing entry');
                console.log('entry:' + emotionResults[indexFound]);
                //If reached 10 data points, compute & send the emotion
                if (emotionResults[indexFound].dataPoints == 10) {
                    
                    computeAndSendEmotion(emotionResults[indexFound]);
                    
                    //remove this result from the array, it is processed.
                    emotionResults.splice(indexFound, 1);
            }
        }
     }
     if (!addedEntry) {
        //add to the array, set dataPoints to 1
          emotionResults.push({
                timeStamp: ts,
                channel: ch,
                scores: sc,
                dataPoints: 1        
            });
        console.log('added new entry');
        console.log('entry:' + emotionResults[indexFound]);
    }
    
}  

var emotionResults = [];
//array maintenance 
//check if there are old emotions left around, that didnt reach 10 dataPoints
//if so, convert to emotion and send
//remove that data from array
function maintainResults(msec) //this is the time we will use as threshold
{
   var tsNow = new Date().getTime();
   console.log('in maintainResults function');
   emotionResults.forEach(function(entry, index){
        if(entry.timeStamp + msec < tsNow) {
            //compute & send the emotion
            computeAndSendEmotion(entry);
            //remove this result from the array, it is processed.
            emotionResults.splice(pos, index);
        }
   
   });
   //this makes the maintenance fucntion call again after the timeout
   setTimeout(maintainResults, msec); 
}

// boot up the first call to maintain the array
//msec=5000 for 5 seconds
//change the 5000 below if you need this more/less frequent
//maintainResults(5000);


//ToDO: write this function
function computeAndSendEmotion(emotionEntry) {
    //TODO: pick max of running sum among the emotionEntry.scores.* 
    
    var maxscore = emotionEntry.scores.anger;
    var dominantEmotion = 'anger';
    if (emotionEntry.scores.contempt > maxscore) {
        maxscore = emotionEntry.scores.contempt;
        dominantEmotion = 'contempt';
    }
    if (emotionEntry.scores.disgust > maxscore) {
        maxscore = emotionEntry.scores.disgust;
        dominantEmotion = 'disgust';
    }
    if (emotionEntry.scores.fear > maxscore) {
        maxscore = emotionEntry.scores.fear;
        dominantEmotion = 'fear';
    }
    if (emotionEntry.scores.happiness > maxscore) {
        maxscore = emotionEntry.scores.happiness;
        dominantEmotion = 'happiness';
    }
    if (emotionEntry.scores.neutral > maxscore) {
        maxscore = emotionEntry.scores.neutral;
        dominantEmotion = 'neutral';
    }
    if (emotionEntry.scores.sadness > maxscore) {
        maxscore = emotionEntry.scores.sadness;
        dominantEmotion = 'sadness';
    }
    if (emotionEntry.scores.surprise > maxscore) {
        maxscore = emotionEntry.scores.surprise;
        dominantEmotion = 'surprise';
    }

    var reaction = emotionEntry.indexOf[i];
    console.log('in computeAndSendEmotion function');
    console.log('emotion is ' + dominantEmotion);
    //TODO: send the dominant emotion to the emotionEntry.channel
    //if (dominantEmotion = 'happiness') {
        bot.api.reactions.add({
                timestamp: message.ts,
                channel: message.channel,
                name: 'grinning',
            }, function(err, res) {
                if (err) {
                    bot.botkit.log('Failed to add emoji reaction :(', err);
                }
            });
    //}
    
}
    
