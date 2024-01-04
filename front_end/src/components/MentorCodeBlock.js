import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Class definition for the MentorCodeBlock component.
class MentorCodeBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "id": props.id,
            "title": '',
            "code": '',
            "solution": "",
            "isMentor": props.isMentor
        };
    }

    componentDidMount() {
        this.fetchCodeList();
        this.setupSocket();
    }
    // Asynchronous function to fetch code block details from the server.
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
                this.setState({ code: data.newCode });
            // Checking if the new code matches the solution and displaying an alert.
            if (data.newCode == this.state.solution) {
                window.alert('Good job! Your solution is correct.');
            }
            }
        });
    };

    handleBodyChange = (newCode) => {
        const { socket } = this.props;

        this.setState({ code: newCode });

        if (socket) {
            socket.emit('updateCodeBody', { id: this.state.id, newCode });
        }
    };

    render() {
        const { id, title, code, solution, isMentor } = this.state;
        return (
        <div>
          <div>
                {isMentor === 1 ? (
                  <h1>Code Page For Mentor</h1>
                ) : (
                    <h1>Code Page For Student</h1>
                )}
                <h2>the task is : {title}</h2>
                {/* Use SyntaxHighlighter for syntax highlighting */}
                <SyntaxHighlighter className="code-highlighter" language="javascript" style={vscDarkPlus}>
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
        );
    }
}

export default MentorCodeBlock;
