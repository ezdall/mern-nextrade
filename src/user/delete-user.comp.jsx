import { useState } from 'react';
import { Navigate } from 'react-router-dom';
// import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import auth from '../auth/auth-helper';
import { removeUser } from './api-user';
import { handleAxiosError } from '../axios';

export default function DeleteUser(props) {
  const { userId } = props;

  const [open, setOpen] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false)

  const clickButton = () => {
    setOpen(true);
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  const deleteAccount = () => {
    removeUser({
      userId
    }).then(data => {
      if (data?.isAxiosError) {
        // console.log(data.message)
        handleRequestClose();
        return handleAxiosError(data);
      }
      auth.clearJWT(() => console.log('deleted'));
      return setRedirectHome(true)
    });
  };

  if(redirectHome){
    return <Navigate to='/' replace />
  }

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

// DeleteUser.propTypes = {
//   userId: PropTypes.string.isRequired
// }
