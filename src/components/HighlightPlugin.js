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
      'HIGHLIGHT': {
        ...defaultStyle,
        ...style,
      }
    },
    keyBindingFn: (e) => {
      if (e.metaKey && e.key === 'h') {
        return 'highlight';
      }
    },
    handleKeyCommand: (command, editorState, eventTimeStamp, { setEditorState }) => {
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
        return true;
      }
    },
  };
};