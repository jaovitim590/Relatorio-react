import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import { matchPath, useLocation } from 'react-router';
import DashboardSidebarContext from '../../../context/DashboardSidebarContext';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from './constants';
import DashboardSidebarPageItem from './DashboardSidebarPageItem';
import DashboardSidebarHeaderItem from './DashboardSidebarHeaderItem';
import DashboardSidebarDividerItem from './DashboardSidebarDividerItem';
import {
  getDrawerSxTransitionMixin,
  getDrawerWidthTransitionMixin,
} from '../../../../mixins';

export interface DashboardSidebarProps {
  expanded?: boolean;
  setExpanded: (expanded: boolean) => void;
  disableCollapsibleSidebar?: boolean;
  container?: Element;
}

export default function DashboardSidebar({
  expanded = true,
  setExpanded,
  disableCollapsibleSidebar = false,
  container,
}: DashboardSidebarProps) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const [expandedItemIds, setExpandedItemIds] = React.useState<string[]>([]);
  const isOverSmViewport = useMediaQuery(theme.breakpoints.up('sm'));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));
  const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

  React.useEffect(() => {
    if (expanded) {
      const timeout = setTimeout(() => setIsFullyExpanded(true), theme.transitions.duration.enteringScreen);
      return () => clearTimeout(timeout);
    }
    setIsFullyExpanded(false);
  }, [expanded, theme.transitions.duration.enteringScreen]);

  React.useEffect(() => {
    if (!expanded) {
      const timeout = setTimeout(() => setIsFullyCollapsed(true), theme.transitions.duration.leavingScreen);
      return () => clearTimeout(timeout);
    }
    setIsFullyCollapsed(false);
  }, [expanded, theme.transitions.duration.leavingScreen]);

  const mini = !disableCollapsibleSidebar && !expanded;

  const handleSetSidebarExpanded = React.useCallback(
    (newExpanded: boolean) => () => setExpanded(newExpanded),
    [setExpanded]
  );

  const handlePageItemClick = React.useCallback(
    (itemId: string, hasNestedNavigation: boolean) => {
      if (hasNestedNavigation && !mini) {
        setExpandedItemIds(prev =>
          prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
      } else if (!isOverSmViewport && !hasNestedNavigation) {
        setExpanded(false);
      }
    },
    [mini, setExpanded, isOverSmViewport]
  );

  const hasDrawerTransitions = isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const getDrawerContent = React.useCallback(
    (viewport: 'phone' | 'tablet' | 'desktop') => (
      <>
        <Toolbar />
        <Box
          component="nav"
          aria-label={`${viewport.charAt(0).toUpperCase() + viewport.slice(1)}`}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'auto',
            scrollbarGutter: mini ? 'stable' : 'auto',
            overflowX: 'hidden',
            pt: !mini ? 0 : 2,
            ...(hasDrawerTransitions ? getDrawerSxTransitionMixin(isFullyExpanded, 'padding') : {}),
          }}
        >
          <List
  dense
  sx={{
    padding: mini ? 0 : 0.5,
    mb: 4,
    width: mini ? MINI_DRAWER_WIDTH : 'auto',
  }}
>
  {/* Alunos */}
  <DashboardSidebarPageItem
    id="alunos"
    title="Alunos"
    icon={<PersonIcon />}
    href="/dashboard/alunos"
    selected={!!matchPath('/dashboard/alunos/*', pathname) || pathname === '/dashboard/alunos'}
  />

  {/* Relatórios */}
  <DashboardSidebarPageItem
    id="relatorios"
    title="Relatórios"
    icon={<BarChartIcon />}
    href="/dashboard/relatorios"
    selected={!!matchPath('/dashboard/relatorios/*', pathname) || pathname === '/dashboard/relatorios'}
  />
</List>
        </Box>
      </>
    ),
    [mini, hasDrawerTransitions, isFullyExpanded, expandedItemIds, pathname]
  );

  const getDrawerSharedSx = React.useCallback(
    (isTemporary: boolean) => {
      const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;
      return {
        displayPrint: 'none',
        width: drawerWidth,
        flexShrink: 0,
        ...getDrawerWidthTransitionMixin(expanded),
        ...(isTemporary ? { position: 'absolute' } : {}),
        '& .MuiDrawer-paper': {
          position: 'absolute',
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundImage: 'none',
          ...getDrawerWidthTransitionMixin(expanded),
        },
      };
    },
    [expanded, mini]
  );

  const sidebarContextValue = React.useMemo(() => ({
    onPageItemClick: handlePageItemClick,
    mini,
    fullyExpanded: isFullyExpanded,
    fullyCollapsed: isFullyCollapsed,
    hasDrawerTransitions,
  }), [handlePageItemClick, mini, isFullyExpanded, isFullyCollapsed, hasDrawerTransitions]);

  return (
    <DashboardSidebarContext.Provider value={sidebarContextValue}>
      {/* Drawer Mobile */}
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={handleSetSidebarExpanded(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: disableCollapsibleSidebar ? 'block' : 'none', md: 'none' },
          ...getDrawerSharedSx(true),
        }}
      >
        {getDrawerContent('phone')}
      </Drawer>

      {/* Drawer Tablet */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: disableCollapsibleSidebar ? 'none' : 'block', md: 'none' },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent('tablet')}
      </Drawer>

      {/* Drawer Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent('desktop')}
      </Drawer>
    </DashboardSidebarContext.Provider>
  );
}
