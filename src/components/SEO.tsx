import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';

export type Meta = JSX.IntrinsicElements['meta'];

export interface Props {
  title: string;
  lang?: string;
  meta?: Meta[];
  keywords?: string[];
}

interface QueryData {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: string;
    };
  };
}

const METADATA_QUERY = graphql`
  query MetadataQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

function getMeta(meta: Meta[], keywords: string[], { title, description, author }: QueryData['site']['siteMetadata']): Meta[] {
  const list: Meta[] = [
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:creator',
      content: author,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
  ];

  if (keywords.length > 0) {
    list.push({
      name: 'keywords',
      content: keywords.join(', '),
    });
  }

  return list.concat(meta);
}

const SEO: React.FC<Props> = ({ title, lang = 'de-CH', meta = [], keywords = [] }) => {
  const { site } = useStaticQuery<QueryData>(METADATA_QUERY);
  return (
    <Helmet
      titleTemplate={`%s | ${site.siteMetadata.title}`} meta={getMeta(meta, keywords, site.siteMetadata)}
    >
      <html lang={lang} />
      <title>{title}</title>
    </Helmet>
  );
};

export default SEO;
