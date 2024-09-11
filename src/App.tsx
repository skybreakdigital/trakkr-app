import { useEffect, useState } from 'react'
// import { routes } from './Routes';
import { HashRouter as Router, RouterProvider, Routes, Route } from 'react-router-dom';
import { CommanderProvider } from './context/Commander';
import './App.scss'
import SplashPage from './pages/SplashPage';
import Layout from './Layout';
import MissionPage from './pages/MissionPage';
import SharePage from './pages/SharePage';
import SettingPage from './pages/SettingPage';

type Callback = (event: any, ...args: any[]) => void;

// Extend the Window interface with electron object
declare global {
  interface Window {
    electron: {
      setState: (data: any) => Promise<any>,
      getState: () => Promise<any>,
      getMissionDetails: () => Promise<any[]>,
      on: (channel: string, callback: Callback) => void,
      removeListener: (channel: string, callback: Callback) => void
    }
  }
}

function App() {
  return (
    <div className="App">
      <CommanderProvider>
        {/* <RouterProvider router={routes} /> */}
        <Router>
          <Routes>
            <>
              <Route path="/" element={<SplashPage />} />
              <Route path="main" element={<Layout />}>
                <Route path="missions" element={<MissionPage />} />
                <Route path="shares" element={<SharePage />} />
                <Route path="settings" element={<SettingPage />} />
              </Route>
            </>
          </Routes>
        </Router>
      </CommanderProvider>
    </div>
  );
}

export default App
