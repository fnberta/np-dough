import cx from 'classnames';
import React from 'react';
import { ClassNameProps } from '../../interfaces';

export interface Props extends ClassNameProps, React.HTMLAttributes<HTMLSpanElement> {
  icon: string;
}

const Icon: React.FC<Props> = ({ icon, className, ...rest }) => (
  <span className={cx('icon', className)} {...rest}>
    <i className={cx('fas', icon)} />
  </span>
);

export default Icon;
