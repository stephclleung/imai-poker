/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's conversation system.

In this example, Botkit hears a keyword, then asks a question. Different paths
through the conversation are chosen based on the user's response.

*/

module.exports = function(controller) {

    controller.hears(['poker'], 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            convo.say('Shall we start a game?');

            convo.ask({
                attachments:[
                    {
                        title: 'Do you want to proceed?',
                        callback_id: '123',
                        attachment_type: 'default',
                        actions: [
                            {
                                "name":"yes",
                                "text": "Yes",
                                "value": "yes",
                                "type": "button",
                            },
                            {
                                "name":"no",
                                "text": "No",
                                "value": "no",
                                "type": "button",
                            }
                        ]
                    }
                ]
            },[
                {
                    pattern: "yes",
                    callback: function(reply, convo) {
                        const str = '<@' + message.user + '> has joined a game lobby.';
                        convo.say(str);
                        convo.next();
                        // do something awesome here.

                        // load user from storage...
                        controller.storage.users.get(message.user, function(err, user) {

                            // if user is not in a lobby (or first time not on record)
                            if (!user || !user.currentLobby || user.currentLobby.length == 0) {
                                
                                // if storage lobbies lobby does not exist
                                //controller.storage.lobbies.get('lobby_01', function(err, lobby) {
                                   
                                    //if (!lobby){
                                        // create lobby
                                        lobby = {};
                                        // lobby.id set
                                        lobby.id = 'lobby_01';
                                        // lobby.players is an array;
                                        lobby.players = [];
                                    //}

                                    // push userID to lobby.players list
                                    lobby.players.push(message.user);

                                    // set user.currentLobby to lobbyID

                                //});

                                var text = 'Certainly, <@' + message.user + '>! You\'re in a lobby now, please wait for a while.\n';

                                bot.reply(message, text);

                            } else {

                                var text = '<@' + message.user + '>, you\'re currently already in a lobby.\n';

                                bot.reply(message, text);

                            }

                        });


                    }
                },
                {
                    pattern: "no",
                    callback: function(reply, convo) {
                        convo.say('Maybe next time.');
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function(reply, convo) {
                        convo.say('\(... did not get a response...\)');
                    }
                }
            ]);
            // #debug #################################
            console.log('\n\n-------------------[message]\n', message);
            // ########################################


        });

    });




};
