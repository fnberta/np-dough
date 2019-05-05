exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SiteSiteMetadata {
      title: String!
      description: String!
      author: String!
    }
    
    type Site implements Node {
      siteMetadata: SiteSiteMetadata!
    }
  
    type YeastModelCsvTemperature implements Node {
      celsius: Float!
      fahrenheit: Int!
    }
    
    type YeastModelCsvYeast implements Node {
      ady: Float!
      idy: Float!
      cy: Float!
    }
  
    type YeastModelCsv implements Node {
      temperature: YeastModelCsvTemperature!
      yeast: YeastModelCsvYeast!
      hours: Int!
    }
  `;
  createTypes(typeDefs);
};
