import { DoughInputs, getDoughRecipe, ValidDoughInputs } from './recipe';

const testInputs: ValidDoughInputs = {
  valid: true,
  count: 4,
  weight: 270,
  hydration: 65,
  saltPercentage: 3.2,
  temperature: {
    unit: 'celsius',
    value: 23,
  },
  hours: 24,
};

test('should return exact cy amount if value available', () => {
  const yeastModels = new Map([
    [
      20,
      [
        {
          temperature: 20,
          yeast: {
            idy: 0.032,
            cy: 0.1,
            ady: 0.042,
          },
          hours: 22,
        },
      ],
    ],
  ]);
  const input: DoughInputs = {
    ...testInputs,
    temperature: {
      unit: 'celsius',
      value: 20,
    },
    hours: 22,
  };

  const { flour, yeast } = getDoughRecipe(yeastModels, input);
  expect(yeast.cy).toBeCloseTo(flour * (0.1 / 100));
});

describe('should return interpolated cy amount if no value available', () => {
  test('median', () => {
    const yeastModels = new Map([
      [
        20,
        [
          {
            temperature: 20,
            yeast: {
              idy: 0.056,
              cy: 0.175,
              ady: 0.074,
            },
            hours: 15,
          },
          {
            temperature: 20,
            yeast: {
              idy: 0.048,
              cy: 0.15,
              ady: 0.063,
            },
            hours: 17,
          },
          {
            temperature: 20,
            yeast: {
              idy: 0.04,
              cy: 0.125,
              ady: 0.053,
            },
            hours: 19,
          },
          {
            temperature: 20,
            yeast: {
              idy: 0.032,
              cy: 0.1,
              ady: 0.042,
            },
            hours: 22,
          },
        ],
      ],
    ]);
    const input: DoughInputs = {
      ...testInputs,
      temperature: {
        unit: 'celsius',
        value: 20,
      },
      hours: 18,
    };

    const { flour, yeast } = getDoughRecipe(yeastModels, input);
    expect(yeast.cy).toBeCloseTo(flour * (0.1375 / 100));
  });

  test('percentile', () => {
    const yeastModels = new Map([
      [
        20,
        [
          {
            temperature: 20,
            yeast: {
              idy: 0.064,
              cy: 0.2,
              ady: 0.084,
            },
            hours: 14,
          },
          {
            temperature: 20,
            yeast: {
              idy: 0.056,
              cy: 0.175,
              ady: 0.074,
            },
            hours: 15,
          },
          {
            temperature: 20,
            yeast: {
              idy: 0.04,
              cy: 0.125,
              ady: 0.053,
            },
            hours: 19,
          },
          {
            temperature: 20,
            yeast: {
              idy: 0.032,
              cy: 0.1,
              ady: 0.042,
            },
            hours: 22,
          },
        ],
      ],
    ]);
    const input: DoughInputs = {
      ...testInputs,
      temperature: {
        unit: 'celsius',
        value: 20,
      },
      hours: 18,
    };

    const { flour, yeast } = getDoughRecipe(yeastModels, input);
    expect(yeast.cy).toBeCloseTo(flour * (0.1375 / 100));
  });
});
