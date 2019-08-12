import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(editorState) {
    this.setState({editorState});
  }

  render() {
    return (
      <div className='App-EditorBorder'>
        <Editor
          onChange={this.handleOnChange}
          editorState={this.state.editorState}
        />
      </div>
    );
  }
}

export default App;
