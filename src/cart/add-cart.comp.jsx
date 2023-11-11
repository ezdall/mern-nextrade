import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

// import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton';
import AddCartIcon from '@material-ui/icons/AddShoppingCart';
import DisabledCartIcon from '@material-ui/icons/RemoveShoppingCart';

import cart from './cart-helper';

const useStyles = makeStyles(() => ({
  iconButton: {
    width: '28px',
    height: '28px'
  },
  disabledIconButton: {
    color: '#7f7563',
    width: '28px',
    height: '28px'
  }
}));

export default function AddToCart(props) {
  const { item, cartStyle } = props;
  const navigate = useNavigate();

  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  const addToCart = () => {
    cart.addItem(item, () => {
      // setRedirect({redirect:true})
      navigate('/cart');
    });
  };

  return (
    <span>
      {item.quantity >= 0 ? (
        <IconButton color="secondary" dense="dense" onClick={addToCart}>
          <AddCartIcon className={cartStyle || classes.iconButton} />
        </IconButton>
      ) : (
        <IconButton disabled color="secondary" dense="dense">
          <DisabledCartIcon
            className={cartStyle || classes.disabledIconButton}
          />
        </IconButton>
      )}
    </span>
  );
}

// AddToCart.propTypes = {
//   item: PropTypes.object.isRequired,
//   cartStyle: PropTypes.string
// }
