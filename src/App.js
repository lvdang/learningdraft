import React, { Component, createElement, cloneElement, useState, useEffect} from 'react';
import {EditorState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import './App.css';
import createHighlightPlugin from './components/HighlightPlugin';
import createImagePlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css'
import SearchHighlight from './components/SearchHighlight';

const highlightPlugin = createHighlightPlugin({
  background: 'purple',
  color: 'yellow',
  border: '1px solid black',
});

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

const generateDecorator = (highlightTerm) => {
  const regex = new RegExp(highlightTerm, 'g');
  console.log('regex', regex);
  return new CompositeDecorator([{
    strategy: (contentBlock, callback) => {
      if (highlightTerm !== '') {
        findWithRegex(regex, contentBlock, callback);
      }
    },
    component: SearchHighlight,
  }])
};


const imagePlugin = createImagePlugin();
const { EmojiSuggestions } = imagePlugin;
const { DecoratedHighlight } = highlightPlugin;

const App = () => {
  const [editorState, setEditorChange] = useState(EditorState.createEmpty());
  const [search, setSearch] = useState('');
  const [replace, setReplace] = useState('');

  const onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    const key = editorState.getSelection().getStartKey();
    const keyBlock = contentState.getBlockForKey(key);

    setEditorChange(editorState);
  }

  useEffect(() => {
    const content = window.localStorage.getItem('content');
    if (content) {
      setEditorChange(EditorState.createWithContent(convertFromRaw(JSON.parse(content))));
    }
  }, []);

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const clearLocalStorage = () => {
    window.localStorage.removeItem('content');
    setEditorChange(EditorState.createEmpty());
  }

  const onUnderlineClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  }

  const onToggleCode = () => {
    onChange(RichUtils.toggleCode(editorState));
  }

  const saveContent = () => {
    const content = editorState.getCurrentContent();
    window.localStorage.setItem('content', JSON.stringify(convertToRaw(content)));
  }

 const onChangeSearch = e => {
   setSearch(e.target.value);
   console.log('onChangeSearch', e.target.value);
   onChange(EditorState.set(editorState, {decorator: generateDecorator(e.target.value)}))
  }

  const onChangeReplace = e => {
    setReplace(e.target.value);
  }

  const onReplace = () => {
    console.log(`replacing "${search}" with "${replace}"`);
  }

  return (
    <>
      {/*<button onClick={onUnderlineClick}>Underline</button>*/}
      {/*<button onClick={onToggleCode}>Code Block</button>*/}
      <button onClick={clearLocalStorage}>Clear All Persisent Data</button>
      <button onClick={saveContent}>Save Persistent Data</button>
      <div className="search-and-replace">
        <input
          value={search}
          onChange={onChangeSearch}
          placeholder="Search..."
        />
        <input
          value={replace}
          onChange={onChangeReplace}
          placeholder="Replace..."
        />
        <button onClick={onReplace}>
          Replace
        </button>
      </div>
      <div className="App-EditorBorder">
        <Editor
          onChange={onChange}
          editorState={editorState}
          plugins={[highlightPlugin, imagePlugin]}
        />
      </div>
      <DecoratedHighlight/>
      <EmojiSuggestions />

      <textarea className='App-Editor-Debug' value={JSON.stringify(editorState.toJS(), null, 4)}/>
    </>
  );
}

export default App;
