import React, { Component } from 'react'

import styles from './styles.module.css'

export class Info extends Component {
  render() {
    const { left, done } = this.props
    return (
      <div className={styles.info}>
        <h4>
        {left} left to do, {done} already done
        </h4>
      </div>
    )
  }
}