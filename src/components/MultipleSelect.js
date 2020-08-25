import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 400,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, selection, theme) => {
  return {
    fontWeight: selection.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
};

export default ({ selectionList, callback }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [selection, setSelection] = React.useState([]);

  const handleChange = event => {
    setSelection(event.target.value);
  };

  const handleClose = event => {
    callback(selection);
  };

  let selectoptions;
  if (selectionList && selectionList.length > 0) {
    selectoptions = selectionList.map(name => (
      <MenuItem key={name} value={name} style={getStyles(name, selection, theme)}>
        {name}
      </MenuItem>
    ));
  }

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex" justifyContent="flex-end" p={1} bgcolor="background.paper">
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-chip-label">Metrics</InputLabel>
          <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={selection}
            onChange={handleChange}
            onClose={handleClose}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {selectoptions}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};
