import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';

// Simulated data for orders
const initialOrders = [
  {
    id: 1,
    table: 1,
    items: [
      { id: 1, name: 'Tea', marathiName: 'चहा', quantity: 2, completed: false },
      { id: 2, name: 'Dosa', marathiName: 'डोसा', quantity: 1, completed: true },
    ],
  },
  {
    id: 2,
    table: 2,
    items: [
      { id: 3, name: 'Coffee', marathiName: 'कॉफी', quantity: 3, completed: false },
      { id: 4, name: 'Idli', marathiName: 'इडली', quantity: 2, completed: false },
    ],
  },
];

export default function KitchenView({ user, onLogout }) {
  const [orders, setOrders] = useState(initialOrders);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [useMarathi, setUseMarathi] = useState(true); // Language toggle state

  const handleToggleComplete = (orderId, itemId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : order
      )
    );
  };

  const handleEditItem = (order, item) => {
    setEditingOrder(order);
    setEditingItem(item);
  };

  const handleUpdateItem = () => {
    if (editingOrder && editingItem) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === editingOrder.id
            ? {
                ...order,
                items: order.items.map(item =>
                  item.id === editingItem.id ? editingItem : item
                ),
              }
            : order
        )
      );
      setEditingOrder(null);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (orderId, itemId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.filter(item => item.id !== itemId),
            }
          : order
      )
    );
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
          {orders.map(order => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card>
                <CardHeader title={`${useMarathi ? 'टेबल' : 'Table'} ${order.table}`} />
                <CardContent>
                  <List>
                    {order.items.map(item => (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary={`${useMarathi ? item.marathiName : item.name} (x${item.quantity})`}
                          secondary={item.completed ? (useMarathi ? 'पूर्ण' : 'Completed') : (useMarathi ? 'प्रलंबित' : 'Pending')}
                        />
                        <ListItemSecondaryAction>
                          <Checkbox
                            edge="end"
                            checked={item.completed}
                            onChange={() => handleToggleComplete(order.id, item.id)}
                          />
                          <IconButton edge="end" onClick={() => handleEditItem(order, item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteItem(order.id, item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={!!editingItem} onClose={() => setEditingItem(null)}>
        <DialogTitle>{useMarathi ? 'आयटम संपादित करा' : 'Edit Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={useMarathi ? 'आयटमचे नाव' : 'Item Name'}
            type="text"
            fullWidth
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            margin="dense"
            label={useMarathi ? 'प्रमाण' : 'Quantity'}
            type="number"
            fullWidth
            value={editingItem?.quantity || ''}
            onChange={(e) => setEditingItem(prev => ({ ...prev, quantity: parseInt(e.target.value, 10) }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingItem(null)}>{useMarathi ? 'रद्द करा' : 'Cancel'}</Button>
          <Button onClick={handleUpdateItem}>{useMarathi ? 'अद्यतनित करा' : 'Update'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
