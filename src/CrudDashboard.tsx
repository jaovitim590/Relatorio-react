import CssBaseline from '@mui/material/CssBaseline';
import DashboardLayout from './assets/components/dash/DashboardLayout';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from './shared-theme/AppTheme';

import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/custumization';

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <DashboardLayout /> {/* ✅ já possui <Outlet /> para rotas filhas */}
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
