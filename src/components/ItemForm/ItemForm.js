import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { todoEvents } from '../../events/events';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export class ItemForm extends Component {
  state = {
    title: '',
    body: '',
    open: false,
  };

  componentDidMount() {
    const { title, body } = this.props.item;
    this.setState({ title, body });
  }

  handleCloseNewItem = () => {
    todoEvents.emit('closeNewItem');
  };

  handleSaveNewItem = () => {
    const {id} = this.props.item
    const {title, body} = this.state
    this.setState({ open: true });
    setTimeout(() => {
      if(title.length < 2) return
      todoEvents.emit('saveNewItem', {
        id: id || this.props.newID,
        title,
        body,
        type: 'ACTIVE',
        isArchived: false
      });
    }, 2000);
  };

  handleCloseAlert = () => {
    this.setState({ open: false });
  };

  handleChangeTitle = (e) => {
    this.setState({title: e.target.value})
  };

  handleChangeBody = (e) => {
    this.setState({body: e.target.value})
  };

  render() {
    const { title, body } = this.state;
    return (
      <>
        <TextField
          id='outlined-basic'
          label='Title'
          variant='outlined'
          size='small'
          sx={{ m: 3 }}
          fullWidth
          value={title}
          onChange={(e) => this.handleChangeTitle(e)}
        />
        <TextField
          id='filled-multiline-flexible'
          label='body'
          multiline
          maxRows={5}
          variant='outlined'
          fullWidth
          value={body}
          onChange={(e) => this.handleChangeBody(e)}
        />

        <Box sx={{ width: '80%', mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={this.handleCloseNewItem}>
            <KeyboardBackspaceIcon color='error' fontSize='large' />
          </IconButton>

          <IconButton onClick={this.handleSaveNewItem}>
            <SaveIcon color='success' fontSize='large' />
          </IconButton>
        </Box>
        <Snackbar open={this.state.open} autoHideDuration={1500} onClose={this.handleCloseAlert}>
          {title.length > 1 ? 
          <Alert severity='success' sx={{ width: '100%' }}>
            {this.props.item.title.length ? 'Task changed successfully!' : 'A new task has been added!'}
          </Alert> :
          <Alert severity='error' sx={{ width: '100%' }}>
            Title must be more then 2 characters!
          </Alert>
          }
        </Snackbar>
      </>
    );
  }
}

ItemForm.defaultProps = {
  item: {
    id: null,
    title: '',
    body: '',
  },
};
