import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import useDataContext from '../auth/useDataContext';
import useAxiosPrivate from '../auth/useAxiosPrivate';
import { createOrder } from '../order/api-order';

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

export default function PlaceOrder({ checkoutDetails, onError }) {
  const classes = useStyles();

  // const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useSelector(state => state.auth);
  const { clearCart } = useDataContext();

  // console.log({ stripe });

  const [values, setValues] = useState({
    order: {},
    orderId: ''
  });
  const [error, setError] = useState('');
  // const [redirect, setRedirect] = useState(false);

  const placeOrder = async () => {
    try {
      const {
        products,
        customer_name,
        customer_email,
        delivery_address: { street, city, zipcode, country }
      } = checkoutDetails;

      // const { street, city, zipcode, country } = delivery_address;

      // validate input data
      if (
        !Array.isArray(products) ||
        !customer_name ||
        !customer_email ||
        !street ||
        !city ||
        !zipcode ||
        !country
      ) {
        return onError(); // invalid checkout details
      }

      // check for stripe & elements
      if (!elements || !stripe) return setError('Stripe is not available');

      console.log({ stripe, elements });

      // create token using CardElement
      const payload = await stripe.createToken(
        elements.getElement(CardElement)
      );

      console.log({ payload });

      if (payload.error) {
        return setError(error.message);
      }

      const orderResult = await createOrder({
        axiosPrivate2: axiosPrivate,
        userId: user._id,
        order: checkoutDetails,
        token: payload.token.id
      });

      console.log({ orderResult });

      if (!orderResult?.isAxiosError) {
        // update order id, then empty cart
        // setValues(prev => ({ ...prev, orderId: orderResult._id }));
        setValues({ ...values, orderId: orderResult._id });

        clearCart();
        return navigate(`/order/${orderResult._id}`);
      }

      // handle error if order creating failed
      return setError(orderResult?.response?.data?.error);
    } catch (err) {
      console.error('Error placing order:', err.message);
      return setError(error);
      // Handle the error (e.g., show an error message to the user)
    }

    // return stripe
    //   .createToken(elements.getElement(CardElement))
    //   .then(payload => {
    //     console.log({ payload });

    //     if (payload.error) {
    //       setError(payload.error.message);
    //     } else {
    //       createOrder({
    //         axiosPrivate,
    //         userId: user._id,
    //         order: checkoutDetails,
    //         token: payload.token.id,
    //         accessToken2: accessToken
    //       }).then(data => {
    //         if (data?.isAxiosError) {
    //           handleAxiosError(data);
    //           return setError(data.response.data.error);
    //         }
    //         setValues(prev => ({ ...prev, orderId: data._id }));
    //         dispatch(emptyCart());
    //         return setRedirect(true);
    //       });
    //     }
    //   });
  };

  // if (redirect && values?.orderId) {
  //   return <Navigate to={`/order/${values.orderId}`} />;
  // }

  // console.log({ checkoutDetails });

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

PlaceOrder.propTypes = {
  onError: PropTypes.func.isRequired,
  checkoutDetails: PropTypes.shape({
    products: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    customer_name: PropTypes.string.isRequired,
    customer_email: PropTypes.string.isRequired,
    delivery_address: PropTypes.shape({
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      zipcode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
