import React, { Component } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import EditIcon from '@mui/icons-material/Edit';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Tooltip from '@mui/material/Tooltip';
import { CardActionArea } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

import { todoEvents } from '../../events/events';

import styles from './styles.module.css';
import { Alert } from '../Alert';
export class Item extends Component {
  state = {
    isDone: false,
    errorSnackbar: false,
    successSnackbar: false,
  };

  handleDoTask = () => {
    const { id, type, isArchived } = this.props.item;
    if (isArchived) {
      this.setState({ errorSnackbar: true });
    }
    if (type === 'ACTIVE') {
      this.setState({ successSnackbar: true });
    }
    this.setState({ isDone: !this.state.isDone });
    if (this.props.filter === 'ACTIVE') {
      setTimeout(() => {
        todoEvents.emit('changeTypeTask', id);
      }, 3000);
    } else {
      todoEvents.emit('changeTypeTask', id);
    }
  };

  handleCloseAlert = () => {
    this.setState({ errorSnackbar: false, successSnackbar: false });
  };

  handleChangeItem = (e) => {
    e.stopPropagation();
    todoEvents.emit('changeItem', this.props.item.id);
  };

  handleDeleteItem = (e) => {
    e.stopPropagation();
    todoEvents.emit('deleteItem', this.props.item.id);
  };

  handleArchiveItem = (e) => {
    e.stopPropagation();
    todoEvents.emit('archiveItem', this.props.item.id);
  };

  componentDidMount() {
    if (this.props.item.type === 'DONE') {
      this.setState({ isDone: true });
    }
  }

  render() {
    const { title, body, isArchived } = this.props.item;
    const { isDone, errorSnackbar, successSnackbar } = this.state;

    let contentClassName = '';
    if (isDone && !isArchived) {
      contentClassName = styles.line_through;
    }

    return (
      <>
        <Snackbar open={errorSnackbar} autoHideDuration={2000} onClose={this.handleCloseAlert}>
          <Alert severity='error' sx={{ width: '100%' }}>
            You cann't complete an archived task!
          </Alert>
        </Snackbar>
        <Snackbar open={successSnackbar} autoHideDuration={2000} onClose={this.handleCloseAlert}>
          <Alert severity='success' sx={{ width: '100%' }}>
            Congratulations! You completed the task!
          </Alert>
        </Snackbar>
        <Card
          onClick={this.handleDoTask}
          sx={{
            margin: 1,
            display: 'flex',
            width: '100%',
          }}
          elevation={3}
        >
          <CardActionArea
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              width: '100%',
            }}
          >
            <CardContent
              sx={{
                padding: 1,
                gap: 2,
                flexGrow: 1,
              }}
              className={contentClassName}
            >
              <Typography component='div'>{title}</Typography>
              <Typography mt={1} variant='caption' component='div' gutterBottom color='text.secondary'>
                {body}
              </Typography>
            </CardContent>

            <div className={styles.card_btn}>
              {isArchived || (
                <Tooltip title='Edit'>
                  <IconButton onClick={(e) => this.handleChangeItem(e)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title='Delete'>
                <IconButton onClick={(e) => this.handleDeleteItem(e)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={isArchived ? 'unAchive' : 'archive'}>
                <IconButton onClick={(e) => this.handleArchiveItem(e)}>
                  {isArchived ? <UnarchiveIcon color='secondary' /> : <ArchiveIcon />}
                </IconButton>
              </Tooltip>
            </div>
          </CardActionArea>
        </Card>
      </>
    );
  }
}
