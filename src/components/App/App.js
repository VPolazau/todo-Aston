import React, { Component } from 'react';
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

const items = [
  { id: 1, title: 'Дом', body: 'Сделать уборку', type: 'ACTIVE', isArchived: false },
  { id: 2, title: 'Машина', body: 'Заправиться', type: 'DONE', isArchived: false },
  { id: 3, title: 'Робота', body: 'Заполнить отчёт', type: 'ACTIVE', isArchived: false },
  { id: 4, title: 'Друзья', body: 'Поздравить с ДР', type: '', isArchived: true },
];
export class App extends Component {
  state = {
    isLightTheme: true,
    filter: 'ALL',
    isItemChangeMode: false,
    items: items,
    activeCount: 2,
    doneCount: 1,
    archiveCount: 1,
    changedItem: undefined,
    lastID: 4,
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
    todoEvents.addListener('filterChange', (filter) => this.setState({ filter }));

    todoEvents.addListener('closeNewItem', () => this.setState({ isItemChangeMode: false, changedItem: undefined }));

    todoEvents.addListener('saveNewItem', (item) => {
      this.setState(({ activeCount, doneCount, changedItem, items }) => {
        if (!changedItem) {
          return {
            isItemChangeMode: false,
            activeCount: activeCount + 1,
            lastID: item.id,
            items: [...items, item],
            filter: 'ALL',
          };
        }
        const idx = items.findIndex((i) => i.id === item.id);
        if (changedItem.type === 'DONE') {
          return {
            isItemChangeMode: false,
            changedItem: undefined,
            activeCount: activeCount + 1,
            doneCount: doneCount - 1,
            items: [...items.slice(0, idx), item, ...items.slice(idx + 1)],
            filter: 'ALL',
          };
        }
        return {
          isItemChangeMode: false,
          changedItem: undefined,
          items: [...items.slice(0, idx), item, ...items.slice(idx + 1)],
          filter: 'ALL',
        };
      });
    });

    todoEvents.addListener('changeTypeTask', (id) =>
      this.setState(({ items, activeCount, doneCount }) => {
        const idx = items.findIndex((item) => item.id === id);
        const newItem = { ...items[idx], type: items[idx].type === 'DONE' ? 'ACTIVE' : 'DONE' };
        if (items[idx].type === 'DONE') {
          return {
            activeCount: activeCount + 1,
            doneCount: doneCount - 1,
            items: [...items.slice(0, idx), newItem, ...items.slice(idx + 1)],
          };
        }
        if (items[idx].type === 'ACTIVE') {
          return {
            activeCount: activeCount - 1,
            doneCount: doneCount + 1,
            items: [...items.slice(0, idx), newItem, ...items.slice(idx + 1)],
          };
        }
      })
    );

    todoEvents.addListener('changeItem', (id) => {
      this.setState(({ items }) => {
        const idx = items.findIndex((item) => item.id === id);
        return { changedItem: items[idx], isItemChangeMode: true };
      });
    });

    todoEvents.addListener('deleteItem', (id) => {
      this.setState(({ items, doneCount, activeCount, archiveCount }) => {
        const idx = items.findIndex((item) => item.id === id);
        if (items[idx].type === 'DONE') {
          return { items: [...items.slice(0, idx), ...items.slice(idx + 1)], doneCount: doneCount - 1 };
        }
        if (items[idx].type === 'ACTIVE') {
          return { items: [...items.slice(0, idx), ...items.slice(idx + 1)], activeCount: activeCount - 1 };
        }
        return { items: [...items.slice(0, idx), ...items.slice(idx + 1)], archiveCount: archiveCount - 1 };
      });
    });

    todoEvents.addListener('archiveItem', (id) => {
      this.setState(({ items, activeCount, doneCount, archiveCount }) => {
        const idx = items.findIndex((item) => item.id === id);
        const newItem = {
          ...items[idx],
          isArchived: !items[idx].isArchived,
          type: items[idx].isArchived ? 'ACTIVE' : '',
        };

        if (items[idx].type === 'ACTIVE') {
          return {
            items: [...items.slice(0, idx), newItem, ...items.slice(idx + 1)],
            activeCount: activeCount - 1,
            archiveCount: archiveCount + 1,
          };
        }

        if (items[idx].type === 'DONE') {
          return {
            items: [...items.slice(0, idx), newItem, ...items.slice(idx + 1)],
            doneCount: doneCount - 1,
            archiveCount: archiveCount + 1,
          };
        }

        return {
          items: [...items.slice(0, idx), newItem, ...items.slice(idx + 1)],
          archiveCount: archiveCount - 1,
          activeCount: activeCount + 1,
        };
      });
    });
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
