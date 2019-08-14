import React, { Component, createElement, cloneElement, useState, useEffect} from 'react';
import {EditorState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator, ContentState, SelectionState, Modifier} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import './App.css';
import createHighlightPlugin from './components/HighlightPlugin';
import createImagePlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css'
import SearchHighlight from './components/SearchHighlight';
import createNewlinePlugin from './components/HandleNewLine';

const highlightPlugin = createHighlightPlugin({
  background: 'purple',
  color: 'yellow',
  border: '1px solid black',
});

// Method is used to loop over the required text
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
const newLinePlugin =  createNewlinePlugin();

const App = () => {
  // Use this for creating dynamic EditorState object
  const text = EditorState.createWithContent(ContentState.createFromText('Hello,peace', ","));
  const [editorState, setEditorChange] = useState(text);
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
      //setEditorChange(EditorState.createWithContent(convertFromRaw(JSON.parse(content))));
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

  const readable = content => JSON.stringify(content.toJS(), null, 4);

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
   onChange(EditorState.set(editorState, {decorator: generateDecorator(e.target.value)}))
  }

  const onChangeReplace = e => {
    setReplace(e.target.value);
  }

  const onReplace = () => {
    const regex = new RegExp(search, 'g');
    const selectionsToReplace = [];
    const blockMap = editorState.getCurrentContent().getBlockMap();

    blockMap.forEach((contentBlock) => (
      findWithRegex(regex, contentBlock, (start, end) => {
        const blockKey = contentBlock.getKey();
        const blockSelection = SelectionState
          .createEmpty(blockKey)
          .merge({
            anchorOffset: start,
            focusOffset: end,
          });

        selectionsToReplace.push(blockSelection)
      })
    ));

    let contentState = editorState.getCurrentContent();

    selectionsToReplace.forEach(selectionState => {
      // update the contentState key one at a time
      contentState = Modifier.replaceText(
        contentState,
        selectionState,
        replace,
      )

      // console.log('contentState loop', readable(contentState));
    });

    setEditorChange(EditorState.push(editorState, contentState, 'change-block-type'));

    //onChange(EditorState.set(editorState, {decorator: generateDecorator(e.target.value)}))
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
          plugins={[imagePlugin, highlightPlugin]}
        />
      </div>
      <EmojiSuggestions />

      <textarea className='App-Editor-Debug' value={JSON.stringify(editorState.toJS(), null, 4)}/>
    </>
  );
}

export default App;
