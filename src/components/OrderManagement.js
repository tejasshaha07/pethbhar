import React, { useState } from 'react';
import Login from './Login';
import BillingPage from './BillingPage';

export default function OrderManagement() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <BillingPage />;
}