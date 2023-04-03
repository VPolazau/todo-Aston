import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Fab from '@mui/material/Fab';

import { Filter } from '../Filter';
import { ItemForm } from '../ItemForm';
import { ItemList } from '../ItemList';
import { todoEvents } from '../../events/events';

import styles from './styles.module.css';

export class App extends Component {
  state = {
    isLightTheme: true,
    filter: 'ALL',
    isItemChangeMode: false,
    items: [],
    activeCount: 0,
    doneCount: 0,
    archiveCount: 0,
    changedItem: undefined,
    lastID: 0,
  };

  setTheme = () => {
    const theme = createTheme({
      palette: {
        mode: this.state.isLightTheme ? 'light' : 'dark',
      },
    });
    return theme;
  };

  componentDidMount() {
    const prevState = JSON.parse(localStorage.getItem('state'))
    this.setState(prevState)
    if(!prevState.isLightTheme){
      this.changeTheme()
    }
    
    todoEvents.addListener('filterChange', (filter) => this.setState({ filter }));

    todoEvents.addListener('closeNewItem', () => this.setState({ isItemChangeMode: false, changedItem: undefined }));

    todoEvents.addListener('saveNewItem', (item) => {
      this.setState(({ changedItem, items }) => {
        if (!changedItem) {
          return {
            isItemChangeMode: false,
            lastID: item.id,
            items: [...items, item],
            filter: 'ALL',
          };
        }
        const idx = items.findIndex((i) => i.id === item.id);
        return {
          isItemChangeMode: false,
          changedItem: undefined,
          items: [...items.slice(0, idx), item, ...items.slice(idx + 1)],
          filter: 'ALL',
        };
      });
    });

    todoEvents.addListener('changeTypeTask', (id) =>
      this.setState(({ items }) => {
        const idx = items.findIndex((item) => item.id === id);
        const newItem = { ...items[idx], type: items[idx].type === 'DONE' ? 'ACTIVE' : 'DONE' };
        return { items: [...items.slice(0, idx), newItem, ...items.slice(idx + 1)] };
      })
    );

    todoEvents.addListener('changeItem', (id) => {
      this.setState(({ items }) => {
        const idx = items.findIndex((item) => item.id === id);
        return { changedItem: items[idx], isItemChangeMode: true };
      });
    });

    todoEvents.addListener('deleteItem', (id) => {
      this.setState(({ items }) => {
        const idx = items.findIndex((item) => item.id === id);
        return { items: [...items.slice(0, idx), ...items.slice(idx + 1)] };
      });
    });

    todoEvents.addListener('archiveItem', (id) => {
      this.setState(({ items }) => {
        const idx = items.findIndex((item) => item.id === id);
        const newItem = {
          ...items[idx],
          isArchived: !items[idx].isArchived,
          type: items[idx].isArchived ? 'ACTIVE' : '',
        };

        return { items: [...items.slice(0, idx), newItem, ...items.slice(idx + 1)] };
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!deepEqual(prevState, this.state)) {
      localStorage.setItem('state', JSON.stringify(this.state));
      const newState = JSON.parse(localStorage.getItem('state'));

      const activeCount = newState.items.reduce((acc, i) => (i.type === 'ACTIVE' ? acc + 1 : acc), 0);
      const doneCount = newState.items.reduce((acc, i) => (i.type === 'DONE' ? acc + 1 : acc), 0);
      const archiveCount = newState.items.reduce((acc, i) => (i.isArchived ? acc + 1 : acc), 0);

      this.setState(newState);
      this.setState({ activeCount, doneCount, archiveCount });
    }
  }

  changeTheme = () => {
    this.setState({ isLightTheme: !this.state.isLightTheme });
    document.body.dataset.theme = this.state.isLightTheme ? 'dark' : 'light';
  };

  handleNewItemCreate = () => this.setState({ isItemChangeMode: true });

  render() {
    const { isLightTheme, filter, isItemChangeMode, items, activeCount, doneCount, archiveCount, changedItem, lastID } =
      this.state;
    return (
      <ThemeProvider theme={this.setTheme()}>
        <IconButton className={styles.switchTheme} variant='contained' onClick={this.changeTheme}>
          {isLightTheme ? <DarkModeIcon fontSize='large' /> : <LightModeIcon fontSize='large' />}
        </IconButton>
        <div className={styles.container}>
          <span className={isLightTheme ? styles.titleLight : styles.titleDark}>TODO List</span>
          {isItemChangeMode ? (
            <ItemForm item={changedItem} newID={lastID + 1} />
          ) : (
            <>
              <Filter activeCount={activeCount} doneCount={doneCount} archiveCount={archiveCount} />
              <ItemList filter={filter} items={items} />
              <Fab variant='extended' size='small' sx={{ m: 2, p: 2 }} onClick={this.handleNewItemCreate}>
                <AddCircleIcon sx={{ mr: 1 }} />
                New Task
              </Fab>
            </>
          )}
        </div>
      </ThemeProvider>
    );
  }
}
