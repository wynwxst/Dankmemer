# Modification

To modify the bot you must first understand the structure

### Structure
```
-src
    -assets
    -commands
    -handlers
    -models
    -utils
    +memer.js
    +mainClass.js
+config.json.example
```
### Assets
```
-audio
-arrays
```
### Arrays - all the sentences used for pls animal/kill/meme/roast/asktrump
```
+animals.json
+kill.json
+memes.json
+permgifs.json # this is for when the bot doesn't have the required permissons
+roasts.json
+trump.json
```
### Commands - not in depth yet
```
-animalCommands
-configCommands
-currencyCommands
-funCommands
-imageManipulation
-infoCommands
-memeyCommands
-modCommands
-nsfwCommands
-soundCommands
-textCommands
-utilityCommands
```
commands are inside corresponding folders eg pls beg will be in currencycommands/beg.js . to modify commands simply edit the file eg beg.js will be edited to use a different array DB such as beg.json .

### handlers
```
+error.js
+guildCreate.js
+guildDelete.js
+index.js
+messageCreate.js
+messageDelete.js
+rawWS.js
```
Handlers are used for the person who is building/running the bot eg if there is an error adding a guild to the guild DB it will say that in the terminal

### Models
The models for commands, not shown because not important DO NOT DELETE THOUGH. You can use this as a default cmd for your bot and modify it into a special cmd

### Utils
These are only for creating the redis database and logging will not be taught YET

### Mainclass.js and Memer.js

Memer.js starts the servers and mainClass.js . MainClass.js starts the commands and necessary assets.

# Now for the modifiying