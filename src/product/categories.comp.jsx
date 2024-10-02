import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import Icon from '@material-ui/core/Icon';

import { list } from './api-product';
import Products from './products.comp';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // overflow: 'hidden',
    background: theme.palette.background.paper
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    columnGap: 2,
    width: '100%',
    transform: 'translateZ(0)'
    // overflow: 'hidden'
  },
  tileTitle: {
    verticalAlign: 'middle',
    lineHeight: 2.5,
    textAlign: 'center',
    fontSize: '1.35em',
    cursor: 'pointer'
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

function Categories({ categories }) {
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    // let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    list({
      category: selectedCategory,
      signal
    }).then(data => {
      // if not error, setProduct
      if (!data?.isAxiosError) {
        console.log('fetch');
        return setProducts(data);
      }
      return console.error(data?.response?.data);
    });
    // .catch(err => console.log(err));

    return () => {
      // isMounted = false;
      abortController.abort();
      console.log('abort @categories-list');
    };
  }, [selectedCategory]);

  const handleCategoryClick = category => {
    // if selected category is not the former, then set new
    if (selectedCategory !== category) {
      setSelectedCategory(category);
    }
  };

  return (
    <div>
      <Card className={classes.card}>
        <Typography variant="h6" className={classes.title}>
          Explore by Category
        </Typography>
        <div className={classes.root}>
          <ImageList className={classes.gridList} cols={5} rowHeight="auto">
            {categories?.map(category => (
              <ImageListItem
                key={category}
                className={`${classes.tileTitle} ${selectedCategory ===
                  category && classes.activeTile}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
                <span className={classes.link}>
                  {category}
                  <Icon className={classes.icon}>
                    {selectedCategory === category && 'arrow_drop_down'}
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

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

// MemoCategories
export default memo(Categories);
