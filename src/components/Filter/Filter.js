import React, { Component } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';

import { todoEvents } from '../../events/events';

import styles from './styles.module.css';

export class Filter extends Component {
  state = {
    alignment: 'ALL',
  };

  handleButtonFilter = (e) => {
    todoEvents.emit('filterChange', e.target.innerText);
    this.setState({ alignment: e.target.innerText });
  };

  render() {
    return (
      <div className={styles.filter}>
        <ToggleButtonGroup aria-label='Platform' value={this.state.alignment} onChange={this.handleButtonFilter}>
          <ToggleButton color='primary' key='all' value='ALL'>
            All
          </ToggleButton>
          <ToggleButton color='success' key='active' value='ACTIVE'>
            Active
          </ToggleButton>
          <ToggleButton color='error' key='done' value='DONE'>
            Done
          </ToggleButton>
          <ToggleButton color='secondary' key='archive' value='ARCHIVE'>
            Archive
          </ToggleButton>
        </ToggleButtonGroup>
        <br />
        <TextField
          margin='normal'
          fullWidth
          size='small'
          id='outlined-basic'
          label='Type to search'
          variant='outlined'
        />
      </div>
    );
  }
}
