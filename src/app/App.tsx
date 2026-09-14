import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers';
import { router } from './router';
import { Toaster } from 'react-hot-toast';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
