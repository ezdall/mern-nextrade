import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { BASE_URL } from '../axios';
import { list } from './api-shop';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle,
    textAlign: 'center',
    fontSize: '1.2em'
  },
  avatar: {
    width: 100,
    height: 100
  },
  subheading: {
    color: theme.palette.text.secondary
  },
  shopTitle: {
    fontSize: '1.2em',
    marginBottom: '5px'
  },
  details: {
    padding: '24px'
  }
}));

export default function Shops() {
  const classes = useStyles();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    list({ signal }).then(data => {
      if (!data?.isAxiosError) {
        return isMounted && setShops(data);
      }
      return console.error(data?.response?.data);
    });
    // .catch(err => console.error(err));

    return () => {
      isMounted = false;
      if (isMounted) abortController.abort();
      console.log('abort shop-lists');
    };
  }, []);

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          All Shops
        </Typography>
        <List dense>
          {shops?.map(shop => {
            return (
              <Link to={`/shops/${shop._id}`} key={shop._id}>
                <Divider />
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar
                      className={classes.avatar}
                      src={`${BASE_URL}/api/shops/logo/${
                        shop._id
                      }?${new Date().getTime()}`}
                    />
                  </ListItemAvatar>
                  <div className={classes.details}>
                    <Typography
                      type="headline"
                      component="h2"
                      color="primary"
                      className={classes.shopTitle}
                    >
                      {shop.name}
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h4"
                      className={classes.subheading}
                    >
                      {shop.description}
                    </Typography>
                  </div>
                </ListItem>
                <Divider />
              </Link>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
