import React from 'react';
import {
  Icon,
  Badge,
  Card,
  Button,
  IconButton,
  Drawer,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ThemeProvider, useTheme, makeStyles } from '@material-ui/core/styles';
import { getTimeDifference } from 'utils.js';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotification,
  deleteAllNotification,
  deleteNotification,
} from '../../redux/actions/NotificationActions';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  notification: {
    width: 'var(--sidenav-width)',
    '& .notification__topbar': {
      height: 'var(--topbar-height)',
    },
  },
  notificationCard: {
    '&:hover': {
      '& .delete-button': {
        cursor: 'pointer',
        display: 'unset',
        right: 0,
        marginTop: 6,
        top: 0,
        zIndex: 2,
      },
      '& .card__topbar__time': {
        display: 'none',
      },
    },
    '& .delete-button': {
      display: 'none',
      position: 'absolute',
      right: 0,
      marginTop: 9,
    },
    '& .card__topbar__button': {
      borderRadius: 15,
      opacity: 0.9,
    },
  },
}));

const NotificationBar = ({ container }) => {
  const [panelOpen, setPanelOpen] = React.useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { settings } = useSelector((state) => state.layout);
  const notifcationList = useSelector((state) => state.notifications);

  const handleDrawerToggle = () => {
    if (!panelOpen) {
      dispatch(getNotification());
    }
    setPanelOpen(!panelOpen);
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleClearNotification = () => {
    dispatch(deleteAllNotification());
  };

  const parentThemePalette = theme.palette;
  // console.log(parentThemePalette);
  return (
    <ThemeProvider theme={settings.themes[settings.activeTheme]}>
      <IconButton
        onClick={handleDrawerToggle}
        style={{
          color:
            parentThemePalette.type === 'light'
              ? parentThemePalette.text.secondary
              : parentThemePalette.text.primary,
        }}
      >
        <Badge color="secondary" badgeContent={5}>
          <Icon>notifications</Icon>
        </Badge>
      </IconButton>

      <Drawer
        width="100px"
        container={container}
        variant="temporary"
        anchor="right"
        open={panelOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className={classes.notification}>
          <div className="notification__topbar elevation-z6 flex items-center p-4 mb-4">
            <Icon color="primary">notifications</Icon>
            <h5 className="ml-2 my-0 font-medium">Notifications</h5>
          </div>

          {notifcationList.map((notification) => (
            <div
              key={notification.id}
              className={clsx('relative', classes.notificationCard)}
            >
              <IconButton
                size="small"
                className="delete-button bg-light-gray mr-6"
                onClick={() => handleDeleteNotification(notification.id)}
              >
                <Icon className="text-muted" fontSize="small">
                  clear
                </Icon>
              </IconButton>
              <Link to={`/${notification.path}`} onClick={handleDrawerToggle}>
                <Card className="mx-4 mb-6" elevation={3}>
                  <div className="card__topbar flex items-center justify-between p-2 bg-light-gray">
                    <div className="flex items-center">
                      <div className="card__topbar__button flex items-center justify-between h-24 w-24 overflow-hidden">
                        <Icon
                          className="card__topbar__icon"
                          fontSize="small"
                          color={notification.icon.color}
                        >
                          {notification.icon.name}
                        </Icon>
                      </div>
                      <span className="ml-4 font-medium text-muted">
                        {notification.heading}
                      </span>
                    </div>
                    <small className="card__topbar__time text-muted">
                      {getTimeDifference(new Date(notification.timestamp))}
                      {' '}
                      ago
                    </small>
                  </div>
                  <div className="px-4 pt-2 pb-4">
                    <p className="m-0">{notification.title}</p>
                    <small className="text-muted">
                      {notification.subtitle}
                    </small>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
          {!!notifcationList.length && (
            <div className="text-center">
              <Button onClick={handleClearNotification}>
                Clear Notifications
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </ThemeProvider>
  );
};

export default NotificationBar;
