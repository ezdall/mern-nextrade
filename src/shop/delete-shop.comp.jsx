import { useState } from 'react';
// import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { removeShop } from './api-shop';
import { handleAxiosError } from '../axios';
import useDataContext from '../auth/useDataContext';
import useAxiosPrivate from '../auth/useAxiosPrivate';

export default function DeleteShop(props) {
  const { shop, onRemoveShop } = props;
  const { auth: auth2 } = useDataContext();
  const axiosPrivate = useAxiosPrivate();

  const [open, setOpen] = useState(false);

  const clickButton = () => {
    setOpen(true);
  };

  const deleteShop = () => {
    removeShop({
      shopId: shop._id,
      accessToken2: auth2.accessToken,
      axiosPrivate
    }).then(data => {
      if (data?.isAxiosError) {
        console.log(data.response.data.error);
        return handleAxiosError(data);
      }
      setOpen(false);

      return onRemoveShop(shop);
    });
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{`Delete ${shop.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your shop {shop.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteShop} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

// DeleteShop.propTypes = {
//   shop: PropTypes.object.isRequired,
//   onRemove: PropTypes.func.isRequired
// }
