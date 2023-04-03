import React, { Component } from 'react';
import { todoEvents } from '../../events/events';

import { Item } from '../Item';

import styles from './styles.module.css';

export class ItemList extends Component {
  state = {
    searchStr: '',
  }

  componentDidMount(){
    todoEvents.addListener('searchChange', (searchStr) => this.setState({searchStr}))
  }

  render() {
    const { filter, items } = this.props;
    const filteredItems = items.filter((item) => {
      if(filter === 'ARCHIVE') return item.isArchived === true
      if(filter === 'ALL') return item.type === 'ACTIVE' || item.type === 'DONE'
      if((filter === 'ACTIVE' || filter === 'DONE') && item.isArchived !== true) return filter === item.type
      return false
    })

    let resultItems = filteredItems.filter((item) => {
      return item.title.toLowerCase().indexOf(this.state.searchStr.toLowerCase()) > -1
    })
    if(this.state.searchStr.length === 0){
      resultItems = filteredItems
    }

    return (
      <>
        {resultItems.length === 0 && <div className={styles.container}>No tasks</div>}
        {resultItems.map((item) => (
          <Item key={item.id} filter={filter} item={item} />
        ))}
      </>
    );
  }
}
