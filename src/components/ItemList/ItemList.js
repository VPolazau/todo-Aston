import React, { Component } from 'react';

import { Item } from '../Item';

export class ItemList extends Component {
  render() {
    const { filter, items } = this.props;
    const resultItems = items.filter((item) => {
      if(filter === 'ALL') return item.type === 'ACTIVE' || item.type === 'DONE'
      if((filter === 'ACTIVE' || filter === 'DONE') && item.isArchived !== true) return filter === item.type
      if(filter === 'ARCHIVE') return item.isArchived === true
    })
    return (
      <>
        {resultItems.map((item) => (
          <Item key={item.id} filter={filter} item={item} />
        ))}
      </>
    );
  }
}
