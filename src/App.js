import React, { Component, createElement, cloneElement, useState, useEffect} from 'react';
import {EditorState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator, ContentState, SelectionState, Modifier} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import './App.css';
import createHighlightPlugin from './components/HighlightPlugin';
import createImagePlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css'
import SearchHighlight from './components/SearchHighlight';
import createNewlinePlugin from './components/HandleNewLine';
import createCounterPlugin from './plugins/Counter/Counter';


const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock, callback, contentState) {
  console.log('handleStrategy');
  findWithRegexA(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegexA(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const HandleSpan = (props) => {
  return <span {...props}>{props.children}</span>;
};

const HashtagSpan = (props) => {
  return <span {...props}>{props.children}</span>;
};

const highlightPlugin = createHighlightPlugin({
  background: 'purple',
  color: 'yellow',
  border: '1px solid black',
});

// Method is used to loop over the required text
const findWithRegexA = (regex, contentBlock, callback) => {
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

const counterPlugin = createCounterPlugin();
const {DecoratedCounter} = counterPlugin;

const App = () => {
  // Use this for creating dynamic EditorState object
  const text = EditorState.createWithContent(ContentState.createFromText('Hello,peace', ","));
  const [editorState, setEditorChange] = useState(text);
  const [search, setSearch] = useState('');
  const [replace, setReplace] = useState('');

  const decorators = [
    {
      strategy: handleStrategy,
      component: HandleSpan,
    },
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
  ];

  const onChange = editorState => {
    const focusKey = editorState.getSelection().getFocusKey();
    console.log('onChange called here focusKey', focusKey);
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

  const blockStyleFn = contentBlock => {
    if (contentBlock.getText() === 'Hii') {
      return 'cssClassToUseOnEveryHii';
    }
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
          decorators={decorators}
          plugins={[imagePlugin, highlightPlugin, counterPlugin]}
          blockStyleFn={blockStyleFn}
        />
      </div>
      <EmojiSuggestions />

      <DecoratedHighlight/>

      <DecoratedCounter/>

      <textarea className='App-Editor-Debug' value={JSON.stringify(editorState.toJS(), null, 4)}/>
    </>
  );
}

export default App;
