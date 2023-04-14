import React, { useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate()

    const createRoomId = async () => {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/room/create`
        );
        setRoomId(res.data.roomId)
        toast.success("Created new room");
    }

    const joinRoom = async () => { 
        if (!roomId || !username) {
            toast.error("Room Id and username are required");
            return;
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/room/verify/${roomId}`);
            console.log(username)
            navigate(`editor/${roomId}`, {
                state: {
                    username
                }
            })
        }
        catch (err) {
            console.log(err.response.data.message)
            toast.error(err.response.data.message)
        }
    }

    const handleRoomId = (e) => {
        setRoomId(e.target.value)
    }

    const handleUsername = (e) => { 
        setUsername(e.target.value)
    }
  return (
    <div className="homePage">
      <div className="formWrapper">
        <img src="./Icon.png" alt="" />
        <div className="inputGrp">
          <input type="text" placeholder="Room ID" value={roomId} onChange={handleRoomId} />
          <input type="text" placeholder="Username" value={username} onChange={handleUsername} />
          <div className="btnGrp">
            <button className="btn joinBtn" onClick={joinRoom}>Join</button>
            <button className="btn createRomm" onClick={createRoomId}>Create Room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
