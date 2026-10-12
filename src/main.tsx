import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { MimiProvider } from './context/MimiContext';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ProjectProvider>
        <MimiProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </MimiProvider>
      </ProjectProvider>
    </AuthProvider>
  </React.StrictMode>
);
