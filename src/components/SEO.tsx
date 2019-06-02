import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { MetadataQuery, SiteSiteMetadata } from '../generatedGraphQL';

export type Meta = JSX.IntrinsicElements['meta'];

export interface Props {
  title: string;
  lang?: string;
  meta?: Meta[];
  keywords?: string[];
}

const METADATA_QUERY = graphql`
  query Metadata {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

function getMeta(meta: Meta[], keywords: string[], { title, description, author }: SiteSiteMetadata): Meta[] {
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
  const data = useStaticQuery<MetadataQuery>(METADATA_QUERY);
  const { siteMetadata } = data.site!; // we know it's defined
  return (
    <Helmet titleTemplate={`%s | ${siteMetadata.title}`} meta={getMeta(meta, keywords, siteMetadata)}>
      <html lang={lang} />
      <title>{title}</title>
    </Helmet>
  );
};

export default SEO;
