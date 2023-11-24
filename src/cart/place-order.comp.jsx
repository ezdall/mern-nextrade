import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import useDataContext from '../auth/useDataContext';
import useAxiosPrivate from '../auth/useAxiosPrivate';
import { emptyCart } from '../redux/cart.slice';
import { createOrder } from '../order/api-order';
import { handleAxiosError } from '../axios';

const useStyles = makeStyles(() => ({
  subheading: {
    color: 'rgba(88, 114, 128, 0.87)',
    marginTop: '20px'
  },
  checkout: {
    float: 'right',
    margin: '20px 30px'
  },
  error: {
    display: 'inline',
    padding: '0px 10px'
  },
  errorIcon: {
    verticalAlign: 'middle'
  },
  StripeElement: {
    display: 'block',
    margin: '24px 0 10px 10px',
    maxWidth: '408px',
    padding: '10px 14px',
    boxShadow:
      'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
    borderRadius: '4px',
    background: 'white'
  }
}));

export default function PlaceOrder(props) {
  const { checkoutDetails, onError } = props;
  const { user: authUser, accessToken } = useDataContext().auth;
  const axiosPrivate = useAxiosPrivate();

  // const {user: authUser} = useSelector(state => state.auth3)
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  console.log({ authUser });
  // console.log({ stripe, elements });

  const classes = useStyles();
  const [values, setValues] = useState({
    order: {},
    orderId: ''
  });
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  const placeOrder = () => {
    const {
      products,
      customer_name,
      customer_email,
      delivery_address
    } = checkoutDetails;

    const { street, city, zipcode, country } = delivery_address;

    if (
      !Array.isArray(products) ||
      !customer_name ||
      !customer_email ||
      !street ||
      !city ||
      !zipcode ||
      !country
    ) {
      return onError();
    }

    if (!elements || !stripe) {
      return setError('no stripe yet');
    }

    return stripe
      .createToken(elements.getElement(CardElement))
      .then(payload => {
        console.log({ payload });

        if (payload.error) {
          setError(payload.error.message);
        } else {
          createOrder({
            axiosPrivate,
            userId: authUser._id,
            order: checkoutDetails,
            token: payload.token.id,
            accessToken2: accessToken
          }).then(data => {
            if (data?.isAxiosError) {
              handleAxiosError(data);
              return setError(data.response.data.error);
            }

            setValues({ ...values, orderId: data._id });
            dispatch(emptyCart());
            return setRedirect(true);
          });
        }
      });
  };

  if (redirect) {
    return <Navigate to={`/order/${values.orderId}`} />;
  }

  return (
    <span>
      <Typography
        type="subheading"
        component="h3"
        className={classes.subheading}
      >
        Card details
      </Typography>
      <CardElement
        className={classes.StripeElement}
        {...{
          style: {
            base: {
              color: '#424770',
              letterSpacing: '0.025em',
              fontFamily: 'Source Code Pro, Menlo, monospace',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#9e2146'
            }
          }
        }}
      />
      <div className={classes.checkout}>
        {error && (
          <Typography component="span" color="error" className={classes.error}>
            <Icon color="error" className={classes.errorIcon}>
              error
            </Icon>
            {error}
          </Typography>
        )}
        <Button
          disabled={!stripe || !elements}
          color="secondary"
          variant="contained"
          onClick={placeOrder}
        >
          Place Order
        </Button>
      </div>
    </span>
  );
}
// PlaceOrder.propTypes = {
//   checkoutDetails: PropTypes.object.isRequired
// }
