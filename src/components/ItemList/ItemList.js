import React, { Component } from 'react'

import {Item} from '../Item'

// import styles from './styles.module.css'

export class ItemList extends Component {
  render() {
    const { filter } = this.props
    return (
      <div>
        <Item filter={filter}/>
        <Item filter={filter}/>
        <Item filter={filter}/>
        <Item filter={filter}/>
      </div>
    )
  }
}