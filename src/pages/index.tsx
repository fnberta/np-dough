import { graphql } from 'gatsby';
import React, { useMemo, useReducer } from 'react';
import DoughForm from '../components/DoughForm';
import DoughRecipe from '../components/DoughRecipe';
import Layout from '../components/Layout';
import { DoughFormState, initialState, reducer } from '../doughFormState';
import { IndexPageQuery } from '../generatedGraphQL';
import { DoughInputs, TemperatureUnit, YeastModel } from '../recipe';

export interface Props {
  data: IndexPageQuery;
}

function parseDoughInputs({ values, errors }: DoughFormState): DoughInputs {
  if (Object.values(errors).some(value => value === true)) {
    return { valid: false };
  }

  const { count, weight, hydration, saltPercentage, temperature, hours } = values;
  return {
    valid: true,
    count: +count,
    weight: +weight,
    hydration: +hydration,
    saltPercentage: +saltPercentage,
    temperature: {
      unit: temperature.unit,
      value: +temperature.value,
    },
    hours: +hours,
  };
}

function prepareYeastModels(
  { allYeastModelCsv }: IndexPageQuery,
  temperatureUnit: TemperatureUnit,
): Map<number, YeastModel[]> {
  const initial = new Map<number, YeastModel[]>();
  if (!allYeastModelCsv) {
    return initial;
  }

  const models = allYeastModelCsv.nodes
    .filter(node => node.hours !== -1)
    .reduce((acc, curr) => {
      const { hours, yeast } = curr;
      const temperature = curr.temperature[temperatureUnit];
      const yeastModel: YeastModel = {
        temperature,
        hours,
        yeast,
      };

      const existing = acc.get(temperature);
      if (!existing) {
        acc.set(temperature, [yeastModel]);
      } else {
        existing.push(yeastModel);
      }

      return acc;
    }, initial);
  models.forEach(entry => {
    entry.sort((a, b) => a.hours - b.hours);
  });

  return models;
}

const IndexPage: React.FC<Props> = ({ data }) => {
  const [doughFormState, dispatch] = useReducer(reducer, initialState);
  const { unit } = doughFormState.values.temperature;
  const yeastModels = useMemo(() => prepareYeastModels(data, unit as TemperatureUnit), [data, unit]);
  const doughInputs = parseDoughInputs(doughFormState);

  return (
    <Layout title="Home">
      <div className="section">
        <div className="container">
          <h1 className="title is-1 has-text-centered">Neapolitan Pizza Dough</h1>
          <h3 className="subtitle is-3 has-text-centered">Get your recipe!</h3>
          <div className="vertically-spaced">
            <DoughForm formState={doughFormState} dispatch={dispatch} />
            {doughInputs.valid && <DoughRecipe doughInputs={doughInputs} yeastModels={yeastModels} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  fragment yeastModel on YeastModelCsv {
    temperature {
      celsius
      fahrenheit
    }
    yeast {
      idy
      cy
      ady
    }
    hours
  }

  query IndexPage {
    allYeastModelCsv {
      nodes {
        ...yeastModel
      }
    }
  }
`;
