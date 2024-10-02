import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import { Switch, FormControlLabel } from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';

import { resetAuth } from '../redux/auth.slice';
import { logout } from '../auth/api-auth';
import useDataContext from '../auth/useDataContext';

const isActive = (location, path) => {
  if (location.pathname === path) return { color: '#bef67a' };

  return { color: '#ffffff' };
};

const isPartActive = (location, path) => {
  if (location.pathname.includes(path)) return { color: '#bef67a' };

  return { color: '#ffffff' };
};

export default function Menu() {
  const { user } = useSelector(state => state.auth);
  const { cart, clearCart } = useDataContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // check if you need to Persist route the menu
  // console.log({ user, cart });

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Market
        </Typography>
        <div>
          <NavLink to="/">
            <IconButton aria-label="Home" style={isActive(location, '/')}>
              <HomeIcon />
            </IconButton>
          </NavLink>

          <NavLink to="/users">
            <Button style={isActive(location, '/users')}>Users</Button>
          </NavLink>

          <NavLink to="/shops/all">
            <Button style={isActive(location, '/shops/all')}>Shops</Button>
          </NavLink>

          <NavLink to="/cart">
            <Button style={isActive(location, '/cart')}>
              Cart
              <Badge
                invisible={false}
                overlap="rectangular"
                color="secondary"
                badgeContent={cart?.length}
                style={{ marginLeft: '7px' }}
              >
                <CartIcon />
              </Badge>
            </Button>
          </NavLink>
        </div>

        <div style={{ position: 'absolute', right: '10px' }}>
          <span style={{ float: 'right' }}>
            {!user && (
              <span>
                <NavLink to="/login" state={{ from1: location.pathname }}>
                  <Button style={isActive(location, '/login')}>Log In</Button>
                </NavLink>
                <NavLink to="/signup">
                  <Button style={isActive(location, '/signup')}>Sign up</Button>
                </NavLink>
              </span>
            )}
            {user && (
              <span>
                {user?.seller && (
                  <NavLink to="/seller/shops">
                    <Button style={isPartActive(location, '/seller')}>
                      My Shops
                    </Button>
                  </NavLink>
                )}
                <NavLink to={`/user/${user?._id}`}>
                  <Button style={isActive(location, `/user/${user._id}`)}>
                    My Profile
                  </Button>
                </NavLink>
                <Button
                  color="inherit"
                  onClick={() => {
                    logout({
                      // clear auth, cart (localStorage)
                      clearCart,
                      dispatchResetAuth: () => dispatch(resetAuth()),
                      navigateHome: () => navigate('/users', { replace: true })
                    });
                  }}
                >
                  Log Out
                </Button>
              </span>
            )}
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
}
