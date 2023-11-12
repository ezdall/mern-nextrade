import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import CartItems from './cart-items.comp';
import Checkout from './checkout.comp';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE)

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: 30
  }
}));

export default function Cart() {
  const classes = useStyles();
  const [checkout, setCheckout] = useState(false);

  const showCheckout = val => {
    setCheckout(val);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <CartItems checkout={checkout} setCheckout={showCheckout} />
        </Grid>
        {checkout && (
          <Grid item xs={6} sm={6}>
          <Elements stripe={stripePromise}>
            <Checkout />
          </Elements>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
