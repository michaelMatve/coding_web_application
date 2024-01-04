const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { getItemList ,getCodeById } = require('./models/Mydb');

//set the express app
const app = express();
const port = 3002;

/* 
Configure the Socket.IO server on the same port as the Express server.
Implement CORS to enable the client-side server to send API requests,
allowing clients to connect to the socket on port 3000.
*/
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:3000', // Replace with your React app's URL
      methods: ['GET', 'POST'],
    },
  });

/*
 This dictionary will help us track the currently used code IDs and determine whether the connected user should be a mentor or a student.
  When a mentor connects, it inserts the code ID into the dictionary, indicating that a mentor is currently connected.
  Upon disconnection, we can identify that a mentor has disconnected, allowing for the connection of the next mentor.
*/
let codes_id_used_by_mentors = {};
/*
    Endpoint to retrieve a list of all code items from the database.
*/
app.get('/getCodeList', async (req, res) => {
    try {
        const codesList = await getItemList();
        res.json({ codesList });

    } catch (error) {
        console.error('Error retrieving codes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*
  Endpoint to retrieve whether a user associated with a codeId is a mentor.
  This information helps the client determine whether to display the mentor or student page.
*/
app.get('/Mentor_id/:id', async (req, res) => {
    try {
        const codeId = req.params.id;

        //Check if a mentor is currently connected.
        if(codeId in codes_id_used_by_mentors){
            res.json({"isMentor": 0});
        }
        else{
            res.json({"isMentor": 1});
        }

    } catch (error) {
        console.error('Error retrieving codes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/*
    Endpoint to retrieve a code item from the database using his codeId.
*/
app.get('/get_code_block/:id', async (req, res) => {
    try {
        const codeId = req.params.id;
        console.log(codeId);
        const mycode = await getCodeById(codeId);

        if (!mycode) {
            // Handle the case where the resource is not found
            res.status(404).json({ error: 'Code not found' });
            return;
        }

        res.json(mycode);
    } catch (error) {
        console.error('Error retrieving codes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*
    Real-time socket communication to enable mentors to view students' code in real-time.
    This functionality leverages sockets to provide a live update of the student's code to the mentor.
*/
io.on('connection', (socket) => {
    //Track the code on which the client is currently working.
    const codeId = socket.handshake.query.codeId;

    // Determine whether the connected client is a mentor or not.
    let isMentor = socket.handshake.query.isMentor;
    
    // If the 'isMentor' flag is not set to 0 or 1, check if there is a mentor assigned to the current codeID.
    // If no mentor is found, set 'isMentor' to 1, indicating that the client is assigned the role of a mentor.
    if(isMentor != 1 && isMentor != 0 && !(codeId in codes_id_used_by_mentors))
    {
        codes_id_used_by_mentors[codeId]=1;
        isMentor = 1;
    }


    if(isMentor == 1 ){
        console.log(`A mentor connected on ${codeId}`);
    
        socket.on('disconnect', () => {
            // update the codes_id_used_by_mentors that the mentor for this codeId disconnect
            delete codes_id_used_by_mentors[codeId];
            console.log(`mentor disconnected on ${codeId}`);
        });
    }
    else{
        console.log(`A student connected on ${codeId}`);
    
        socket.on('disconnect', () => {
    
            console.log(`student disconnected on ${codeId}`);
        });
    }

    /*
        Broadcasts an update to all clients with the specified CodeId.
        Each client decides whether to update the code based on their needs.
    */
    socket.on('updateCodeBody', (data) => {
        console.log(data.newCode);
        console.log(data.id);

        io.emit('updateCodeBody', data); 
    });
});


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});