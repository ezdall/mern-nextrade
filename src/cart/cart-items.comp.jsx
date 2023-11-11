import { useState } from 'react';
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import cart from './cart-helper';
import auth from '../auth/auth-helper';

const useStyles = makeStyles(theme => ({
  card: {
    margin: '24px 0px',
    padding: '16px 40px 60px 40px',
    backgroundColor: '#80808017'
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: '1.2em'
  },
  price: {
    color: theme.palette.text.secondary,
    display: 'inline'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 0,
    width: 50
  },
  productTitle: {
    fontSize: '1.15em',
    marginBottom: '5px'
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.67)',
    padding: '8px 10px 0',
    cursor: 'pointer',
    display: 'inline-block'
  },
  cart: {
    width: '100%',
    display: 'inline-flex'
  },
  details: {
    display: 'inline-block',
    width: '100%',
    padding: '4px'
  },
  content: {
    flex: '1 0 auto',
    padding: '16px 8px 0px'
  },
  cover: {
    width: 160,
    height: 125,
    margin: '8px'
  },
  itemTotal: {
    float: 'right',
    marginRight: '40px',
    fontSize: '1.5em',
    color: 'rgb(72, 175, 148)'
  },
  checkout: {
    float: 'right',
    margin: '24px'
  },
  total: {
    fontSize: '1.2em',
    color: 'rgb(53, 97, 85)',
    marginRight: '16px',
    fontWeight: '600',
    verticalAlign: 'bottom'
  },
  continueBtn: {
    marginLeft: '10px'
  },
  itemShop: {
    display: 'block',
    fontSize: '0.90em',
    color: '#78948f'
  },
  removeButton: {
    fontSize: '0.8em'
  }
}));

export default function CartItems(props) {
  const { checkout, setCheckout } = props;

  const classes = useStyles();
  const [cartItems, setCartItems] = useState(cart.getCart());

  // console.log(cartItems)

  const handleChange = (i,prodId) => event => {
    const { value } = event.target;
    console.log('handleChange')

    const updatedCartItems = cartItems.map(item => {
      if(item._id === prodId){
        if(value === 0){
          return {...item, quantity: 1}
        }
        return {...item, quantity: Number(value) }
      }
      return item
    })

    // if (value === 0) {
    //   updatedCartItems[i].quantity = 1;
    // } else {
    //   updatedCartItems[i].quantity = value;
    // }

    setCartItems(updatedCartItems)

    // setCartItems([...updatedCartItems]);

    cart.updateCart(prodId, Number(value) );

  };

  const getTotal = () => {
    return cartItems.reduce((a, b) => {
      return a + b.quantity * b.product.price;
    }, 0);
  };

  const removeItem = (index, prodId) => ev => {
    const updatedCartItems = cart.removeItem(index, prodId);

    if (updatedCartItems.length === 0) {
      setCheckout(false);
    }
    setCartItems(updatedCartItems);
  };

  const openCheckout = () => {
    setCheckout(true);
  };

  return (
    <Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Shopping Cart
      </Typography>
      {cartItems.length ? (
        <span>
          {cartItems.map((item, i) => {
            return (
              <span key={item.product._id}>
                <Card className={classes.cart}>
                  <CardMedia
                    className={classes.cover}
                    image={`/api/product/image/${item.product._id}`}
                    title={item.product.name}
                  />
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Link to={`/product/${item.product._id}`}>
                        <Typography
                          type="title"
                          component="h3"
                          className={classes.productTitle}
                          color="primary"
                        >
                          {item.product.name}
                        </Typography>
                      </Link>
                      <div>
                        <Typography
                          type="subheading"
                          component="h3"
                          className={classes.price}
                          color="primary"
                        >
                          $ {item.product.price}
                        </Typography>
                        <span className={classes.itemTotal}>
                          ${item.product.price * item.quantity}
                        </span>
                        <span className={classes.itemShop}>
                          Shop: {item.product.shop.name}
                        </span>
                      </div>
                    </CardContent>
                    <div className={classes.subheading}>
                      Quantity: 
                      <TextField
                        value={item.quantity}
                        onChange={handleChange(i,item.product._id)}
                        type="number"
                        inputProps={{
                          min: 1
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                      />
                      <Button
                        className={classes.removeButton}
                        color="primary"
                        onClick={removeItem(i,item.product._id)}
                      >
                        x Remove
                      </Button>
                    </div>
                  </div>
                </Card>
                <Divider />
              </span>
            );
          })}
          <div className={classes.checkout}>
            <span className={classes.total}>Total: ${getTotal()}</span>
            {!checkout &&
              (auth.isAuthenticated() ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={openCheckout}
                >
                  Checkout
                </Button>
              ) : (
                <Link to="/login">
                  <Button color="primary" variant="contained">
                    Sign in to checkout
                  </Button>
                </Link>
              ))}
            <Link to="/" className={classes.continueBtn}>
              <Button variant="contained">Continue Shopping</Button>
            </Link>
          </div>
        </span>
      ) : (
        <Typography variant="subtitle1" component="h3" color="primary">
          No items added to your cart.
        </Typography>
      )}
    </Card>
  );
}

// CartItems.propTypes = {
//   checkout: PropTypes.bool.isRequired,
//   setCheckout: PropTypes.func.isRequired
// }
