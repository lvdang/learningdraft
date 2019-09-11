import  {RichUtils, EditorBlock} from 'draft-js';
import React from 'react';
import './HighlightPlugin.css';

const defaultStyle = {
  background: 'blue',
  padding: '0 .3em',
  color: '#fff',
};

export default (style = {}) => {

  const DecoratedHighlight = props => {
    return (<div className="highlight">{"HighlightBoo"}</div>);
  };

  const Item = props => (
    <>
      <div className="ipBlockIconContainer">
        <img alt="Slack API"  width="50px" src="https://a.slack-edge.com/80588/img/slack_api_logo_vogue.png"/>
      </div>
      <div className="editorBox">
        <EditorBlock {...props}/>
      </div>
    </>
  );
  return {
    blockStyleFn: block => {
      switch (block.getType()) {
        case "unstyled":
          return "ipBlock ipBlockMain";
        default:
          return "ipBlock";
      }
    },
    blockRendererFn: (contentBlock, {setEditorState, getEditorState}) => {
      return {
        component: Item,
        props: {
          onChange: setEditorState,
          getEditorState: getEditorState(),
        },
      };
    },
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

      // This is needed for renderBlockFn to work properly to set the editorState with newState
      // Will our own key command then update editorState
      if (command === 'backspace') { // Handle Delete aka 'backspace'
        const newState = RichUtils.onBackspace(editorState);

        if (newState !== null) {
          // Only update when newState is not empty
          setEditorState(newState);

          return 'handled';
        }

        return 'not-handled';
      }
    },
  };
};