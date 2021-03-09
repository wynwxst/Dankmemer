# Mac/Linux build docs

# Dependencies
Redis-server
Nodejs

Open a terminal window and type
```
apt install redis
apt install nodejs
redis-server
```

# Building from source
```
git clone https://github.com/Sakurai07/Dankmemer
cd Dankmemer
npm install
```

Go to config page and configure the files
files needed:
+config.example.json
+secrets.example.json

(while running a redis server check redis page)
```
cd scripts
node createDB.js
cd ..
cd src
node memer.js
```

For modification info go to the modification page
