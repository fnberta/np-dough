import { graphql } from 'gatsby';
import produce from 'immer';
import { DateTime } from 'luxon';
import React, { useMemo, useReducer } from 'react';
import DoughForm, { MAX_HOURS } from '../components/DoughForm';
import DoughRecipe, { YeastModel } from '../components/DoughRecipe';
import Layout from '../components/Layout';
import { IndexPageQuery, YeastModelCsvTemperature } from '../generatedGraphQL';

export interface Props {
  data: IndexPageQuery;
}

export enum TemperatureUnit {
  CELSIUS = 'CELSIUS',
  FAHRENHEIT = 'FAHRENHEIT',
}

export type DoughInputs = typeof initialDoughInput;

export interface DoughAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

const initialDoughInput = {
  count: 4,
  weight: 270,
  hydration: 65,
  saltPercentage: 3.2,
  temperature: {
    unit: TemperatureUnit.CELSIUS,
    value: 18,
  },
  hours: 24,
};

function getTemperature(data: YeastModelCsvTemperature, tempUnit: TemperatureUnit): number {
  switch (tempUnit) {
    case TemperatureUnit.CELSIUS:
      return data['celsius'];
    case TemperatureUnit.FAHRENHEIT:
      return data['fahrenheit'];
  }
}

function prepareYeastModels(
  { allYeastModelCsv }: IndexPageQuery,
  temperatureUnit: TemperatureUnit,
): Map<number, YeastModel[]> {
  const initial = new Map();
  if (!allYeastModelCsv) {
    return initial;
  }

  return allYeastModelCsv.edges
    .filter(edge => edge.node.hours !== -1)
    .reduce((acc, curr) => {
      const { hours, yeast } = curr.node;
      const temperature = getTemperature(curr.node.temperature, temperatureUnit);
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
}

function convertTemperature(newUnit: TemperatureUnit, value: number): number {
  switch (newUnit) {
    case TemperatureUnit.CELSIUS:
      return Math.round((value - 32) / 1.8);
    case TemperatureUnit.FAHRENHEIT:
      return Math.round(value * 1.8 + 32);
  }
}

function reducer(state: DoughInputs, action: DoughAction): DoughInputs {
  return produce(state, draft => {
    switch (action.type) {
      case 'setCount': {
        draft.count = action.payload;
        return;
      }
      case 'setWeight': {
        draft.weight = action.payload;
        return;
      }
      case 'setHydration': {
        draft.hydration = action.payload;
        return;
      }
      case 'setSaltPercentage': {
        draft.saltPercentage = action.payload;
        return;
      }
      case 'setTemperatureUnit':
        draft.temperature.unit = action.payload;
        draft.temperature.value = convertTemperature(action.payload, state.temperature.value);
        return;
      case 'setTemperatureValue': {
        draft.temperature.value = action.payload;
        return;
      }
      case 'setDateTime': {
        const isoDate = action.payload;
        if (isoDate) {
          const pizzaTime = DateTime.fromISO(isoDate);
          const now = DateTime.local();
          const hours = pizzaTime.diff(now, 'hours').as('hours');
          if (hours >= 2 && hours <= MAX_HOURS) {
            draft.hours = Math.round(hours);
          }
        } else {
          draft.hours = initialDoughInput.hours;
        }

        return;
      }
      case 'setHours': {
        draft.hours = action.payload;
        return;
      }
      case 'reset':
        return initialDoughInput;
      default:
        return;
    }
  });
}

const IndexPage: React.FC<Props> = ({ data }) => {
  const [doughInputs, dispatch] = useReducer(reducer, initialDoughInput);
  const { unit } = doughInputs.temperature;
  const yeastModels = useMemo(() => prepareYeastModels(data, unit), [data, unit]);

  return (
    <Layout title="Home">
      <section className="section">
        <div className="container">
          <h1 className="title is-1 has-text-centered">Neapolitan Pizza Dough</h1>
          <h3 className="subtitle is-3 has-text-centered">Get your recipe!</h3>
          <div className="vertically-spaced">
            <DoughForm doughInputs={doughInputs} dispatch={dispatch} />
            <DoughRecipe doughInputs={doughInputs} yeastModels={yeastModels} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  fragment yeastModelFields on YeastModelCsv {
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
      edges {
        node {
          ...yeastModelFields
        }
      }
    }
  }
`;
