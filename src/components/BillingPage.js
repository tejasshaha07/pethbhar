import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import BillingSection from './BillingSection';
import InventorySection from './InventorySection';

export default function BillingPage({ user, onLogout }) {
  const [useMarathi, setUseMarathi] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('Billing'); // Track selected menu

  return (
    <div>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          {/* Title */}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {useMarathi ? 'रेस्टॉरंट बिलिंग सिस्टीम' : 'Restaurant Billing System'}
          </Typography>

          {/* Role-Based Menus */}
          <Button
            color="inherit"
            onClick={() => setSelectedMenu('Billing')}
            style={{ marginRight: '10px' }}
          >
            {useMarathi ? 'बिलिंग' : 'Billing'}
          </Button>

          {(user.role === 'admin' || user.role === 'owner') && (
            <Button
              color="inherit"
              onClick={() => setSelectedMenu('Inventory')}
              style={{ marginRight: '10px' }}
            >
              {useMarathi ? 'इन्व्हेंटरी' : 'Inventory'}
            </Button>
          )}

          {user.role === 'owner' && (
            <Button
              color="inherit"
              onClick={() => alert('Reports Section Coming Soon!')}
              style={{ marginRight: '10px' }}
            >
              {useMarathi ? 'अहवाल' : 'Reports'}
            </Button>
          )}

          {/* Language Toggle */}
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

          {/* Logout */}
          <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
            {useMarathi ? 'बाहेर पडा' : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content Section */}
      <Container maxWidth={false} style={{ marginTop: '2rem', width: '95%' }}>
        {selectedMenu === 'Billing' && <BillingSection useMarathi={useMarathi} />}
        {selectedMenu === 'Inventory' && <InventorySection useMarathi={useMarathi} />}
      </Container>
      
      {/* Media Queries */}
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
        }

        @media (max-width: 600px) {
          .MuiContainer-root {
            padding-left: 8px;
            padding-right: 8px;
          }
          .MuiButton-root {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 960px) {
          .MuiButton-root {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
