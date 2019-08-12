import React, { Component, createElement, cloneElement} from 'react';
import { Editor, EditorState, RichUtils} from 'draft-js';
import './App.css';
import ConsoleButtons from './components/ConsoleButtons';

class App extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    this.setState({editorState});
  }

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  render() {
    let str  = JSON.stringify(this.state.editorState.toJS(), null, 4);

    return (
      <>
        <div className="App-EditorBorder">
          <Editor
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            editorState={this.state.editorState}
          />
        </div>
       <textarea className='App-Editor-Debug' value={str}/>
      </>
    );
  }
}

export default App;
