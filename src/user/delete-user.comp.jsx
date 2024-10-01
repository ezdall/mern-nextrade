import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import useAxiosPrivate from '../auth/useAxiosPrivate';
import { removeUser } from './api-user';

export default function DeleteUser({ userId }) {
  // const auth = useSelector(state => state.auth);
  const axiosPrivate = useAxiosPrivate();

  const [open, setOpen] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const clickButton = () => {
    setOpen(true);
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  const deleteAccount = () => {
    removeUser({
      userId,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (!data?.isAxiosError) {
        return setRedirectHome(true);
      }
      console.log({ errDelUsr: data.response?.data?.error });
      return handleRequestClose();
    });
  };

  if (redirectHome) {
    return <Navigate to="/users" replace />;
  }

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton}>
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

DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
};
