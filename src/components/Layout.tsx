import React from 'react';
import './layout.scss';
import SEO from './SEO';

export interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <SEO
      title={title}
      keywords={['pizza', 'neapolitan', 'dough', 'naples', 'calculator', 'yeast', "baker's percentage"]}
    />
    <main>{children}</main>
    <footer className="footer">
      <div className="container content has-text-centered">
        <p>
          {'Created by '}
          <a href="https://github.com/fnberta">Fabio Berta</a>
          {'. The source code is licensed '}
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>
          {'. Find it on '}
          <a href="https://github.com/fnberta">Github</a>
          {'.'}
        </p>
      </div>
    </footer>
  </>
);

export default Layout;
