import React from 'react';
import './SearchHighlight.css';

const SearchHighlight = (props) => {
  return (<span className="search">{props.children}</span>);
};

export default SearchHighlight;