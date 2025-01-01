import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Container,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function KitchenView({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [useMarathi, setUseMarathi] = useState(true);

  // Hardcoded sample data based on restaurant ID
  const hardcodedOrders = {
    rest1: [
      {
        tableNumber: 1,
        items: [
          { name: 'Tea', marathiName: 'चहा', quantity: 2, completed: false },
          { name: 'Dosa', marathiName: 'डोसा', quantity: 1, completed: true },
        ],
      },
      {
        tableNumber: 2,
        items: [
          { name: 'Coffee', marathiName: 'कॉफी', quantity: 3, completed: false },
        ],
      },
    ],
    rest2: [
      {
        tableNumber: 1,
        items: [
          { name: 'Burger', marathiName: 'बर्गर', quantity: 2, completed: true },
        ],
      },
    ],
  };

  useEffect(() => {
    // Fetch orders based on restaurant ID (hardcoded here as 'rest1')
    const restaurantId = user?.restaurantId || 'rest1'; // Hardcoded for now
    setOrders(hardcodedOrders[restaurantId] || []);
  }, [user]);

  const toggleItemCompletion = (tableIndex, itemIndex) => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      const table = updatedOrders[tableIndex];
      const item = table.items[itemIndex];
      item.completed = !item.completed;
      return updatedOrders;
    });
  };

  const handleLanguageToggle = () => {
    setUseMarathi(!useMarathi);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {useMarathi ? 'स्वयंपाकघर दृश्य' : 'Kitchen View'}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLanguageToggle}
            style={{
              backgroundColor: '#424242',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '5px',
              marginRight: '10px',
            }}
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
          {orders.map((table, tableIndex) => (
            <Grid item xs={12} sm={6} md={4} key={table.tableNumber}>
              <Card>
                <CardHeader
                  title={
                    useMarathi
                      ? `टेबल ${table.tableNumber}`
                      : `Table ${table.tableNumber}`
                  }
                />
                <CardContent>
                  <List>
                    {table.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <ListItemText
                          primary={
                            useMarathi ? item.marathiName : item.name
                          }
                          secondary={`${
                            useMarathi ? 'संख्या' : 'Quantity'
                          }: ${item.quantity}`}
                        />
                        <Checkbox
                          checked={item.completed}
                          onChange={() =>
                            toggleItemCompletion(tableIndex, itemIndex)
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
