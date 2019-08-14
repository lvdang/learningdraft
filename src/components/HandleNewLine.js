import  { RichUtils } from 'draft-js';
import React from 'react';

export default (style = {}) => {
  return {

    // Learning to use shift key for keeping items on the same line
    // https://github.com/HubSpot/draft-convert/issues/83
    keyBindingFn: (e) => {
      console.log('shiftKey', e.shiftKey)
 ;     if (e.shiftKey) {
        return 'newline';
      }
    },
    handleKeyCommand: (command, editorState, eventTimeStamp, { setEditorState }) => {
      if (command === 'newline') {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return true;
      }
    },
  };
};