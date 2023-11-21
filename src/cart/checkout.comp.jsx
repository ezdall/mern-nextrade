import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import PlaceOrder from './place-order.comp';
import auth from '../auth/auth-helper';
import cart from './cart-helper';

const useStyles = makeStyles(theme => ({
  card: {
    margin: '24px 0px',
    padding: '16px 40px 90px 40px',
    backgroundColor: '#80808017'
  },
  title: {
    margin: '24px 16px 8px 0px',
    color: theme.palette.openTitle
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.87)',
    marginTop: '20px'
  },
  addressField: {
    marginTop: '4px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '45%'
  },
  streetField: {
    marginTop: '4px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '93%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%'
  }
}));

export default function Checkout() {
  const classes = useStyles();

  const { user } = auth.isAuthenticated();

  const [values, setValues] = useState({
    checkoutDetails: {
      // replace this
      products: cart.getCart(),
      customer_name: user.name,
      customer_email: user.email,
      delivery_address: {
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: ''
      }
    }
  });

  const [error, setError] = useState('')

  const handleCustomerChange = event => {
    const { value, name } = event.target;
    const { checkoutDetails } = values;

    setError('')

    checkoutDetails[name] = value;
    setValues({ ...values, checkoutDetails });
  };

  const handleAddressChange = event => {
    const { value, name } = event.target;
    const { checkoutDetails } = values; // || undefined

    setError('')

    // mutating
    checkoutDetails.delivery_address[name] = value; // || undefined
    setValues({ ...values, checkoutDetails });
  };

  const handleError = ev => {
    // console.log({ ev });
    setError('valid fields are required!')
  };

  return (
    <Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Checkout
      </Typography>
      <TextField
        error={!!error}
        id="name"
        label="Name"
        className={classes.textField}
        value={values.checkoutDetails.customer_name}
        name="customer_name"
        onChange={handleCustomerChange}
        margin="normal"
      />
      <br />
      <TextField
        error={!!error}
        id="email"
        type="email"
        label="Email"
        className={classes.textField}
        value={values.checkoutDetails.customer_email}
        name="customer_email"
        onChange={handleCustomerChange}
        margin="normal"
      />
      <br />
      <Typography
        type="subheading"
        component="h3"
        className={classes.subheading}
      >
        Delivery Address
      </Typography>
      <TextField
        autoFocus
        error={!!error}
        id="street"
        label="Street Address"
        className={classes.streetField}
        value={values.checkoutDetails.delivery_address.street}
        name="street"
        onChange={handleAddressChange}
        margin="normal"
      />
      <br />
      <TextField
        error={!!error}
        id="city"
        label="City"
        className={classes.addressField}
        value={values.checkoutDetails.delivery_address.city}
        name="city"
        onChange={handleAddressChange}
        margin="normal"
      />
      <TextField
        id="state"
        label="State"
        className={classes.addressField}
        value={values.checkoutDetails.delivery_address.state}
        name="state"
        onChange={handleAddressChange}
        margin="normal"
      />
      <br />
      <TextField
        error={!!error}
        id="zipcode"
        label="Zip Code"
        className={classes.addressField}
        value={values.checkoutDetails.delivery_address.zipcode}
        name="zipcode"
        onChange={handleAddressChange}
        margin="normal"
      />
      <TextField
        error={!!error}
        id="country"
        label="Country"
        className={classes.addressField}
        value={values.checkoutDetails.delivery_address.country}
        name="country"
        onChange={handleAddressChange}
        margin="normal"
      />
      <br />
      {error && (
        <Typography component="p" color="error">
          <Icon color="error" className={classes.error}>
            error
          </Icon>
          {error}
        </Typography>
      )}
      <div>
        <PlaceOrder
          onError={handleError}
          checkoutDetails={values.checkoutDetails}
        />
      </div>
    </Card>
  );
}
