export interface YeastValues {
  idy: number;
  cy: number;
  ady: number;
}

export interface YeastModel {
  temperature: number;
  yeast: YeastValues;
  hours: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface DoughInput {
  count: number;
  weight: number;
  hydration: number;
  saltPercentage: number;
  temperature: {
    unit: TemperatureUnit;
    value: number;
  };
  hours: number;
}

export interface DoughRecipe {
  flour: number;
  water: number;
  salt: number;
  yeast: YeastValues;
}

export const initialDoughInput: DoughInput = {
  count: 4,
  weight: 270,
  hydration: 65,
  saltPercentage: 3.2,
  temperature: {
    unit: 'celsius',
    value: 18,
  },
  hours: 24,
};

function getYeastValues(yeastModels: Map<number, YeastModel[]>, temperature: number, hours: number): YeastValues {
  const [, modelsForTemperature] = Array.from(yeastModels.entries()).reduce((acc, curr) =>
    Math.abs(temperature - curr[0]) < Math.abs(temperature - acc[0]) ? curr : acc,
  );

  if (modelsForTemperature.length < 2) {
    return modelsForTemperature[0].yeast;
  }

  let model1 = modelsForTemperature[0];
  let model2 = modelsForTemperature[1];
  for (let i = 1; i < modelsForTemperature.length - 1; i++) {
    const model = modelsForTemperature[i];
    const diff = hours - model.hours;
    if (Math.abs(diff) < Math.abs(hours - model1.hours)) {
      model1 = model;

      if (diff === 0) {
        return model.yeast;
      }

      if (diff > 0) {
        model2 = modelsForTemperature[i + 1];
      } else if (diff < 0) {
        model2 = modelsForTemperature[i - 1];
      }
    }
  }

  const interpolate = (type: keyof YeastValues) => {
    const yeastValue1 = model1.yeast[type];
    const yeastValue2 = model2.yeast[type];
    return yeastValue1 + (hours - model1.hours) * ((yeastValue2 - yeastValue1) / (model2.hours - model1.hours));
  };

  return {
    ady: interpolate('ady'),
    cy: interpolate('cy'),
    idy: interpolate('idy'),
  };
}

export function getDoughRecipe(
  yeastModels: Map<number, YeastModel[]>,
  { count, weight, hydration, saltPercentage, temperature, hours }: DoughInput,
): DoughRecipe {
  const totalWeight = count * weight;
  const flour = totalWeight / (1 + hydration / 100 + saltPercentage / 100);
  const water = flour * (hydration / 100);
  const salt = flour * (saltPercentage / 100);
  const { idy, cy, ady } = getYeastValues(yeastModels, temperature.value, hours);

  return {
    flour,
    water,
    salt,
    yeast: {
      idy: flour * (idy / 100),
      cy: flour * (cy / 100),
      ady: flour * (ady / 100),
    },
  };
}
