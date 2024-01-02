const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const { getItemList ,getCodeById } = require('./models/Mydb');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3006;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/newdb';

let used_codes_id = {};
// Use the app object for routes, not a router object
app.get('/', async (req, res) => {
  try {
    const itemList = await getItemList();
    // console.log(itemList);
    res.render('index', { itemList });
  } catch (error) {
    console.error('Error retrieving codes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/code_block/:id',async (req, res) => {
    try {
        // console.log("stam1");
        const itemId = req.params.id;
        // console.log("stam1");
        console.log(itemId);
        // console.log("stam1");
        const mycode = await getCodeById(itemId);
        // console.log("stam1");
        // console.log(mycode);
        if(!(itemId in used_codes_id)){
            used_codes_id[itemId] = mycode.solution;
            res.render('code_block_for_trainer', { mycode });
        } else
        {
            res.render('code_block', { mycode });
        }
    } catch (error) {
      console.error('Error retrieving codes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

io.on('connection', (socket) => {
    const itemId = socket.handshake.query.itemId;
    const isMentor = socket.handshake.query.isMentor;
    if(isMentor == 1){
        console.log(`A mentor connected on ${itemId}`);
    
        socket.on('disconnect', () => {
            delete used_codes_id[itemId];
            console.log(`mentor disconnected on ${itemId}`);
        });
    }
    else{
        console.log(`A student connected on ${itemId}`);
    
        socket.on('disconnect', () => {
    
            console.log(`student disconnected on ${itemId}`);
        });
    }

    socket.on('updateCodeBody', (data) => {
        console.log(used_codes_id[itemId]);
        if(data.newBody == used_codes_id[itemId]){
            console.log("good one");
            data["good_ans"]=1;
            io.emit('updateCodeBody', data);

        } else {
            console.log("bad one");
            // Broadcast the update to all connected clients
            io.emit('updateCodeBody', data);
        }
    });
});


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});