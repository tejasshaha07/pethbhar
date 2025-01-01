import React from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';

export default function InventorySection({ useMarathi }) {
  return (
    <Paper elevation={3} style={{ padding: '1rem' }}>
      <Typography variant="h6" gutterBottom>
        {useMarathi ? 'इन्व्हेंटरी सेक्शन' : 'Inventory Section'}
      </Typography>
      <TextField
        label={useMarathi ? 'आयटम नाव' : 'Item Name'}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary">
        {useMarathi ? 'सबमिट करा' : 'Submit'}
      </Button>
    </Paper>
  );
}
