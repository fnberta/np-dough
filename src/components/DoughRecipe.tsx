import React from 'react';
import { DoughInputs } from '../pages';

export interface YeastModel {
  temperature: number;
  yeast: {
    idy: number;
    cy: number;
    ady: number;
  };
  hours: number;
}

export interface Props {
  doughInputs: DoughInputs;
  yeastModels: Map<number, YeastModel[]>;
}

function formatNumber(value: number, digits: number = 0): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

const DoughRecipe: React.FC<Props> = ({ doughInputs, yeastModels }) => {
  const { count, weight, hydration, saltPercentage, temperature, hours } = doughInputs;

  const totalWeight = count * weight;
  const flour = totalWeight / (1 + hydration / 100 + saltPercentage / 100);
  const water = flour * (hydration / 100);
  const salt = flour * (saltPercentage / 100);

  const [, modelsForTemperature] = Array.from(yeastModels.entries()).reduce((acc, curr) =>
    Math.abs(temperature.value - curr[0]) < Math.abs(temperature.value - acc[0]) ? curr : acc,
  );
  const yeastModel = modelsForTemperature.reduce((acc, curr) =>
    Math.abs(hours - curr.hours) < Math.abs(hours - acc.hours) ? curr : acc,
  );

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
                <span className="title is-5">{`${formatNumber(flour * (yeastModel.yeast.cy / 100), 3)}g`}</span>
                {' fresh / '}
                <span className="title is-5">{`${formatNumber(flour * (yeastModel.yeast.idy / 100), 3)}g`}</span>
                {' instant dry / '}
                <span className="title is-5">{`${formatNumber(flour * (yeastModel.yeast.ady / 100), 3)}g`}</span>
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
