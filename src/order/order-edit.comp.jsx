import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

import useAxiosPrivate from '../auth/useAxiosPrivate';
import {
  getStatusValues,
  update,
  cancelOrder,
  processCharge
} from './api-order';

import { BASE_URL } from '../axios';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: 0
  },
  listImg: {
    width: '70px',
    verticalAlign: 'top',
    marginRight: '10px'
  },
  listDetails: {
    display: 'inline-block'
  },
  listQty: {
    margin: 0,
    fontSize: '0.9em',
    color: '#5f7c8b'
  },
  textField: {
    width: '160px',
    marginRight: '16px'
  },
  statusMessage: {
    position: 'absolute',
    zIndex: '12',
    right: '5px',
    padding: '5px'
  }
}));

export default function ProductOrderEdit({
  updateOrders,
  shopId,
  order,
  orderIndex
}) {
  const classes = useStyles();

  const axiosPrivate = useAxiosPrivate();
  const auth = useSelector(state => state.auth);

  // const [open, setOpen] = useState(0);
  const [statusList, setStatusList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    getStatusValues({ signal }).then(data => {
      if (!data?.isAxiosError) {
        setError('');
        setStatusList(data);
      } else {
        console.log({ errOrdEdit: data?.response?.data });
        setError('Could not get status');
      }
    });

    return () => {
      abortController.abort();
      console.log('abort order-edit');
    };
  }, []);

  const handleStatusChange = (event, prodIndex, prodId) => {
    const { value } = event.target;

    // const updatedProducts = order.products.map((prod, index) => {
    //   if (index === prodIndex) {
    //     return { ...prod, status: value };
    //   }
    //   return prod;
    // });
    // console.log({ up: updatedProducts });

    // eslint-disable-next-line no-param-reassign
    order.products[prodIndex].status = value;
    const product = order.products[prodIndex];

    // const product = updatedProducts[prodIndex]; // pure
    // const updatedOrder = { ...order, products: updatedProducts };

    // console.log({ up: updatedOrder });

    const commonParams = {
      shopId,
      axiosPrivate2: axiosPrivate,
      product: {
        cartItemId: product._id,
        status: value
      }
    };

    let action;

    if (value === 'Cancelled') {
      action = cancelOrder({
        ...commonParams,
        productId: product.product._id,
        product: {
          ...commonParams.product,
          quantity: product.quantity // prod? or orderQty?
        }
      });
    } else if (value === 'Processing') {
      action = processCharge({
        ...commonParams,
        orderId: order._id,
        userId: auth.user._id,
        product: {
          ...commonParams.product,
          amount: product.quantity * product.product.price
        }
      });
    } else {
      action = update(commonParams);
    }

    action.then(data => {
      if (data?.isAxiosError) {
        console.log({ error: data?.response?.data });
        setError(data.response?.data?.error);
      } else {
        updateOrders(orderIndex, order);
        setError('');
      }
    });

    // if (value === 'Cancelled') {
    //   // console.log('cancelled order');
    //   // updateOrders(orderIndex, order);

    //   cancelOrder({
    //     shopId,
    //     axiosPrivate,
    //     productId: product.product._id,
    //     accessToken2: auth.accessToken,
    //     product: {
    //       cartItemId: product._id,
    //       status: value,
    //       quantity: product.quantity
    //     }
    //   }).then(data => {
    //     if (data?.isAxiosError) {
    //       console.log({ errorOrdEdit: data.response.data });
    //       setError(data.response.data.error);
    //       // setError('Status not updated, try again')
    //     } else {
    //       updateOrders(orderIndex, order);
    //       setError('');
    //     }
    //   });
    // } else if (value === 'Processing') {
    //   // console.log('processing order');
    //   // updateOrders(orderIndex, order);

    //   processCharge({
    //     shopId,
    //     axiosPrivate,
    //     orderId: order._id,
    //     userId: auth.user._id,
    //     accessToken2: auth.accessToken,
    //     product: {
    //       cartItemId: product._id,
    //       status: value,
    //       amount: product.quantity * product.product.price
    //     }
    //   }).then(data => {
    //     if (data?.isAxiosError) {
    //       console.log({ errorOrdEdit: data.response.data });
    //       setError(data.response.data.error);
    //       // setError('Status not updated, try again')
    //     } else {
    //       updateOrders(orderIndex, order);
    //       setError('');
    //     }
    //   });
    // } else {
    //   update({
    //     shopId,
    //     axiosPrivate2: axiosPrivate,
    //     accessToken2: auth.accessToken,
    //     product: {
    //       cartItemId: product._id,
    //       status: value
    //     }
    //   }).then(data => {
    //     if (data?.isAxiosError) {
    //       console.log({ error: data?.response.data });
    //       setError(data?.response.data.error);
    //       // setError('Status not updated, try again')
    //     } else {
    //       console.log(orderIndex, order);
    //       updateOrders(orderIndex, order);
    //       setError('');
    //     }
    //   });
    // }
  };

  // console.log({ list1: order.products.map(s => s.product) });

  return (
    <div>
      <Typography
        component="span"
        color="error"
        className={classes.statusMessage}
      >
        {error}
      </Typography>
      <List disablePadding style={{ backgroundColor: '#f8f8f8' }}>
        {!!order?.products?.length &&
          order.products.map((item, index) => {
            return (
              <span key={item._id}>
                {item.shop === shopId && (
                  <ListItem button className={classes.nested}>
                    <ListItemText
                      primary={
                        <div>
                          <img
                            className={classes.listImg}
                            src={`${BASE_URL}/api/product/image/${item.product._id}`}
                            alt="product"
                          />
                          <div className={classes.listDetails}>
                            {item.product?.name}
                            <p
                              className={classes.listQty}
                            >{`Quantity: ${item.quantity}`}</p>
                          </div>
                        </div>
                      }
                    />
                    <TextField
                      // has is this?
                      error={!!error && !!statusList.length && !!item.status}
                      id="select-status"
                      select
                      label="Update Status"
                      className={classes.textField}
                      value={statusList.length ? item.status : ''}
                      onChange={e => handleStatusChange(e, index, item._id)}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu
                        }
                      }}
                      margin="normal"
                    >
                      {statusList.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </ListItem>
                )}
                <Divider style={{ margin: 'auto', width: '80%' }} />
              </span>
            );
          })}
      </List>
    </div>
  );
}

ProductOrderEdit.propTypes = {
  shopId: PropTypes.string.isRequired,
  orderIndex: PropTypes.number.isRequired,
  updateOrders: PropTypes.func.isRequired,

  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,

    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        product: PropTypes.shape({
          _id: PropTypes.string,
          name: PropTypes.string,
          price: PropTypes.number
        })
      })
    )
  }).isRequired
};
