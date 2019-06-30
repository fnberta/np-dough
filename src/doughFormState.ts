import produce from 'immer';
import { DateTime } from 'luxon';
import { Reducer } from 'react';
import { TemperatureUnit } from './recipe';

export interface DoughFormState {
  values: {
    count: string;
    weight: string;
    hydration: string;
    saltPercentage: string;
    temperature: {
      unit: TemperatureUnit;
      value: string;
    };
    hours: string;
  };
  errors: Record<keyof DoughFormState['values'], boolean>;
}

export type DoughAction =
  | { type: 'COUNT'; count: string }
  | { type: 'WEIGHT'; weight: string }
  | { type: 'HYDRATION'; hydration: string }
  | { type: 'SALT_PERCENTAGE'; percentage: string }
  | { type: 'TEMPERATURE_UNIT'; unit: string }
  | { type: 'TEMPERATURE_VALUE'; temperature: string }
  | { type: 'DATE_TIME'; isoDate: string | undefined }
  | { type: 'HOURS'; hours: string }
  | { type: 'RESET' };

export const MIN_HOURS = 2;
export const MAX_HOURS = 167;

export const initialState: DoughFormState = {
  values: {
    count: '4',
    weight: '270',
    hydration: '65',
    saltPercentage: '3.2',
    temperature: {
      unit: 'celsius',
      value: '23',
    },
    hours: '24',
  },
  errors: {
    count: false,
    weight: false,
    hydration: false,
    saltPercentage: false,
    temperature: false,
    hours: false,
  },
};

export function getTempRange(unit: TemperatureUnit): [number, number] {
  switch (unit) {
    case 'celsius':
      return [1, 35];
    case 'fahrenheit':
      return [35, 95];
  }
}

function convertTemperature(newUnit: TemperatureUnit, value: number): number {
  switch (newUnit) {
    case 'celsius':
      return Math.round((value - 32) / 1.8);
    case 'fahrenheit':
      return Math.round(value * 1.8 + 32);
  }
}

function isInRange([min, max]: [number, number], value: number): boolean {
  return value >= min && value <= max;
}

export const reducer: Reducer<DoughFormState, DoughAction> = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'RESET':
        return initialState;
      case 'COUNT': {
        const { count } = action;
        draft.values.count = count;
        draft.errors['count'] = +count <= 0;
        return;
      }
      case 'WEIGHT': {
        const { weight } = action;
        draft.values.weight = weight;
        draft.errors['weight'] = +weight <= 0;
        return;
      }
      case 'HYDRATION': {
        const { hydration } = action;
        draft.values.hydration = hydration;
        draft.errors['hydration'] = !isInRange([1, 100], +hydration);
        return;
      }
      case 'SALT_PERCENTAGE': {
        const { percentage } = action;
        draft.values.saltPercentage = percentage;
        draft.errors['saltPercentage'] = !isInRange([1, 100], +percentage);
        return;
      }
      case 'TEMPERATURE_UNIT': {
        const unit = action.unit as TemperatureUnit;
        draft.values.temperature.unit = unit;
        const temperature = convertTemperature(unit, +state.values.temperature.value);
        draft.values.temperature.value = temperature.toString();
        draft.errors['temperature'] = !isInRange(getTempRange(unit), +temperature);
        return;
      }
      case 'TEMPERATURE_VALUE': {
        const { temperature } = action;
        draft.values.temperature.value = temperature;
        draft.errors['temperature'] = !isInRange(getTempRange(state.values.temperature.unit), +temperature);
        return;
      }
      case 'DATE_TIME': {
        const { isoDate } = action;
        if (isoDate) {
          const pizzaTime = DateTime.fromISO(isoDate).set({ minute: 0 });
          const now = DateTime.local().set({ minute: 0 });
          const hours = Math.round(pizzaTime.diff(now, 'hours').as('hours'));
          draft.values.hours = hours.toString();
          draft.errors['hours'] = !isInRange([MIN_HOURS, MAX_HOURS], hours);
        } else {
          draft.values.hours = initialState.values.hours;
        }

        return;
      }
      case 'HOURS': {
        const { hours } = action;
        draft.values.hours = hours;
        draft.errors['hours'] = !isInRange([MIN_HOURS, MAX_HOURS], +hours);
        return;
      }
      default:
        return;
    }
  });
