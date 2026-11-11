import {HashRouter, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {ToastViewport} from '@astryxdesign/core/Toast';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {AppProvider, useApp} from './state';
import {Shell} from './components/Shell';
import {Overview} from './pages/Overview';
import {RiskProfile} from './pages/RiskProfile';
import {PolicyHub} from './pages/PolicyHub';
import {Coverage} from './pages/Coverage';
import {Simulator} from './pages/Simulator';
import {Learn} from './pages/Learn';
import {Shop} from './pages/Shop';
import {Onboarding} from './pages/Onboarding';

function ScrollTop() {
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo({top: 0});
  }, [pathname]);
  return null;
}

function Themed({children}: {children: React.ReactNode}) {
  const {theme} = useApp();
  return (
    <Theme theme={neutralTheme} mode={theme}>
      {children}
      <ToastViewport position="bottomEnd" />
    </Theme>
  );
}

function Gate({children}: {children: React.ReactNode}) {
  const {onboarded} = useApp();
  return onboarded ? <>{children}</> : <Navigate to="/start" replace />;
}

export function App() {
  return (
    <AppProvider>
      <Themed>
        <HashRouter>
          <ScrollTop />
          <Routes>
            <Route path="/start" element={<Onboarding />} />
            <Route
              element={
                <Gate>
                  <Shell />
                </Gate>
              }>
              <Route index element={<Overview />} />
              <Route path="risk" element={<RiskProfile />} />
              <Route path="risk/:cat" element={<RiskProfile />} />
              <Route path="policies" element={<PolicyHub />} />
              <Route path="policies/:id" element={<PolicyHub />} />
              <Route path="coverage" element={<Coverage />} />
              <Route path="simulator" element={<Simulator />} />
              <Route path="simulator/:id" element={<Simulator />} />
              <Route path="shop" element={<Shop />} />
              <Route path="shop/:product" element={<Shop />} />
              <Route path="learn" element={<Learn />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </Themed>
    </AppProvider>
  );
}
