import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Box,
  Fade,
  TextField,
  Autocomplete,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
  if (!user) {
    return <div>Loading...</div>;
  }

  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrders, setTableOrders] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [useMarathi, setUseMarathi] = useState(true);

  useEffect(() => {
    const filteredSuggestions = menuItems.filter(item => 
      item.code.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.marathiName.includes(inputValue)
    );
    setSuggestions(filteredSuggestions);
  }, [inputValue]);

  const handleAddItem = (item) => {
    if (!selectedTable) return;
  
    setTableOrders((prevOrders) => {
      const tableOrder = prevOrders[selectedTable] || [];
      const existingItemIndex = tableOrder.findIndex((i) => i.code === item.code);
  
      if (existingItemIndex >= 0) {
        // Clone the existing table order to avoid direct mutation
        const updatedOrder = tableOrder.map((orderItem, index) =>
          index === existingItemIndex
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
        return { ...prevOrders, [selectedTable]: updatedOrder };
      } else {
        return { ...prevOrders, [selectedTable]: [...tableOrder, { ...item, quantity: 1 }] };
      }
    });
  
    setInputValue('');
  };
  

  const handleRemoveItem = (index) => {
    setTableOrders((prevOrders) => {
      const tableOrder = [...prevOrders[selectedTable]]; // Clone the current table's order
      const item = tableOrder[index]; // Get the item to modify
  
      if (item.quantity > 1) {
        // Reduce the quantity by 1
        tableOrder[index] = { ...item, quantity: item.quantity - 1 };
      } else {
        // Remove the item from the order
        tableOrder.splice(index, 1);
      }
  
      // Update the state with the modified table order
      return { ...prevOrders, [selectedTable]: tableOrder };
    });
  };
  

  const handleTableSelect = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      handleAddItem(suggestions[0]);
    }
  };

  const handleGenerateInvoice = () => {
    setIsInvoiceDialogOpen(true);
  };

  const handleCloseInvoiceDialog = () => {
    setIsInvoiceDialogOpen(false);
  };

  const handlePrint = () => {
    const printButtons = document.querySelectorAll('.no-print');
    printButtons.forEach(button => button.style.display = 'none');
    window.print();
    printButtons.forEach(button => button.style.display = '');
  };

  const handleLanguageToggle = () => {
    setUseMarathi(!useMarathi);
  };

  const currentOrder = selectedTable ? tableOrders[selectedTable] || [] : [];
  const totalAmount = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Restaurant Billing System
        </Typography>
        {user?.role === 'admin' && (
            <>
              <Button color="inherit">{useMarathi ? 'माल सूची' : 'Inventory'}</Button>
              <Button color="inherit">{useMarathi ? 'व्यवस्थापन' : 'Admin'}</Button>
            </>
          )}
        <Button
          onClick={handleLanguageToggle}
          style={{
            border: "2px solid #ffffff",
            padding: "5px 15px",
            borderRadius: "5px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            backgroundColor: useMarathi ? "#f0f0f0" : "#ffffff",
            color: useMarathi ? "#000000" : "#555555",
            fontWeight: "bold",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "4px 4px 10px rgba(0, 0, 0, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
          }}
        >
          {useMarathi ? "मराठी" : "English"}
        </Button>
        <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
          {useMarathi ? 'बाहेर पडा' : 'Logout'}
        </Button>
      </Toolbar>
    </AppBar>



      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                {useMarathi ? 'मेनू आयटम जोडा' : 'Add Menu Item'}
              </Typography>
              {!selectedTable && (
                <Alert severity="warning" style={{ marginBottom: '1rem' }}>
                  {useMarathi ? 'कृपया मेनू आयटम जोडण्यापूर्वी टेबल निवडा.' : 'Please select a table before adding menu items.'}
                </Alert>
              )}
              <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={(option) => `${option.code} - ${useMarathi ? option.marathiName : option.name}`}
                inputValue={inputValue}
                value={null}
                onInputChange={handleInputChange}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue === 'object') {
                    handleAddItem(newValue);
                    setInputValue('');
                  }
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label={useMarathi ? "आयटम कोड किंवा नाव प्रविष्ट करा" : "Enter item code or name"}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    onKeyDown={handleInputKeyDown}
                    disabled={!selectedTable}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography variant="body1">
                      {option.code} - {useMarathi ? option.marathiName : option.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginLeft: 'auto' }}>
                      ₹{option.price.toFixed(2)}
                    </Typography>
                  </li>
                )}
                disabled={!selectedTable}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                {useMarathi ? 'टेबल निवड' : 'Table Selection'}
              </Typography>
              <Box display="flex" flexWrap="wrap" justifyContent="center">
                {tables.map((table) => (
                  <Fade in={true} key={table} style={{ transitionDelay: `${table * 50}ms` }}>
                    <Button
                      variant={selectedTable === table ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleTableSelect(table)}
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
                  : `Current Order - ${selectedTable ? `Table ${selectedTable}` : 'No table selected'}`
                }
              </Typography>
              <List>
                {currentOrder.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`${item.code} - ${useMarathi ? item.marathiName : item.name}`} 
                      secondary={`₹${item.price} x ${item.quantity}`} 
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveItem(index)}>
                        <Typography>×</Typography>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" align="right" style={{ marginTop: '1rem' }}>
                {useMarathi ? 'एकूण:' : 'Total:'} ₹{totalAmount.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={handleGenerateInvoice}
                disabled={currentOrder.length === 0}
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
                  <TableCell>{useMarathi ? item.marathiName : item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right"><strong>{useMarathi ? 'एकूण रक्कम' : 'Total'}</strong></TableCell>
                <TableCell align="right"><strong>₹{totalAmount.toFixed(2)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions className="no-print">
          <Button onClick={handleCloseInvoiceDialog} color="primary">
            {useMarathi ? 'बंद करा' : 'Close'}
          </Button>
          <Button onClick={handlePrint} color="primary" startIcon={<PrintIcon />}>
            {useMarathi ? 'प्रिंट करा' : 'Print'}
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}