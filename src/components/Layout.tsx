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
        <div>
          {'Created by '}
          <a href="https://github.com/fnberta" target="_blank" rel="noopener noreferrer">
            Fabio Berta
          </a>
          {'. The source code is licensed '}
          <a href="http://opensource.org/licenses/mit-license.php" target="_blank" rel="noopener noreferrer">
            MIT
          </a>
          {'. Find it on '}
          <a href="https://github.com/fnberta/np-dough" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          {'.'}
        </div>
        <div>
          {'The yeast quantities are based on a model created by '}
          <a href="https://www.pizzamaking.com/forum/index.php?topic=26831.0" target="_blank" rel="noopener noreferrer">
            TXCraig1
          </a>
          {'.'}
        </div>
      </div>
    </footer>
  </>
);

export default Layout;
