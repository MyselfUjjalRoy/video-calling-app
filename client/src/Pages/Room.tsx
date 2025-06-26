import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {

  const { id } = useParams();
  const  {socket,user,stream,peers }  = useContext(SocketContext);

  useEffect(() => {
    // emitting this event so that either creator of room or joinee in the room
    // anyone is added the server knows that new people have been added\
    // to this room
    if(user) {
      console.log("New user with id", user._id, "has joined room",id);
      socket.emit("joined-room", { roomId: id, peerId: user._id});
    }

    console.log(peers);
  }, [id,user,socket,peers]);

  return (
    <div>
      room : {id}
      <br />
      Your own user Feed
      <UserFeedPlayer stream={stream}/>

      <div>
        Other Users Feed
        {Object.keys(peers).map((peerId) =>(
          <>
            <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
          </>
        ))}
      </div>
    </div>
  );
}

export default Room;
