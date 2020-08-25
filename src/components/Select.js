import React from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default ({ selectionList, callback }) => {
  const [selection, setSelection] = React.useState([]);

  const handleChange = event => {
    if(event){
      setSelection(event.map(select => select.value));
    }else{
      setSelection([]);
    }
  };

  const handleClose = event => {
    callback(selection);
  };

  const formatSelection = () => {
    return selectionList.map(selection => {
      return { value: selection, label: selection };
    });
  };

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={formatSelection()}
      onChange={handleChange}
      onMenuClose={handleClose}
      placeholder="Metrics"
    />
  );
};
