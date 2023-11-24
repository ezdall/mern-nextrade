import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

import useAxiosPrivate from '../auth/useAxiosPrivate';
import useDataContext from '../auth/useDataContext';
import OrderEdit from './order-edit.comp';
import { listByShop } from './api-order';
import { handleAxiosError } from '../axios';

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
  subheading: {
    marginTop: theme.spacing(1),
    color: '#434b4e',
    fontSize: '1.1em'
  },
  customerDetails: {
    paddingLeft: '36px',
    paddingTop: '16px',
    backgroundColor: '#f8f8f8'
  }
}));

export default function ShopOrder() {
  const classes = useStyles();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useDataContext()
  // const auth = useSelector(state => state.auth3)

  console.log({auth})

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listByShop({
        shopId: params.shopId,
        accessToken2: auth.accessToken,
        axiosPrivate,
        signal
      })
      .then(data => {
      if (data.isAxiosError) {
        console.log({ error: data.response.data.error })
        handleAxiosError(data);
      } else {
        setOrders(data);
      }
    });
      
    return () => abortController.abort();
  }, [auth.accessToken, axiosPrivate, params.shopId]);

  const handleClick = orderId => {
    console.log({orderId})
    setOpen(orderId);
  };

  const updateOrders = (index, updatedOrder) => {
    const updatedOrders = orders;

    updatedOrders[index] = updatedOrder;
    setOrders([...updatedOrders]);
  };

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Orders in {params.shop}
        </Typography>
        <List dense>
          {orders.length && orders.map((order, index) => {
            return (
              <span key={order._id}>
                <ListItem button onClick={() => handleClick(index)}>
                  <ListItemText
                    primary={`Order # ${order._id}`}
                    secondary={new Date(order.createdAt).toDateString()}
                  />
                  {open !== index && <ExpandMore />}
                </ListItem>
                <Divider />
                <Collapse
                  component="li"
                  in={open === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <OrderEdit
                    shopId={params.shopId}
                    order={order}
                    orderIndex={index}
                    updateOrders={updateOrders}
                    axiosPrivate={axiosPrivate}
                    auth={auth}
                  />
                  <div className={classes.customerDetails}>
                    <Typography
                      type="subheading"
                      component="h3"
                      className={classes.subheading}
                    >
                      Deliver to:
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      <strong>{order.customer_name}</strong> (
                      {order.customer_email})
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      {order.delivery_address.street}
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      {order.delivery_address.city}, 
                      {order.delivery_address.state} 
                      {order.delivery_address.zipcode}
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h3"
                      color="primary"
                    >
                      {order.delivery_address.country}
                    </Typography>
                    <br />
                  </div>
                </Collapse>
                <Divider />
              </span>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
