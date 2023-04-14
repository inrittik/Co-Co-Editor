import React, { useState } from 'react'
import Editor from '../components/Editor'
import Client from '../components/Client';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditorPage = () => {
  const [clients, setClients] = useState([]);

  const { roomId } = useParams();
  const navigate = useNavigate()

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
    toast.success("RoomID copied to clipboard");
  }

  const handleLeave = () => {
    navigate('/')
  }

  return (
    <div className="editor_page">
      <div className="sidebar">
        <div className="collaborators">Collaborators</div>
        <div className="clientList">
          {clients.map((client) => {
            return <Client {...client} />;
          })}

          <div className="btns">
            <div className="btn copyBtn" onClick={handleCopy}>
              Copy Room Id
            </div>
            <div className="btn leaveBtn" onClick={handleLeave}>
              Leave Room
            </div>
          </div>
        </div>
      </div>
      <Editor setClients={setClients} />
    </div>
  );
}

export default EditorPage