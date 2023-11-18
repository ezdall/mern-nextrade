import { useState } from 'react';
// import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import auth from '../auth/auth-helper';
import cart from './cart-helper';

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

const authUser = auth.isAuthenticated().user;

export default function PlaceOrder(props) {
  const { checkoutDetails, onError } = props;

  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation()

  console.log({location})
  // console.log({ stripe, elements });

  const classes = useStyles();
  const [values, setValues] = useState({
    order: {},
    error: '',
    orderId: '',
    redirect: false
  });

  const placeOrder = event => {

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
      // return setValues({ ...values, error: 'lack of info' });
    }

    if (!elements || !stripe) {
      return setValues({ ...values, error: 'no stripe yet' });
    }

    return stripe
      .createToken(elements.getElement(CardElement))
      .then(payload => {
        console.log({payload})

        if (payload.error) {
          setValues({ ...values, error: payload.error.message });
        } else {

         createOrder(
            { userId: authUser._id },
            checkoutDetails,
            payload.token.id
          ).then(data => {
            if (data?.isAxiosError) {
              handleAxiosError(data);
            return setValues({ ...values, error: data.message });
            } 
            return cart.emptyCart(() => {
              setValues({ ...values, orderId: data._id, redirect: true });
            });
          });

        }
      });
  };

  if(values.redirect){
    return <Navigate to={`/order/${values.orderId}`} />
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
        {values.error && (
          <Typography component="span" color="error" className={classes.error}>
            <Icon color="error" className={classes.errorIcon}>
              error
            </Icon>
            {values.error}
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
