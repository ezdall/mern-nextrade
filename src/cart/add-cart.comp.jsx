import { useSelector, useDispatch } from 'react-redux';
// import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import AddCartIcon from '@material-ui/icons/AddShoppingCart';
import DisabledCartIcon from '@material-ui/icons/RemoveShoppingCart';

import { selectCartItems, addProd } from '../redux/cart.slice';

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
  // const cart3 = useSelector(selectCartItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classes = useStyles();

  const addToCart = () => {
    dispatch(addProd(item));
    navigate('/cart');
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
