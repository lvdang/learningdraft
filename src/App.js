import React, { Component, createElement, cloneElement, useState} from 'react';
import { Editor, EditorState, RichUtils} from 'draft-js';
import './App.css';

const App = () => {
  const [editorState, setEditorChange] = useState(EditorState.createEmpty());

  const onChange = editorState => {
    setEditorChange(editorState);
  }

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const onUnderlineClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  }

  return (
    <>
      <button onClick={onUnderlineClick}>Underline</button>
      <div className="App-EditorBorder">
        <Editor
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          editorState={editorState}
        />
      </div>
      <textarea className='App-Editor-Debug' value={JSON.stringify(editorState.toJS(), null, 4)}/>
    </>
  );
}

export default App;
