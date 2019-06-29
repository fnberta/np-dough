import { graphql } from 'gatsby';
import produce from 'immer';
import { DateTime } from 'luxon';
import React, { Reducer, useMemo, useReducer } from 'react';
import DoughForm, { MAX_HOURS, MIN_HOURS } from '../components/DoughForm';
import DoughRecipe from '../components/DoughRecipe';
import Layout from '../components/Layout';
import { IndexPageQuery } from '../generatedGraphQL';
import { DoughInput, initialFormState, parseDoughFormState, TemperatureUnit, YeastModel } from '../recipe';

export interface Props {
  data: IndexPageQuery;
}

type DeepNumberToString<T> = {
  [K in keyof T]: T[K] extends number ? string : DeepNumberToString<T[K]>;
};

export type DoughFormState = DeepNumberToString<DoughInput>;

export type DoughAction =
  | {
      type: 'COUNT';
      payload: {
        count: string;
      };
    }
  | {
      type: 'WEIGHT';
      payload: {
        weight: string;
      };
    }
  | {
      type: 'HYDRATION';
      payload: {
        hydration: string;
      };
    }
  | {
      type: 'SALT_PERCENTAGE';
      payload: {
        percentage: string;
      };
    }
  | {
      type: 'TEMPERATURE_UNIT';
      payload: {
        unit: TemperatureUnit;
      };
    }
  | {
      type: 'TEMPERATURE_VALUE';
      payload: {
        temperature: string;
      };
    }
  | {
      type: 'DATE_TIME';
      payload: {
        isoDate?: string;
      };
    }
  | {
      type: 'HOURS';
      payload: {
        hours: string;
      };
    }
  | {
      type: 'RESET';
    };

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

function convertTemperature(newUnit: TemperatureUnit, value: number): number {
  switch (newUnit) {
    case 'celsius':
      return Math.round((value - 32) / 1.8);
    case 'fahrenheit':
      return Math.round(value * 1.8 + 32);
  }
}

const reducer: Reducer<DoughFormState, DoughAction> = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'COUNT': {
        draft.count = action.payload.count;
        return;
      }
      case 'WEIGHT': {
        draft.weight = action.payload.weight;
        return;
      }
      case 'HYDRATION': {
        draft.hydration = action.payload.hydration;
        return;
      }
      case 'SALT_PERCENTAGE': {
        draft.saltPercentage = action.payload.percentage;
        return;
      }
      case 'TEMPERATURE_UNIT': {
        const { unit } = action.payload;
        draft.temperature.unit = unit;
        draft.temperature.value = convertTemperature(unit, +state.temperature.value).toString();
        return;
      }
      case 'TEMPERATURE_VALUE': {
        draft.temperature.value = action.payload.temperature;
        return;
      }
      case 'DATE_TIME': {
        const { isoDate } = action.payload;
        if (isoDate) {
          const pizzaTime = DateTime.fromISO(isoDate).set({ minute: 0 });
          const now = DateTime.local().set({ minute: 0 });
          const hours = Math.round(pizzaTime.diff(now, 'hours').as('hours'));
          if (hours >= MIN_HOURS && hours <= MAX_HOURS) {
            draft.hours = hours.toString();
          } else {
          }
        } else {
          draft.hours = initialFormState.hours;
        }

        return;
      }
      case 'HOURS': {
        draft.hours = action.payload.hours;
        return;
      }
      case 'RESET':
        return initialFormState;
      default:
        return;
    }
  });

const IndexPage: React.FC<Props> = ({ data }) => {
  const [doughFormState, dispatch] = useReducer(reducer, initialFormState);
  const { unit } = doughFormState.temperature;
  const yeastModels = useMemo(() => prepareYeastModels(data, unit), [data, unit]);

  return (
    <Layout title="Home">
      <section className="section">
        <div className="container">
          <header>
            <h1 className="title is-1 has-text-centered">Neapolitan Pizza Dough</h1>
            <h3 className="subtitle is-3 has-text-centered">Get your recipe!</h3>
          </header>
          <div className="vertically-spaced">
            <DoughForm formState={doughFormState} dispatch={dispatch} />
            <DoughRecipe doughInputs={parseDoughFormState(doughFormState)} yeastModels={yeastModels} />
          </div>
        </div>
      </section>
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
