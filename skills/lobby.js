



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
                            
                            // Create user if not found on record
                            if (!user) {
                                user = {};
                                user.id = message.user;
                                user.tasks = [];
                            }           



                            // If the "currentLobby" attribute isn't in yet
                            if (!user.currentLobby){
                                user.currentLobby = 0;
                                // update the db for this user at this current status, creates a "currentLobby" field
                                controller.storage.users.save(user, function(err,saved) {                                        
                                    if (err) {
                                        bot.reply(message, 'I experienced an error in saving user to db: ' + err);
                                    } else {
                                        // do nothing 
                                    }

                                });
                            } 
                            
                            /* ------------------------------------------------------------------------------------------------------------------
                                
                                This is the case which player is creating a new lobby to join (but not selecting a created lobby to join)

                            ---------------------------------------------------------------------------------------------------------------------*/
                            
                            // If currentLobby === 0, then player is not in any game lobby
                            if (user.currentLobby === 0) {
                                
                                // create lobby obj to store
                                var lobby = {};
                                lobby.id = '1';           // replace this with: = getNextavailableLobby(); <-- skips the full ones
                                lobby.players = [];
                                lobby.max_players = 6; 
                                lobby.buy_in = 50000;
                                lobby.min_bet = lobby.buy_in / 25;

                                // put player into a lobby
                                lobby.players.push(message.user);

                                // save onto lobbies
                                controller.storage.lobbies.save(lobby, function(err,saved) {
                                    
                                    if(err){
                                        bot.reply(message, 'I experienced an error adding you to lobby: ' + err)
                                    }else{
                                        // register to user's currentLobby attribute
                                        user.currentLobby = lobby.id; 

                                        
                                        controller.storage.users.save(user, function(err,saved) {

                                            if (err) {
                                                bot.reply(message, 'I experienced an error adding your task: ' + err);
                                            } else {
                                                // This is a callback to user save, which is inside the callback of lobby save. Report.
                                                var text = 'Certainly, <@' + message.user + '>! You\'re in a lobby now.\n';
                                                bot.reply(message, text);

                                        
                                            }
                            
                                        });


                                    }
                                    
                                    
                                });


                            } else {

                                // this player is already in a lobby, ask player to wait
                                var text = '<@' + message.user + '>, you\'re currently already queing in a lobby, please wait for other players to join.\n';
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
