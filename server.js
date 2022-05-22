const http = require('http');
const express = require('express');

const port = 3000;

const app = express();
app.use(express.static('public'));

app.set('port', `${port}`);

const server = http.createServer(app);
server.on('listening', () => {
    console.log(`Listening on: http://localhost:${port}`)
});

server.listen('3000');

const io = require('socket.io')(server);

const clients = {};
const lobbies = [];

const addClient = (socket) => {
    console.log("New client connected", socket.id);
    clients[socket.id] = socket;
};
const removeClient = (socket) => {
    console.log("Client disconnected", socket.id);
    delete clients[socket.id];
};

var players = {},
    unmatched;

function joinGame(socket) {
    // Add the player to our object of players
    players[socket.id] = {
        // The opponent will either be the socket that is
        // currently unmatched, or it will be null if no
        // players are unmatched
        opponent: unmatched,

        // The symbol will become 'O' if the player is unmatched
        symbol: "X",

        // The socket that is associated with this player
        socket: socket,

        // Lobby code created by the player (if any)
        lobby: null
    };

    // Every other player is marked as 'unmatched', which means
    // there is not another player to pair them with yet. As soon
    // as the next socket joins, the unmatched player is paired with
    // the new socket and the unmatched variable is set back to null
    if (unmatched) {
        players[socket.id].symbol = "O";
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

// Returns the opponent socket
function getOpponent(socket) {
    try {
        if (!players[socket.id].opponent) {
            return;
        }
    } catch (error) {
        return;
    }

    return players[players[socket.id].opponent].socket;
}

io.on("connection", (socket) => {
    socket.on('game.code', (data) => {
        addClient(socket);
        if (data.host) {
            lobbies.push(data.lobbyCode);
        }
        else {
            if(lobbies.indexOf(data.lobbyCode) == -1){
                socket.emit('game.invalid.code', {});
                return;
            }else{

            }
        }
        joinGame(socket);
        // Once the socket has an opponent, we can begin the game
        if (getOpponent(socket)) {
            let code = 'lol';
            socket.emit("game.begin", {
                symbol: players[socket.id].symbol,
                lobby: code
            });

            getOpponent(socket).emit("game.begin", {
                symbol: players[getOpponent(socket).id].symbol,
                lobby: code
            });
        }

        console.log(lobbies);
    });
    
    

    // Listens for a move to be made and emits an event to both
    // players after the move is completed
    socket.on("make.move", (data) => {
        if (!getOpponent(socket)) {
            return;
        }

        socket.emit("move.made", data);
        getOpponent(socket).emit("move.made", data);
    });

    // Emit an event to the opponent when the player leaves
    socket.on("disconnect", () => {
        if (getOpponent(socket)) {
            getOpponent(socket).emit("opponent.left");
        }
    });
});