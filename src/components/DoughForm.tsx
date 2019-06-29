import { DateTime, Duration } from 'luxon';
import React from 'react';
import { DoughAction, DoughFormState } from '../pages';
import { TemperatureUnit } from '../recipe';
import { FormField, HorizontalField } from './bulma/Forms';

export interface Props {
  formState: DoughFormState;
  dispatch: (action: DoughAction) => void;
}

export const MIN_HOURS = 2;
export const MAX_HOURS = 167;

function getDateTimeValue(hours: number): string {
  return DateTime.local()
    .set({ minute: 0 })
    .plus(Duration.fromObject({ hours }))
    .toFormat("yyyy-MM-dd'T'HH:mm");
}

function getMaxTemp(unit: TemperatureUnit): number {
  switch (unit) {
    case 'celsius':
      return 35;
    case 'fahrenheit':
      return 95;
  }
}

const DoughForm: React.FC<Props> = ({ formState, dispatch }) => {
  const { count, weight, hydration, saltPercentage, temperature, hours } = formState;
  return (
    <form>
      <HorizontalField>
        <FormField
          className="is-grouped is-grouped-right"
          control={
            <button
              className="button is-light"
              type="reset"
              name="reset"
              onClick={e => {
                e.preventDefault();
                dispatch({ type: 'RESET' });
              }}
            >
              Reset to default
            </button>
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Number of dough balls</label>}>
        <FormField
          help="How hungry are you?"
          control={
            <input
              className="input"
              type="number"
              name="count"
              aria-label="Count"
              min={1}
              value={count}
              onChange={e => {
                dispatch({
                  type: 'COUNT',
                  payload: {
                    count: e.currentTarget.value,
                  },
                });
              }}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Weight per ball [g]</label>}>
        <FormField
          help="For a classic neapolitan pizza, around 250g to 270g is suggested."
          control={
            <input
              className="input"
              type="number"
              name="weight"
              aria-label="Weight"
              min={1}
              value={weight}
              onChange={e => {
                dispatch({
                  type: 'WEIGHT',
                  payload: {
                    weight: e.currentTarget.value,
                  },
                });
              }}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Hydration [%]</label>}>
        <FormField
          help="If you have typo 00 flour, start with 65% and experiment with higher values."
          control={
            <input
              className="input"
              type="number"
              name="hydration"
              aria-label="Hydration"
              min={1}
              max={100}
              value={hydration}
              onChange={e => {
                dispatch({
                  type: 'HYDRATION',
                  payload: {
                    hydration: e.currentTarget.value,
                  },
                });
              }}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Salt [%]</label>}>
        <FormField
          help="A value between 3% and 4% is a good start."
          control={
            <input
              className="input"
              type="number"
              name="salt"
              aria-label="Salt"
              step={0.1}
              min={1}
              max={100}
              value={saltPercentage}
              onChange={e => {
                dispatch({
                  type: 'SALT_PERCENTAGE',
                  payload: {
                    percentage: e.currentTarget.value,
                  },
                });
              }}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Temperature</label>}>
        <FormField
          control={
            <>
              <label className="radio">
                <input
                  type="radio"
                  name="temp-unit"
                  checked={temperature.unit === 'celsius'}
                  value="celsius"
                  onChange={e => {
                    dispatch({
                      type: 'TEMPERATURE_UNIT',
                      payload: {
                        unit: e.currentTarget.value as TemperatureUnit,
                      },
                    });
                  }}
                />
                {' Celsius'}
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="temp-unit"
                  checked={temperature.unit === 'fahrenheit'}
                  value="fahrenheit"
                  onChange={e => {
                    dispatch({
                      type: 'TEMPERATURE_UNIT',
                      payload: {
                        unit: e.currentTarget.value as TemperatureUnit,
                      },
                    });
                  }}
                />
                {' Fahrenheit'}
              </label>
            </>
          }
        />
      </HorizontalField>
      <HorizontalField>
        <FormField
          help="Fermenting at room temperatures is suggested."
          control={
            <input
              className="input"
              type="number"
              name="temperature"
              aria-label="Temperature"
              min={1}
              max={getMaxTemp(temperature.unit)}
              value={temperature.value}
              onChange={e => {
                dispatch({
                  type: 'TEMPERATURE_VALUE',
                  payload: {
                    temperature: e.currentTarget.value,
                  },
                });
              }}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Timing</label>}>
        <FormField
          help="When do you want to eat your pizza?"
          control={
            <input
              className="input"
              type="datetime-local"
              name="pizza-time"
              aria-label="Pizza Time"
              min={getDateTimeValue(MIN_HOURS)}
              value={getDateTimeValue(+hours)}
              onChange={e => {
                dispatch({
                  type: 'DATE_TIME',
                  payload: {
                    isoDate: e.currentTarget.value,
                  },
                });
              }}
            />
          }
        />
      </HorizontalField>
      <HorizontalField>
        <FormField
          help="Number of hours your dough should rise before usage."
          control={
            <input
              className="input"
              type="number"
              name="time"
              aria-label="Time to rise"
              min={1}
              max={MAX_HOURS}
              value={hours}
              onChange={e => {
                dispatch({
                  type: 'HOURS',
                  payload: {
                    hours: e.currentTarget.value,
                  },
                });
              }}
            />
          }
        />
      </HorizontalField>
    </form>
  );
};

export default DoughForm;
