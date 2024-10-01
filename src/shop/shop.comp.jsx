import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import { readShop } from './api-shop';
import { listByShop } from '../product/api-product';
import { BASE_URL } from '../axios';
import Products from '../product/products.comp';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30
  },
  card: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: theme.palette.openTitle
  },
  bigAvatar: {
    width: 100,
    height: 100,
    margin: 'auto'
  },
  productTitle: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      1
    )}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    width: '100%',
    fontSize: '1.2em'
  }
}));

export default function Shop() {
  const classes = useStyles();
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState({});
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    readShop({ shopId, signal }).then(data => {
      if (!data?.isAxiosError) {
        setError('');
        // return isMounted &&
        return setShop(data);
      }
      setError(data.response?.data?.error || 'default error');

      return (
        data.response?.status === 401 &&
        navigate('/shops/all', { replace: true })
      );
    });

    return () => {
      // isMounted = false
      // if (isMounted)
      abortController.abort();
      console.log('abort r shop/:id');
    };
  }, [shopId, navigate]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listByShop({
      shopId,
      signal
    }).then(data => {
      if (!data?.isAxiosError) {
        setError('');
        return setProducts(data);
      }
      return setError(data?.response?.data?.error);
    });
    // .catch(err => console.error(err));

    return () => {
      abortController.abort();
      console.log('abort shop/:id');
    };
  }, [shopId]);

  const logoUrl = shop._id
    ? `${BASE_URL}/api/shops/logo/${shop._id}?${new Date().getTime()}`
    : `${BASE_URL}/api/shops/defaultphoto`;

  if (error) return <p>Error...</p>;

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={4} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography
                type="headline"
                component="h2"
                className={classes.title}
              >
                {shop.name}
              </Typography>
              <br />
              <Avatar src={logoUrl} className={classes.bigAvatar} />
              <br />
              <Typography
                type="subheading"
                component="h2"
                className={classes.subheading}
              >
                {shop.description}
              </Typography>
              <br />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8} sm={8}>
          <Card>
            <Typography
              type="title"
              component="h2"
              className={classes.productTitle}
            >
              Products
            </Typography>
            <Products products={products} searched={false} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
