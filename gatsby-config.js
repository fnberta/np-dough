module.exports = {
  siteMetadata: {
    title: 'Neapolitan Pizza Dough',
    description: 'Make great neapolitan pizza dough!',
    author: 'Fabio Berta',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: 'gatsby-transformer-csv',
      options: {
        checkType: true,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Neapolitan Pizza Dough',
        short_name: 'NP Dough',
        start_url: '/',
        background_color: 'red',
        theme_color: 'red',
        display: 'standalone',
        icon: 'src/images/icon-512x512.png',
      },
    },
    'gatsby-plugin-offline',
  ],
};
