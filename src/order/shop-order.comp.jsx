import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

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
import OrderEdit from './order-edit.comp';
import { listByShop } from './api-order';

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
  const { shopId, shop } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  // const auth = useSelector(state => state.auth);

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listByShop({
      signal,
      shopId,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (!data?.isAxiosError) {
        setOrders(data);
      } else {
        console.log({ error: data.response?.data?.error });
        if (data.response.status === 401) navigate('/');
      }
    });

    return () => {
      console.log('abort shop order');
      abortController.abort();
    };
  }, [axiosPrivate, shopId, navigate]);

  const updateOrders = (index, updatedOrder) => {
    const updatedOrders = orders;

    updatedOrders[index] = updatedOrder;
    setOrders([...updatedOrders]);
  };

  // console.log({ shopOrreder: orders });

  const handleToggle = prodIndex => {
    if (open.includes(prodIndex)) {
      const openCopy = open.filter(el => el !== prodIndex);

      setOpen(openCopy);
    } else {
      const openCopy = [...open, prodIndex];
      setOpen(openCopy);
    }
  };

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Orders in {shop}
        </Typography>
        {!!orders?.length && (
          <List dense>
            {orders.map((order, index) => {
              return (
                <span key={order._id}>
                  <ListItem button onClick={() => handleToggle(index)}>
                    <ListItemText
                      primary={`Order # ${order._id}`}
                      secondary={new Date(order.createdAt).toDateString()}
                    />
                    {open.includes(index) ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Divider />
                  <Collapse
                    component="li"
                    in={open.includes(index)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <OrderEdit
                      shopId={shopId}
                      order={order}
                      orderIndex={index}
                      updateOrders={updateOrders}
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
        )}
      </Paper>
    </div>
  );
}
