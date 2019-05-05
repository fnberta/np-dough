import { DateTime, Duration } from 'luxon';
import React from 'react';
import { DoughAction, DoughInputs, TemperatureUnit } from '../pages';
import { FormField, HorizontalField } from './bulma/Forms';

export interface Props {
  doughInputs: DoughInputs;
  dispatch: (action: DoughAction) => void;
}

export const MAX_HOURS = 167;

function getDateTimeValue(hours: number): string {
  return DateTime.local()
    .set({ minute: 0 })
    .plus(Duration.fromObject({ hours }))
    .toFormat("yyyy-MM-dd'T'HH:mm");
}

function getMaxTemp(unit: TemperatureUnit): number {
  switch (unit) {
    case TemperatureUnit.CELSIUS:
      return 35;
    case TemperatureUnit.FAHRENHEIT:
      return 95;
  }
}

const DoughForm: React.FC<Props> = ({ doughInputs, dispatch }) => {
  const { count, weight, hydration, saltPercentage, temperature, hours } = doughInputs;
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
                dispatch({ type: 'reset' });
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
              onChange={e => dispatch({ type: 'setCount', payload: +e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Weight per ball [g]</label>}>
        <FormField
          help="For a classic neapolitan pizza, around 270g is suggested."
          control={
            <input
              className="input"
              type="number"
              name="weight"
              aria-label="Weight"
              min={1}
              value={weight}
              onChange={e => dispatch({ type: 'setWeight', payload: +e.currentTarget.value })}
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
              onChange={e => dispatch({ type: 'setHydration', payload: +e.currentTarget.value })}
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
              onChange={e => dispatch({ type: 'setSaltPercentage', payload: +e.currentTarget.value })}
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
                  checked={temperature.unit === TemperatureUnit.CELSIUS}
                  value={TemperatureUnit.CELSIUS}
                  onChange={e => dispatch({ type: 'setTemperatureUnit', payload: e.currentTarget.value })}
                />
                {' Celsius'}
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="temp-unit"
                  checked={temperature.unit === TemperatureUnit.FAHRENHEIT}
                  value={TemperatureUnit.FAHRENHEIT}
                  onChange={e => dispatch({ type: 'setTemperatureUnit', payload: e.currentTarget.value })}
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
              onChange={e => dispatch({ type: 'setTemperatureValue', payload: +e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Timing</label>}>
        <FormField
          help="When do you want to make your pizza?"
          control={
            <input
              className="input"
              type="datetime-local"
              name="pizza-time"
              aria-label="Pizza Time"
              min="2017-06-01T08:30"
              value={getDateTimeValue(hours)}
              onChange={e => dispatch({ type: 'setDateTime', payload: e.currentTarget.value })}
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
              onChange={e => dispatch({ type: 'setHours', payload: +e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
    </form>
  );
};

export default DoughForm;
