import React from 'react';
import { getDoughRecipe, ValidDoughInputs, YeastModel } from '../recipe';

export interface Props {
  doughInputs: ValidDoughInputs;
  // yeast models keyed by temperature
  yeastModels: Map<number, YeastModel[]>;
}

function formatNumber(value: number, digits: number = 0): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

const DoughRecipe: React.FC<Props> = ({ doughInputs, yeastModels }) => {
  const { flour, water, salt, yeast } = getDoughRecipe(yeastModels, doughInputs);
  return (
    <div className="card">
      <div className="card-content">
        <h4 className="title is-4 has-text-centered">Your custom dough recipe</h4>
        <div className="columns">
          <div className="column has-text-centered">
            <div>
              <p className="heading">Flour</p>
              <p className="title is-5">{`${formatNumber(flour)}g`}</p>
            </div>
          </div>
          <div className="column has-text-centered">
            <div>
              <p className="heading">Water</p>
              <p className="title is-5">{`${formatNumber(water)}ml`}</p>
            </div>
          </div>
          <div className="column has-text-centered">
            <div>
              <p className="heading">Salt</p>
              <p className="title is-5">{`${formatNumber(salt, 1)}g`}</p>
            </div>
          </div>
          <div className="column has-text-centered">
            <div>
              <p className="heading">Yeast</p>
              <p>
                <span className="title is-5">{`${formatNumber(yeast.cy, 3)}g`}</span>
                {' fresh / '}
                <span className="title is-5">{`${formatNumber(yeast.idy, 3)}g`}</span>
                {' instant dry / '}
                <span className="title is-5">{`${formatNumber(yeast.ady, 3)}g`}</span>
                {' active dry'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoughRecipe;
