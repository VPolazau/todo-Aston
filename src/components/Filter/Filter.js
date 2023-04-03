import React, { Component } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';

import { todoEvents } from '../../events/events';

export class Filter extends Component {
  state = {
    searchValue: '',
    alignment: 'ALL',
  };

  handleButtonFilter = (e) => {
    if (this.state.alignment === e.target.innerText) return;
    todoEvents.emit('filterChange', e.target.innerText);
    this.setState({ alignment: e.target.innerText });
  };

  changeSearchFilter = (e) => {
    this.setState({searchValue: e.target.value})
    todoEvents.emit('searchChange', e.target.value)
  };

  render() {
    const { activeCount, doneCount, archiveCount } = this.props;
    return (
      <div>
        <Badge id='allCount' color='primary' badgeContent={activeCount + doneCount} sx={{ left: 43, top: -18 }} />
        <Badge id='activeCount' color='success' badgeContent={activeCount} sx={{ left: 119, top: -18 }} />
        <Badge id='doneCount' color='error' badgeContent={doneCount} sx={{ left: 184, top: -18 }} />
        <Badge id='archiveCount' color='secondary' badgeContent={archiveCount} sx={{ left: 272, top: -18 }} />

        <ToggleButtonGroup aria-label='Platform' value={this.state.alignment} onClick={this.handleButtonFilter}>
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
          value={this.state.searchValue}
          onChange={(e) => this.changeSearchFilter(e)}
        />
      </div>
    );
  }
}
