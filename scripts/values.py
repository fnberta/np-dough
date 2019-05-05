from os.path import dirname, realpath

import pandas as pd


def get_path(path):
    base_path = dirname(realpath(__file__))
    return '{}/{}'.format(base_path, path)


def transform_data(input_path, output_path):
    df = pd.read_csv(get_path(input_path), header=[0, 1, 2], index_col=[0, 1])
    df.columns.names = ['ADY', 'IDY', 'CY']
    df_melted = df.reset_index().melt(value_name='Hours', id_vars=['Celsius', 'Fahrenheit'])
    df_melted.to_csv(get_path(output_path), index=False, na_rep=-1,
                     header=['temperature.celsius', 'temperature.fahrenheit', 'yeast.ady', 'yeast.idy', 'yeast.cy',
                             'hours'])


transform_data('raw-values.csv', '../src/data/yeast-model.csv')
