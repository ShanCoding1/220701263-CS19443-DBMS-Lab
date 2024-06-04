import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { 
  HomeOutlined, Home, 
  EventNoteOutlined, EventNote, 
  PersonOutline, Person, 
  PeopleOutline, People, 
  BarChartOutlined, BarChart,
  SettingsOutlined, Settings, 
  HelpOutline, Help, 
  ExitToAppOutlined, ExitToApp
} from '@mui/icons-material';
import { styled } from '@mui/system';
import ConfirmationDialog from './ConfirmationDialog';

const SidebarContainer = styled('div')({
  height: '100vh',
  width: '16rem',
  backgroundColor: '#FFFFFF',
  padding: '1rem',
  paddingTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  fontFamily: 'Inter, sans-serif',
  color: '#343A40',
  position: 'fixed',
  overflowY: 'auto',
});

const SidebarItem = styled(ListItem)(({ selected }) => ({
  backgroundColor: selected ? '#000000 !important' : 'transparent',
  borderRadius: '0.5rem',
  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
    color: selected ? '#FFFFFF !important' : '#343A40',
  },
}));

const Sidebar = () => {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState(router.pathname);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedPath(router.pathname);
  }, [router.pathname]);

  const handleNavigation = (path) => {
    router.push(path);
    setSelectedPath(path);
  };

  const getIcon = (path, outlinedIcon, filledIcon) => {
    return selectedPath === path ? filledIcon : outlinedIcon;
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    router.push('/LoginPage');
  };

  const handleLogoutClose = () => {
    setLogoutDialogOpen(false);
  };

  const renderSidebarItem = (path, label, outlinedIcon, filledIcon) => (
    <SidebarItem button selected={selectedPath === path} onClick={() => handleNavigation(path)}>
      <ListItemIcon>
        {getIcon(path, outlinedIcon, filledIcon)}
      </ListItemIcon>
      <ListItemText primary={label} />
    </SidebarItem>
  );

  return (
    <SidebarContainer>
      <div className="text-center">
        <Typography variant="h6" style={{ color: '#007BFF', marginBottom: '1rem' }}>
          Hospital Management System
        </Typography>
      </div>
      <List>
        {renderSidebarItem('/Dashboard', 'Dashboard', <HomeOutlined />, <Home />)}
        {renderSidebarItem('/AppointmentScheduling', 'Appointments', <EventNoteOutlined />, <EventNote />)}
        {renderSidebarItem('/Patient', 'Patients', <PersonOutline />, <Person />)}
        {renderSidebarItem('/Staff', 'Staff', <PeopleOutline />, <People />)}
        {renderSidebarItem('/analytics', 'Analytics', <BarChartOutlined />, <BarChart />)}
      </List>
      <Divider />
      <List>
        {renderSidebarItem('/settings', 'Settings', <SettingsOutlined />, <Settings />)}
        {renderSidebarItem('/help', 'Help', <HelpOutline />, <Help />)}
        <SidebarItem button selected={selectedPath === '/logout'} onClick={handleLogoutClick}>
          <ListItemIcon>
            {getIcon('/logout', <ExitToAppOutlined />, <ExitToApp />)}
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </SidebarItem>
      </List>
      <ConfirmationDialog
        open={logoutDialogOpen}
        onClose={handleLogoutClose}
        onConfirm={handleLogoutConfirm}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
