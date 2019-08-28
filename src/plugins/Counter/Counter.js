import  { RichUtils } from 'draft-js';
import React from 'react';
import LineCounter from './DecorateErrorCount';

// https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-counter-plugin/src/index.js
// https://github.com/draft-js-plugins/draft-js-plugins/blob/master/HOW_TO_CREATE_A_PLUGIN.md

export default (style = {}) => {
  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };

  const DecoratedCounter = (props) =>
    <LineCounter {...props} store={store} limit={3}/>;

  return {
    DecoratedCounter,
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
  };
};