import React, { Component, createElement, cloneElement, useState} from 'react';
import {EditorState, RichUtils} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
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

  const onToggleCode = () => {
    onChange(RichUtils.toggleCode(editorState));
  }

  return (
    <>
      {/*<button onClick={onUnderlineClick}>Underline</button>*/}
      {/*<button onClick={onToggleCode}>Code Block</button>*/}
      <div className="App-EditorBorder">
        <Editor
          onChange={onChange}
          editorState={editorState}
        />
      </div>
      <textarea className='App-Editor-Debug' value={JSON.stringify(editorState.toJS(), null, 4)}/>
    </>
  );
}

export default App;
