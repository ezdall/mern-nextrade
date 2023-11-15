import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import Icon from '@material-ui/core/Icon';

import { list } from './api-product';
import Products from './products.comp';
import { handleAxiosError } from '../axios';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper
  },
  gridList: {
    flexWrap: 'nowrap',
    width: '100%',
    transform: 'translateZ(0)'
  },
  tileTitle: {
    verticalAlign: 'middle',
    lineHeight: 2.5,
    textAlign: 'center',
    fontSize: '1.35em',
    margin: '0 4px 0 0'
  },
  card: {
    margin: 'auto',
    marginTop: 20
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    backgroundColor: '#80808024',
    fontSize: '1.1em'
  },
  icon: {
    verticalAlign: 'sub',
    color: '#738272',
    fontSize: '0.9em'
  },
  link: {
    color: '#4d6538',
    textShadow: '0px 2px 12px #ffffff',
    cursor: 'pointer'
  }
}));

export default function Categories(props) {
  const { categories } = props;
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(categories[0]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    list(
      {
        category: categories[0]
      },
      signal
    ).then(data => {
      if (data.isAxiosError) {
        console.log(data.message);
        return handleAxiosError(data);
      }
      return setProducts(data);
    });

    return () => {
      console.log('abort cat-list');
      abortController.abort();
    };
  }, [categories]);

  const listbyCategory = category => {
    setSelected(category);

    list({
      category
    }).then(data => {
      if (data.isAxiosError) {
        console.log(data.message);
        return handleAxiosError(data);
      }
      return setProducts(data);
    });
  };
  console.log({ categories });

  return (
    <div>
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          Explore by category
        </Typography>
        <div className={classes.root}>
          <ImageList className={classes.gridList} cols={4}>
            {categories.length &&
              categories.map(tile => (
                <ImageListItem
                  key={tile}
                  className={classes.tileTitle}
                  style={{
                    height: '64px',
                    backgroundColor:
                      selected === tile
                        ? 'rgba(95, 139, 137, 0.56)'
                        : 'rgba(95, 124, 139, 0.32)'
                  }}
                >
                  <span
                    className={classes.link}
                    role="link"
                    tabIndex="-1"
                    onClick={() => listbyCategory(tile)}
                  >
                    {tile}
                    <Icon className={classes.icon}>
                      {selected === tile && 'arrow_drop_down'}
                    </Icon>
                  </span>
                </ImageListItem>
              ))}
          </ImageList>
        </div>
        <Divider />
        <Products products={products} searched={false} />
      </Card>
    </div>
  );
}
// Categories.propTypes = {
//   categories: PropTypes.array.isRequired
// }
