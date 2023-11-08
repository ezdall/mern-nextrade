import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';

// import auth from './../auth/auth-helper'

// import DeleteShop from './delete-shop.comp'

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

export default function NewShop() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [shops, setShops] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);

  console.log({ shops });

  // all you shop
  useEffect(() => {
    const abortController = new AbortController();

    listByOwner(
      {
        userId: '6361f1a2d0994e1db4a26ab2' // admin
      },
      [abortController.signal],
      {} // accessToken
    )
      .then(data => {
        // console.log({data}
        setShops(data);
      })
      .catch(err => setRedirectToSignin(true));

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const removeShop = () => {
    console.log('removeShop');
  };

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Shops
          <span className={classes.addButton}>
            <Link to="/seller/shop/new">
              <Button color="primary" variant="contained">
                {/* <Icon className={classes.leftIcon}>add_box</Icon> */} New
                Shop
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {shops.map(shop => {
            return (
              <span key={shop._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={`/api/shops/logo/${
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
                    {/* <DeleteShop shop={shop} onRemove={removeShop}/> */}
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </span>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
