import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../config/IRoomParams";

const rooms: Record<string , string[]> = {};

const roomHandler = (socket: Socket) => {

  // the below map stores for a room what all peers have joined
  

  const createRoom = () => {
    const roomId = UUIDv4(); // this will be our unique room id in which multiple connection will exchange
    socket.join(roomId); // we will make the socket connection enter a new room

    rooms[roomId] = []; // create a new entry for the room

    socket.emit("room-created", { roomId }); // we will emit an event from server side that socket co
    console.log("Room created with id ", roomId);
  };

  const joinedRoom = ({roomId , peerId}: IRoomParams ) => {
    console.log("joined room called", rooms,roomId, peerId);
    if (rooms[roomId]) {
      // If the given roomId exists in the in memory db
      console.log("New user has joined room", roomId, "with peer id as", peerId);
      // the moment new user joins, add the peerId to the key of roomId
      rooms[roomId].push(peerId);
      console.log("added peer to room", rooms);
      socket.join(roomId); // make the user join the socket room

      socket.on("ready",()=>{
        //from the frontend once someone joins the room we will emit a ready event
        //then from our server we will emit an event to all the clients conn that a new peer has added
        socket.to(roomId).emit("user-joined",{peerId});
      })

      // below event is for logging purpose
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });

    }
  };

  // When to call the above two function ?

  // We will call the above two function when the client will emit events top create room and join room
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinedRoom);

};

export default roomHandler;
