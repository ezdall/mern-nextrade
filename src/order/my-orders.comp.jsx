import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { listByUser } from './api-order';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: '12px 24px',
    padding: theme.spacing(3),
    backgroundColor: '#3f3f3f0d'
  },
  title: {
    margin: `${theme.spacing(2)}px 0 12px ${theme.spacing(1)}px`,
    color: theme.palette.openTitle
  }
}));

export default function MyOrders() {
  const classes = useStyles();
  const params = useParams();
  console.log({ params });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listByUser(
      {
        userId: params.userId // jwt.user._id
      },
      signal
    ).then(data => {
      if (data.isAxiosError) {
        console.log(data);
      } else {
        setOrders(data);
      }
    });
    return () => {
      console.log('abort my-order');
      abortController.abort();
    };
  }, [params.userId]);

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography type="title" className={classes.title}>
        Your Orders
      </Typography>
      <List dense>
        {orders.length &&
          orders.map(order => {
            return (
              <span key={order._id}>
                <Link to={`/order/${order._id}`}>
                  <ListItem button>
                    <ListItemText
                      primary={<strong>{`Order # ${order._id}`}</strong>}
                      secondary={new Date(order.createdAt).toDateString()}
                    />
                  </ListItem>
                </Link>
                <Divider />
              </span>
            );
          })}
      </List>
    </Paper>
  );
}