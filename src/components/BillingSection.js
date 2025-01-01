import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';

import {
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle, 
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Autocomplete,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';


const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function BillingSection({ useMarathi }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrders, setTableOrders] = useState({});
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedItemsForPrint, setSelectedItemsForPrint] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const frequentlyOrderedItems = ['MENU001', 'MENU002', 'MENU003']; // Limit to 3 items

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/Menu/GetMenuList/languagecode?languagecode=mr`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        const newMenuItems = result.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.defaultName,
          marathiName: item.name,
          price: item.mrp, // Assuming `mrp` is the price
        }));
        setMenuItems(newMenuItems); // Update state// Log the new array
      } catch (err) {
        console.error('Error fetching data:', err); // Handle errors
      }
    };

    fetchData(); // Call the function inside useEffect
  }, []);



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
      updatedOrders[index] = { ...updatedOrders[index], [field]: value };

      const selectedItem = menuItems.find((item) => item.code === updatedOrders[index].code);
      if (field === 'quantity' && selectedItem) {
        updatedOrders[index].price = (parseInt(value) || 1) * selectedItem.price;
      }
      return { ...prevOrders, [selectedTable]: updatedOrders };
    });
  };

  const handleGenerateInvoice = async () => {
    if (!selectedTable || currentOrder.length === 0) {
      alert(useMarathi ? 'कृपया टेबल निवडा आणि आयटम जोडा' : 'Please select a table and add items');
      return;
    }
  
    const invoiceData = {
      Invoice: {
        InvoiceNumber: `INV${Date.now()}`, // Generate a unique invoice number
        TableNumber: selectedTable,
        InvoiceDate: new Date().toISOString(),
        TotalCost: totalAmount,
        EmpId: currentUser?.id || 1,  // Replace with the actual employee ID
        InvoiceItems: currentOrder.map((item) => {
          const menuItem = menuItems.find((menu) => menu.code === item.code); // Find menu item by code
          if (!menuItem) {
            throw new Error(`Invalid menu item code: ${item.code}`);
          }
          return {
            menuId: menuItem.id, // Use the id field from the menuItems state
            qty: item.quantity,
            mrp: item.price,
          };
        }),
      },
    };
  
    try {
      const response = await fetch(`${apiBaseUrl}/Invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save invoice');
      }
  
      const result = await response.json();
      console.log('Saved Invoice:', result);
  
      // Set the invoice number in the state for preview
      const savedInvoiceNumber = result.invoiceNumber; // Make sure the backend returns this
  
      // Optionally store the result or invoice details in a state for the preview dialog
      setIsInvoiceDialogOpen(true); // Open the preview dialog
  
      alert(useMarathi ? 'बिल यशस्वीरित्या जतन झाले आणि पूर्वावलोकनासाठी तयार आहे' : 'Invoice saved successfully and ready for preview');
    } catch (err) {
      console.error('Error saving invoice:', err);
      alert(useMarathi ? 'बिल जतन करण्यात अडचण आली' : 'Failed to save invoice');
    }
  };
  
  
  const handleCloseInvoiceDialog = () => setIsInvoiceDialogOpen(false);



  const handleCheckboxChange = (index, checked) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [index]: checked,
    }));
  };

  const handlePrintPreview = () => {
    const selectedItems = currentOrder.filter((item, index) => checkedItems[index]);
    setPrintDialogOpen(true);
    setSelectedItemsForPrint(selectedItems);
  };
  
  const handleClosePrintDialog = () => setPrintDialogOpen(false);

  const handlePrint = () => {
    const printContent = document.getElementById('print-content'); // Get the printable content
    const printWindow = window.open('', '', 'height=800,width=800'); // This window size doesn't matter now
    
    // Dynamically calculate the content height
    const contentHeight = printContent.scrollHeight;
  
    printWindow.document.write('<html><head><title>Print Preview</title>');
    
    // Adding custom styles for thermal printing, paper size, font size, and layout adjustments
    printWindow.document.write(`
      <style>
        @page {
          size: 80mm 200mm; /* Adjust size to match thermal printer paper size */
          margin: 0; /* Remove default margins */
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          background-color: #fff;
        }
        .content {
          width: 100%;
          max-width: 100%; /* Ensure it takes full width */
          padding: 10px;
          box-sizing: border-box;
          font-size: 18px; /* Increased font size for better readability */
          height: ${contentHeight}px; /* Dynamically adjust content height */
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .header div {
          font-size: 16px;
        }
        .restaurant-name {
          font-size: 20px;
          font-weight: bold;
        }
        .date {
          font-size: 14px;
          color: #666;
        }
      </style>
    `);
  
    printWindow.document.write('</head><body>');
    
    // Adding restaurant name, table number, and date at the top
    const restaurantName = "Your Restaurant Name"; // Change this to your restaurant's name
    const tableNumber = "Table #1"; // You can dynamically change the table number
    const currentDate = new Date().toLocaleDateString(); // Get the current date
    
    printWindow.document.write(`
      <div class="content">
        <div class="header">
          <div class="restaurant-name">${restaurantName}</div>
          <div class="date">${currentDate}</div>
        </div>
        <div class="header">
          <div class="table-number">${tableNumber}</div>
        </div>
        ${printContent.innerHTML}
      </div>
    `);
  
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print(); // Trigger the print dialog
  };
  

  const currentOrder = selectedTable ? tableOrders[selectedTable] || [] : [];
  const totalAmount = currentOrder.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);

  const getTranslatedName = (code) => {
    const item = menuItems.find((menuItem) => menuItem.code === code);
    return item ? (useMarathi ? item.marathiName : item.name) : '';
  };

  return (
    <Grid container spacing={2}>
      {/* Frequently Ordered Section */}
      <Grid item xs={12} md={3}>
        <Paper elevation={3} style={{ padding: '1rem' }}>
          <Typography variant="h6">{useMarathi ? 'सर्वाधिक मागवलेले' : 'Frequently Ordered'}</Typography>
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

      {/* Table and Order Section */}
      <Grid item xs={12} md={9}>
        <Paper elevation={3} style={{ padding: '1rem' }}>
          <Typography variant="h6" gutterBottom>
            {useMarathi ? 'टेबल निवड' : 'Table Selection'}
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {tables.map((table) => (
              <Button
                key={table}
                variant={selectedTable === table ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setSelectedTable(table)}
              >
                {useMarathi ? `टेबल ${table}` : `Table ${table}`}
              </Button>
            ))}
          </div>

          <Table style={{ marginTop: '1rem' }}>
            <TableHead>
              <TableRow>
                <TableCell>{useMarathi ? 'आयटम निवडा' : 'Select item'}</TableCell>
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
                    <Checkbox
                      checked={checkedItems[index] || false}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      options={menuItems}
                      getOptionLabel={(option) => option.code}
                      value={menuItems.find((menuItem) => menuItem.code === item.code) || null}
                      onChange={(e, newValue) => handleUpdateRow(index, 'code', newValue ? newValue.code : '')}
                      renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
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
                  <TableCell align="right">{item.price || 0}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleRemoveRow(index)}>X</IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
          
          <Button variant="contained" color="primary" onClick={handleAddRow} style={{ marginTop: '1rem' }}>
            {useMarathi ? 'आयटम जोडा' : 'Add Item'}
          </Button>
          <Typography align="right" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            {useMarathi ? 'एकूण रक्कम:' : 'Total Amount:'} ₹{totalAmount.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrintPreview}
            startIcon={<PrintIcon />}
            style={{ marginRight: '1rem' }}
          >
            {useMarathi ? 'आदेश प्रिंट करा' : 'Print Order'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateInvoice} // Use the updated function
            startIcon={<PrintIcon />}
          >
            {useMarathi ? 'बिल तयार करा' : 'Generate Invoice'}
          </Button>
        </Paper>
      </Grid>
      
      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onClose={handleClosePrintDialog}>
        <DialogTitle>{useMarathi ? 'प्रिंट पूर्वावलोकन' : 'Print Preview'}</DialogTitle>
        <DialogContent>
          <div id="print-content">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{useMarathi ? 'आयटम नाव' : 'Item Name'}</TableCell>
                  <TableCell align="right">{useMarathi ? 'संख्या' : 'Quantity'}</TableCell>
                  <TableCell align="right">{useMarathi ? 'किंमत' : 'Price'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItemsForPrint.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrintDialog} color="primary">
            {useMarathi ? 'बंद करा' : 'Close'}
          </Button>
          {/* Print Button */}
          <Button onClick={handlePrint} color="primary">
            {useMarathi ? 'प्रिंट करा' : 'Print'}
          </Button>
        </DialogActions>
      </Dialog>
      


      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onClose={handleCloseInvoiceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{useMarathi ? 'बिल पूर्वावलोकन' : 'Invoice Preview'}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{useMarathi ? 'आयटम' : 'Item'}</TableCell>
                <TableCell align="right">{useMarathi ? 'संख्या' : 'Quantity'}</TableCell>
                <TableCell align="right">{useMarathi ? 'एकूण' : 'Total'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrder.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{getTranslatedName(item.code)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} align="right" style={{ fontWeight: 'bold' }}>
                  {useMarathi ? 'एकूण रक्कम' : 'Total Amount'}
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 'bold' }}>
                  ₹{totalAmount.toFixed(2)}
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
    </Grid>
  );
}
