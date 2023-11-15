import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

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

import { listByShop } from './api-order';
import ProductOrderEdit from './order-edit.comp';
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
  const navigate = useNavigate();

  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listByShop(
      {
        shopId: params.shopId
      },
      signal
    ).then(data => {
      if (data.isAxiosError) {
        // console.log(data)
        handleAxiosError(
          data,
          navigate('/login', { replace: true, state: { from: location } })
        );
      } else {
        setOrders(data);
      }
    });
    return () => abortController.abort();
  }, [location, navigate, params.shopId]);

  const handleClick = index => () => {
    setOpen(index);
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
          {orders.map((order, index) => {
            return (
              <span key={order._id}>
                <ListItem button onClick={handleClick(index)}>
                  <ListItemText
                    primary={`Order # ${order._id}`}
                    secondary={new Date(order.createdAt).toDateString()}
                  />
                  {open === index ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Divider />
                <Collapse
                  component="li"
                  in={open === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <ProductOrderEdit
                    shopId={params.shopId}
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
                      {order.delivery_address.city},{' '}
                      {order.delivery_address.state}{' '}
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
