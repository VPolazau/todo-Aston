import React, { Component } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import EditIcon from '@mui/icons-material/Edit';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import styles from './styles.module.css';

export class Item extends Component {
  render() {
    const { filter } = this.props
    return (
      <Card sx={{ width: 700, height: 80, margin: 1, display: 'flex' }}>
        <CardContent sx={{ padding: 1 }}>
          <Typography component='div'>Title</Typography>
          <Typography mt={1} variant='caption' component='div' gutterBottom>
            khjsfkjdshf kajhdkaj h sdkajsh dkajshdk ajshdkajs hdkajshd
          </Typography>
        </CardContent>
        <div className={styles.card_btn}>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
          <IconButton>
            {filter === 'ARCHIVE' ? <UnarchiveIcon /> : <ArchiveIcon />}
          </IconButton>
        </div>
      </Card>
    );
  }
}
