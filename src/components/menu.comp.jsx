import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';

import auth from '../auth/auth-helper';
import cart from '../cart/cart-helper';

const isActive = (location, path) => {
  if (location.pathname === path) return { color: '#bef67a' };

  return { color: '#ffffff' };
};

const isPartActive = (location, path) => {
  if (location.pathname.includes(path)) return { color: '#bef67a' };

  return { color: '#ffffff' };
};

const isAuth = auth.isAuthenticated()

export default function Menu() {
  const location = useLocation();

  const [redirectHome, setRedirectHome] = useState(false)

  if(redirectHome){
    return <Navigate to='/' replace />
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Marketplace
        </Typography>
        <div>
          <Link to="/">
            <IconButton aria-label="Home" style={isActive(location, '/')}>
              <HomeIcon />
            </IconButton>
          </Link>
          <Link to="/shops/all">
            <Button style={isActive(location, '/shops/all')}>All Shops</Button>
          </Link>
          <Link to="/cart">
            <Button style={isActive(location, '/cart')}>
              Cart
              <Badge
                invisible={false}
                overlap="rectangular"
                color="secondary"
                badgeContent={cart.itemTotal()}
                style={{ marginLeft: '7px' }}
              >
                <CartIcon />
              </Badge>
            </Button>
          </Link>
        </div>
        <div style={{ position: 'absolute', right: '10px' }}>
          <span style={{ float: 'right' }}>
            {!isAuth && (
              <span>
                <Link to="/signup">
                  <Button style={isActive(location, '/signup')}>Sign up</Button>
                </Link>
                <Link to="/login">
                  <Button style={isActive(location, '/login')}>Log In</Button>
                </Link>
              </span>
            )}
            {isAuth && (
              <span>
                {isAuth.user.seller && (
                  <Link to="/seller/shops">
                    <Button style={isPartActive(location, '/seller')}>
                      My Shops
                    </Button>
                  </Link>
                )}
                <Link to={`/user/${isAuth.user._id}`}>
                  <Button
                    style={isActive(
                      location,
                      `/user/${isAuth.user._id}`
                    )}
                  >
                    My Profile
                  </Button>
                </Link>
                <Button
                  color="inherit"
                  onClick={() => {
                    auth.clearJWT(() => setRedirectHome(true));
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
