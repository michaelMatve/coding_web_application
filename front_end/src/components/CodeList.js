import React, { Component } from "react";
import ListCodeItem from "./ListCodeItem";
/*
  Class definition for CodeList component.
*/
class CodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "codesList": [],
    };

  }

  componentDidMount() {
    this.fetchCodeList();
  }

    // Asynchronous function to fetch code list from the backend API.
  fetchCodeList = async () => {
    try {
      const response = await fetch('http://localhost:3002/getCodeList');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const { codesList } = await response.json();
      console.log('Received itemList:', codesList);
      this.setState({ codesList });
    } catch (error) {
      console.error('Error fetching code list:', error);
    }
  };
  
  // Render method displaying the code list as an unordered list.
  render() {
    const { codesList } = this.state;
    return (
      <div>
        <ul>
          {codesList.map((code) => (
            <ListCodeItem key={code._id} id={code._id} title= {code.title} />
          ))}
        </ul>
      </div>
    );
  }
}
  

export default CodeList;
