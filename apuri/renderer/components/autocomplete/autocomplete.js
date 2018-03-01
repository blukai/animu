import React from 'react'
import { object, string, func } from 'prop-types'

import Downshift from 'downshift'
import Input from 'material-ui/Input'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'

const renderInput = ({ inputProps }) => (
  <Input fullWidth inputProps={inputProps} />
)

const renderItem = ({ itemProps, item, selected }) => (
  <MenuItem
    {...itemProps}
    key={Math.random()}
    component="div"
    selected={selected}
  >
    {JSON.stringify(item)}
  </MenuItem>
)

// ----

const styles = {
  wrapper: {
    position: 'relative',
    flexGrow: 1
  },

  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%'
  }
}

const Autocomplete = ({ classes, placeholder, suggestions }) => (
  <Downshift>
    {({
      getInputProps,
      isOpen,
      inputValue,
      getItemProps,
      highlightedIndex
    }) => (
      <div className={classes.wrapper}>
        {renderInput({ inputProps: getInputProps({ placeholder }) })}
        {isOpen && (
          <Paper square className={classes.suggestions}>
            {suggestions(inputValue).map((item, index) =>
              renderItem({
                itemProps: getItemProps({ item }),
                item,
                selected: highlightedIndex === index
              })
            )}
          </Paper>
        )}
      </div>
    )}
  </Downshift>
)

Autocomplete.propTypes = {
  classes: object.isRequired,
  placeholder: string.isRequired,
  suggestions: func.isRequired
}

export default withStyles(styles)(Autocomplete)
