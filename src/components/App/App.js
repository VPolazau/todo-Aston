import React, { Component } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { Info } from '../Info';
import { Filter } from '../Filter';
import { NewItemForm } from '../NewItemForm';
import { ItemList } from '../ItemList';
import { todoEvents } from '../../events/events';

import styles from './styles.module.css';

export class App extends Component {
  state = {
    isLightTheme: true,
    filter: 'ALL',
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
  }

  changeTheme = () => {
    this.setState({ isLightTheme: !this.state.isLightTheme })
    document.body.dataset.theme = this.state.isLightTheme ? 'dark' : 'light'
  }

  render() {
    console.log(this.state);
    const { isLightTheme, filter } = this.state;
    return (
      <ThemeProvider theme={this.setTheme()}>
        <IconButton className={styles.switchTheme} size='small' variant='contained' onClick={this.changeTheme}>
          {isLightTheme ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <div className={styles.container}>
          <h1 className={isLightTheme ? styles.titleLight : styles.titleDark}>TODO List</h1>
          <Info left={10} done={5} />
          <Filter/>
          <ItemList filter={filter}/>
          <NewItemForm />
        </div>
      </ThemeProvider>
    );
  }
}
