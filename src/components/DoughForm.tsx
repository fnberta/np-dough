import { DateTime, Duration } from 'luxon';
import React from 'react';
import cx from 'classnames';
import { getTempRange, MAX_HOURS, MIN_HOURS, DoughAction, DoughFormState } from '../doughFormState';
import { FormField, HorizontalField } from './bulma/Forms';

export interface Props {
  formState: DoughFormState;
  dispatch: (action: DoughAction) => void;
}

function getDateTimeValue(hours: number): string {
  return DateTime.local()
    .set({ minute: 0 })
    .plus(Duration.fromObject({ hours }))
    .toFormat("yyyy-MM-dd'T'HH:mm");
}

const DoughForm: React.FC<Props> = ({ formState, dispatch }) => {
  const { values, errors } = formState;
  const { count, weight, hydration, saltPercentage, temperature, hours } = values;
  const tempRange = getTempRange(temperature.unit);

  return (
    <form onReset={() => dispatch({ type: 'RESET' })}>
      <HorizontalField>
        <FormField
          className="is-grouped is-grouped-right"
          control={
            <button className="button is-light" type="reset" name="reset">
              Reset to default
            </button>
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Number of dough balls</label>}>
        <FormField
          help="How hungry are you?"
          error={errors.count && 'This will never be enough to satisfy your appetite…'}
          control={
            <input
              className={cx('input', errors.count && 'is-danger')}
              type="number"
              name="count"
              aria-label="Count"
              min={1}
              value={count}
              onChange={e => dispatch({ type: 'COUNT', count: e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Weight per ball [g]</label>}>
        <FormField
          help="For a classic neapolitan pizza, around 250g to 270g is suggested."
          error={errors.weight && 'This will never be enough to satisfy your appetite…'}
          control={
            <input
              className={cx('input', errors.weight && 'is-danger')}
              type="number"
              name="weight"
              aria-label="Weight"
              min={1}
              value={weight}
              onChange={e => dispatch({ type: 'WEIGHT', weight: e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Hydration [%]</label>}>
        <FormField
          help="If you have typo 00 flour, start with 65% and experiment with higher values."
          error={errors.hydration && 'Please enter a value between 1 and 100.'}
          control={
            <input
              className={cx('input', errors.hydration && 'is-danger')}
              type="number"
              name="hydration"
              aria-label="Hydration"
              min={1}
              max={100}
              value={hydration}
              onChange={e => dispatch({ type: 'HYDRATION', hydration: e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Salt [%]</label>}>
        <FormField
          help="A value between 3% and 4% is a good start."
          error={errors.saltPercentage && 'Please enter a value between 1 and 100.'}
          control={
            <input
              className={cx('input', errors.saltPercentage && 'is-danger')}
              type="number"
              name="salt"
              aria-label="Salt"
              step={0.1}
              min={1}
              max={100}
              value={saltPercentage}
              onChange={e => dispatch({ type: 'SALT_PERCENTAGE', percentage: e.currentTarget.value })}
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
                  onChange={e => dispatch({ type: 'TEMPERATURE_UNIT', unit: e.currentTarget.value })}
                />
                {' Celsius'}
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="temp-unit"
                  checked={temperature.unit === 'fahrenheit'}
                  value="fahrenheit"
                  onChange={e => dispatch({ type: 'TEMPERATURE_UNIT', unit: e.currentTarget.value })}
                />
                {' Fahrenheit'}
              </label>
            </>
          }
        />
      </HorizontalField>
      <HorizontalField>
        <FormField
          help="Fermenting at room temperature is suggested."
          error={errors.temperature && `Please enter a value between ${tempRange[0]} and ${tempRange[1]}.`}
          control={
            <input
              className={cx('input', errors.temperature && 'is-danger')}
              type="number"
              name="temperature"
              aria-label="Temperature"
              min={tempRange[0]}
              max={tempRange[1]}
              value={temperature.value}
              onChange={e => dispatch({ type: 'TEMPERATURE_VALUE', temperature: e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label={<label className="label">Timing</label>}>
        <FormField
          help="When do you want to eat your pizza?"
          error={errors.hours && 'Please specify a valid date in the future.'}
          control={
            <input
              className={cx('input', errors.hours && 'is-danger')}
              type="datetime-local"
              name="pizza-time"
              aria-label="Pizza Time"
              min={getDateTimeValue(MIN_HOURS)}
              value={getDateTimeValue(+hours)}
              onChange={e => dispatch({ type: 'DATE_TIME', isoDate: e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
      <HorizontalField>
        <FormField
          help="Number of hours your dough should rise before usage."
          error={errors.hours && `Please specify a number between ${MIN_HOURS} and ${MAX_HOURS}.`}
          control={
            <input
              className={cx('input', errors.hours && 'is-danger')}
              type="number"
              name="time"
              aria-label="Time to rise"
              min={1}
              max={MAX_HOURS}
              value={hours}
              onChange={e => dispatch({ type: 'HOURS', hours: e.currentTarget.value })}
            />
          }
        />
      </HorizontalField>
    </form>
  );
};

export default DoughForm;
