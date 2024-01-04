import React, { Component } from 'react';
import { Editor } from '@monaco-editor/react';

//Class definition for the StudentCodeBlock component.
class StudentCodeBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "id": props.id,
            "title": '',
            "code": '',
            "solution": "",
            "isMentor" : props.isMentor,
            "isSendingUpdate": false
        };
    }

    componentDidMount() {
        this.fetchCodeList();
        this.setupSocket();
    }

    //Asynchronous function to fetch code block details from the server.
    fetchCodeList = async () => {
        try {
            const response = await fetch(`http://localhost:3002/get_code_block/${this.state.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { title, code,solution } = await response.json();
            this.setState({ title, code,solution });
        } catch (error) {
            console.error('Error fetching code list:', error);
        }
    };

    // Function to set up the socket and handle 'updateCodeBody' events.
    setupSocket = () => {
        const { socket } = this.props;
        // console.log("try1");
        // console.log("try2");
        socket.on('updateCodeBody', (data) => {
            if (data.id === this.state.id) {
                if (!this.state.isSendingUpdate) {
                    // console.log("updated");
                    this.setState({ code: data.newCode });
                }
                this.setState({ isSendingUpdate: false })
            }
        });
    };

    // Function to handle changes in the code body and emit socket events.
    handleBodyChange = (newCode) => {
        const { solution } = this.state;
        const { socket } = this.props;
        // Updating the component state with the new code and signaling an update.
        // isSendingUpdate is set true to not update himself
        this.setState({ code: newCode, isSendingUpdate: true });
        if (socket) {
            socket.emit('updateCodeBody', { id: this.state.id, newCode });
        }
        // Checking if the new code matches the solution and displaying an alert.
        if (newCode == solution) {
            window.alert('Good job! Your solution is correct.');
        }
    };

    render() {
        const { id, title, code, solution, isMentor } = this.state;
        return (
            <div>
                {isMentor === 1 ? (
                  <h1>Code Page For Mentor</h1>
                ) : (
                    <h1>Code Page For Student</h1>
                )}
                <h2>the task is : {title}</h2>
                <div>
                    <Editor width ="100%" height= "500px" theme='vs-dark' defaultLanguage='javascript' value={code} onChange={this.handleBodyChange}/>
                </div>
            </div>
        );
    }
}

export default StudentCodeBlock;