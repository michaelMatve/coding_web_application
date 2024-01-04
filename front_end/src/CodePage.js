import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import StudentCodeBlock from './components/StudentCodeBlock';
import MentorCodeBlock from './components/MentorCodeBlock';
import "./CodePage.css"

// Functional component definition for the CodePage.
const CodePage = () => {
    const { id } = useParams();
    const [socket, setSocket] = useState(null);
    const [isMentor, setIsMentor] = useState(null);

    useEffect(() => {
        
        //  Fetching the isMentor value from the server based on the code 'id'.
        fetch(`http://localhost:3002/Mentor_id/${id}`)
            .then(response => response.json())
            .then(data => {
                setIsMentor(data.isMentor);
            })
            .catch(error => {
                console.error('Error fetching isMentor:', error);
            });
        // Creating a socket connection to the backend using the 'io' library.
        const socket = io('http://localhost:3002', {
            query: { codeId: id , isMentor : null},
        });
        setSocket(socket);
        // Cleanup function to disconnect the socket when the component unmounts.
        return () => {
            socket.disconnect();
        };
    }, [id]);

    return (
      // Conditional rendering based on the presence of socket and isMentor value.
           <div>
      {socket && isMentor !== null && (
        // Rendering different code block components based on the isMentor value.
        <>
          {isMentor ? (
            <MentorCodeBlock id={id} socket={socket} isMentor = {1}/>
          ) : (
            <StudentCodeBlock id={id} socket={socket} isMentor = {0}/>
          )}
          <Link className="button-lobby" to="/">Lobby</Link>

        </>
      )}
    </div>
    );
};

export default CodePage;
