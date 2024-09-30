import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Search from '../product/search.comp';
import Categories from '../product/categories.comp';
import Suggestions from '../product/suggestions.comp';
import { listLatest, listCategories } from '../product/api-product';

// import { handleAxiosError } from '../axios';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: 30
  }
}));

export default function Home() {
  const classes = useStyles();

  const [suggestionTitle, setSuggestionTitle] = useState('Latest Products');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // console.log(categories)
  // console.log(suggestions)

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    listLatest({ signal }).then(data => {
      if (data?.isAxiosError) {
        return console.log({ errHomeLatest: data });
        // return handleAxiosError(data);
      }

      return isMounted && setSuggestions(data);
    });

    return () => {
      isMounted = false;
      if (isMounted) abortController.abort();
      console.log('abort home suggest');
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    listCategories({ signal }).then(data => {
      console.log({ data });
      if (data?.isAxiosError) {
        return console.log({ errHomeCat: data });
      }
      return isMounted && setCategories(data);
    });

    return () => {
      isMounted = false;
      if (isMounted) abortController.abort();
      console.log('abort home category');
    };
  }, []);

  // add error

  if (!categories?.length || !suggestions?.length) return <p>Loading...</p>;

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={8}>
          <Search categories={categories} />
          <Categories categories={categories} />
        </Grid>
        <Grid item xs={4} sm={4}>
          <Suggestions products={suggestions} title={suggestionTitle} />
        </Grid>
      </Grid>
    </div>
  );
}
