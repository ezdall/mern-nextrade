import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';

import DeleteShop from './delete-shop.comp';
import { BASE_URL } from '../axios';
import useAxiosPrivate from '../auth/useAxiosPrivate';

import { listByOwner } from './api-shop';

// style
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton: {
    float: 'right'
  },
  leftIcon: {
    marginRight: '8px'
  }
}));

export default function MyShops() {
  const classes = useStyles();
  const axiosPrivate = useAxiosPrivate();

  const [shops, setShops] = useState([]);
  const { user } = useSelector(state => state.auth);
  const userId = user._id;

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    listByOwner({
      signal,
      userId,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (!data?.isAxiosError) {
        return isMounted && setShops(data);
      }
      return console.log({ errMyShop: data?.response?.data?.error });
    });

    return () => {
      isMounted = false;
      if (isMounted) abortController.abort();
      console.log('abort my-shops');
    };
  }, [axiosPrivate, userId]);

  const onRemoveShop = shop => {
    const filterShops = shops.filter(s => s._id !== shop._id);

    return setShops(filterShops);
  };

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Shops
          <span className={classes.addButton}>
            <Link to="/seller/shop/new">
              <Button color="primary" variant="contained">
                {/* <Icon className={classes.leftIcon}>add_box</Icon> */}
                New Shop
              </Button>
            </Link>
          </span>
        </Typography>
        {shops?.length ? (
          shops.map(shop => {
            return (
              <List key={shop._id} dense>
                <span>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        src={`${BASE_URL}/api/shops/logo/${
                          shop._id
                        }?${new Date().getTime()}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={shop.name}
                      secondary={shop.description}
                    />
                    <ListItemSecondaryAction>
                      <Link
                        to={`/seller/orders/${shop.name.replace(' ', '-')}/${
                          shop._id
                        }`}
                      >
                        <Button aria-label="Orders" color="primary">
                          View Orders
                        </Button>
                      </Link>
                      <Link to={`/seller/shop/edit/${shop._id}`}>
                        <IconButton aria-label="Edit" color="primary">
                          <Edit />
                        </IconButton>
                      </Link>
                      <DeleteShop shop={shop} onRemoveShop={onRemoveShop} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </span>
              </List>
            );
          })
        ) : (
          <p>No Shop</p>
        )}
      </Paper>
    </div>
  );
}
