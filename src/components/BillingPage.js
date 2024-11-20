import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Box,
  Fade,
  Autocomplete,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import LogoutIcon from '@mui/icons-material/Logout';

const menuItems = [
  { code: 'T15', name: 'Tea', marathiName: 'चहा', price: 2 },
  { code: 'D23', name: 'Dosa', marathiName: 'डोसा', price: 5 },
  { code: 'C10', name: 'Coffee', marathiName: 'कॉफी', price: 3 },
  { code: 'I30', name: 'Idli', marathiName: 'इडली', price: 4 },
  { code: 'B20', name: 'Burger', marathiName: 'बर्गर', price: 6 },
];

const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BillingPage({ user, onLogout }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrders, setTableOrders] = useState({});
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [useMarathi, setUseMarathi] = useState(true);

  const frequentlyOrderedItems = ['T15', 'D23', 'C10']; // Frequently ordered item codes

  const handleAddRow = () => {
    if (!selectedTable) {
      alert(useMarathi ? 'कृपया टेबल निवडा' : 'Please select a table first');
      return;
    }
    setTableOrders((prevOrders) => ({
      ...prevOrders,
      [selectedTable]: [
        ...(prevOrders[selectedTable] || []),
        { code: '', name: '', quantity: 1, price: 0 },
      ],
    }));
  };

  const handleAddFrequentItem = (code) => {
    const selectedItem = menuItems.find((menuItem) => menuItem.code === code);
    if (!selectedItem || !selectedTable) return;

    setTableOrders((prevOrders) => {
      const updatedOrders = [...(prevOrders[selectedTable] || [])];
      const existingItemIndex = updatedOrders.findIndex((item) => item.code === code);

      if (existingItemIndex >= 0) {
        updatedOrders[existingItemIndex].quantity += 1;
        updatedOrders[existingItemIndex].price =
          updatedOrders[existingItemIndex].quantity * selectedItem.price;
      } else {
        updatedOrders.push({ ...selectedItem, quantity: 1 });
      }

      return { ...prevOrders, [selectedTable]: updatedOrders };
    });
  };

  const handleRemoveRow = (index) => {
    setTableOrders((prevOrders) => {
      const updatedOrders = [...(prevOrders[selectedTable] || [])];
      updatedOrders.splice(index, 1);
      return { ...prevOrders, [selectedTable]: updatedOrders };
    });
  };

  const handleUpdateRow = (index, field, value) => {
    setTableOrders((prevOrders) => {
      const updatedOrders = [...(prevOrders[selectedTable] || [])];
      const selectedItem = menuItems.find((item) => item.code === updatedOrders[index].code);

      updatedOrders[index] = {
        ...updatedOrders[index],
        [field]:
          field === 'quantity'
            ? Math.max(1, parseInt(value) || 1) // Ensure quantity is at least 1
            : value,
        price:
          field === 'quantity' && selectedItem
            ? (parseInt(value) || 1) * selectedItem.price
            : updatedOrders[index].price,
      };

      return { ...prevOrders, [selectedTable]: updatedOrders };
    });
  };

  const handleGenerateInvoice = () => setIsInvoiceDialogOpen(true);
  const handleCloseInvoiceDialog = () => setIsInvoiceDialogOpen(false);

  const currentOrder = selectedTable ? tableOrders[selectedTable] || [] : [];
  const totalAmount = currentOrder.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0
  );

  const getTranslatedName = (code) => {
    const item = menuItems.find((menuItem) => menuItem.code === code);
    return item ? (useMarathi ? item.marathiName : item.name) : '';
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {useMarathi ? 'रेस्टॉरंट बिलिंग सिस्टीम' : 'Restaurant Billing System'}
          </Typography>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#424242',
              color: '#ffffff',
              marginRight: '10px',
              padding: '6px 16px',
              fontWeight: 'bold',
              borderRadius: '5px',
            }}
            onClick={() => setUseMarathi(!useMarathi)}
          >
            {useMarathi ? 'English' : 'मराठी'}
          </Button>
          <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
            {useMarathi ? 'बाहेर पडा' : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6">
                {useMarathi ? 'सर्वाधिक मागवलेले' : 'Frequently Ordered'}
              </Typography>
              {frequentlyOrderedItems.map((code) => (
                <Button
                  key={code}
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ margin: '0.5rem 0' }}
                  disabled={!selectedTable}
                  onClick={() => handleAddFrequentItem(code)}
                >
                  {getTranslatedName(code)}
                </Button>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                {useMarathi ? 'टेबल निवड' : 'Table Selection'}
              </Typography>
              <Box display="flex" flexWrap="wrap" justifyContent="center">
                {tables.map((table) => (
                  <Fade in={true} key={table} style={{ transitionDelay: `${table * 50}ms` }}>
                    <Button
                      variant={selectedTable === table ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => setSelectedTable(table)}
                      style={{ margin: '0.5rem' }}
                    >
                      {useMarathi ? `टेबल ${table}` : `Table ${table}`}
                    </Button>
                  </Fade>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '1rem', marginTop: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                {useMarathi
                  ? `सध्याची ऑर्डर - ${selectedTable ? `टेबल ${selectedTable}` : 'कोणतेही टेबल निवडलेले नाही'}`
                  : `Current Order - ${selectedTable ? `Table ${selectedTable}` : 'No table selected'}`}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{useMarathi ? 'आयटम कोड' : 'Item Code'}</TableCell>
                    <TableCell>{useMarathi ? 'आयटम नाव' : 'Item Name'}</TableCell>
                    <TableCell align="right">{useMarathi ? 'संख्या' : 'Quantity'}</TableCell>
                    <TableCell align="right">{useMarathi ? 'किंमत' : 'Price'}</TableCell>
                    <TableCell align="center">{useMarathi ? 'क्रिया' : 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentOrder.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Autocomplete
                          options={menuItems}
                          getOptionLabel={(option) => option.code}
                          value={
                            menuItems.find((menuItem) => menuItem.code === item.code) || null
                          }
                          onChange={(e, newValue) =>
                            handleUpdateRow(index, 'code', newValue ? newValue.code : '')
                          }
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" size="small" />
                          )}
                        />
                      </TableCell>
                      <TableCell>{getTranslatedName(item.code)}</TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.quantity || ''}
                          onChange={(e) => handleUpdateRow(index, 'quantity', e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.price || ''}
                          onChange={(e) => handleUpdateRow(index, 'price', e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleRemoveRow(index)}>
                          <Typography>X</Typography>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                onClick={handleAddRow}
                variant="contained"
                color="primary"
                style={{ marginTop: '1rem' }}
              >
                {useMarathi ? 'आयटम जोडा' : 'Add Item'}
              </Button>
              <Typography align="right" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                {useMarathi ? 'एकूण रक्कम:' : 'Total Amount:'} ₹{totalAmount.toFixed(2)}
              </Typography>
              <Button
              variant="contained"
              style={{
                marginTop: '1rem',
                width: '100%',
                backgroundColor: '#1976d2', // Blue color matching the AppBar
                color: '#ffffff', // White text for contrast
                fontWeight: 'bold',
                fontSize: '16px',
              }}
              onClick={handleGenerateInvoice}
            >
              {useMarathi ? 'बिल तयार करा' : 'Generate Invoice'}
            </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={isInvoiceDialogOpen} onClose={handleCloseInvoiceDialog} maxWidth="md" fullWidth>
        <DialogTitle>{useMarathi ? 'बिल पूर्वावलोकन' : 'Invoice Preview'}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {useMarathi ? 'रेस्टॉरंटचे नाव' : 'Restaurant Name'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {useMarathi ? 'टेबल:' : 'Table:'} {selectedTable}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {useMarathi ? 'दिनांक:' : 'Date:'} {new Date().toLocaleString()}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{useMarathi ? 'आयटम' : 'Item'}</TableCell>
                <TableCell align="right">{useMarathi ? 'संख्या' : 'Quantity'}</TableCell>
                <TableCell align="right">{useMarathi ? 'किंमत' : 'Price'}</TableCell>
                <TableCell align="right">{useMarathi ? 'एकूण' : 'Total'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrder.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{getTranslatedName(item.code)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <strong>{useMarathi ? 'एकूण रक्कम' : 'Total'}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog} color="primary">
            {useMarathi ? 'बंद करा' : 'Close'}
          </Button>
          <Button onClick={() => window.print()} color="primary" startIcon={<PrintIcon />}>
            {useMarathi ? 'प्रिंट करा' : 'Print'}
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 20mm;
          }

          body * {
            visibility: hidden;
          }

          .MuiDialog-root,
          .MuiDialog-root * {
            visibility: visible;
          }

          .MuiDialog-root {
            position: absolute;
            left: 0;
            top: 0;
          }

          .MuiDialogActions-root {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .MuiContainer-root {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
      `}</style>

    </div>
  );
}
