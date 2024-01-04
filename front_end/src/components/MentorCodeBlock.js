import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


class MentorCodeBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "id": props.id,
            "title": '',
            "code": '',
            "isMentor": props.isMentor
        };
    }

    componentDidMount() {
        this.fetchCodeList();
        this.setupSocket();
    }

    fetchCodeList = async () => {
        try {
            const response = await fetch(`http://localhost:3002/get_code_block/${this.state.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { title, code } = await response.json();
            this.setState({ title, code });
        } catch (error) {
            console.error('Error fetching code list:', error);
        }
    };

    setupSocket = () => {
        const { socket } = this.props;
        console.log("try1");
        console.log("try2");
        socket.on('updateCodeBody', (data) => {
            if (data.id === this.state.id) {
                this.setState({ code: data.newCode });
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
        const { id, title, code, isMentor } = this.state;
        return (
            <div>
            <h1>ID: {id}</h1>
            <div>
                <h1>{title}</h1>
                {/* Use SyntaxHighlighter for syntax highlighting */}
                <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
        );
    }
}

export default MentorCodeBlock;
