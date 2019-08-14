import  { RichUtils } from 'draft-js';
import React from 'react';

const defaultStyle = {
  background: 'blue',
  padding: '0 .3em',
  color: '#fff',
};

export default (style = {}) => {
  const DecoratedHighlight = props => {
    console.log('props', props);
    return (<div>{"Highlight"}</div>);
  };

  return {
    DecoratedHighlight,
    customStyleMap: {
      'HIGHLIGHTWORLD': {
        ...defaultStyle,
        ...style,
      },
      'BOLDP': {
        background: 'red',
      }
    },
    keyBindingFn: (e) => {
      if (e.metaKey && e.key === 'h') {
        return 'highlight';
      } else if (e.metaKey && e.key === 'p') {
        return 'boldp';
      }
    },
    handleKeyCommand: (command, editorState, eventTimeStamp, { setEditorState }) => {
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHTWORLD'));
        return true;
      }

      if (command === 'boldp') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLDP'));
        return true;
      }
    },
  };
};