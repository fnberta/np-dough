import React from 'react';
import cx from 'classnames';
import { ClassNameProps } from '../../interfaces';
import Icon from './Icon';

export interface FormFieldProps extends ClassNameProps {
  label?: React.ReactNode;
  control: React.ReactNode;
  icon?: string;
  help?: string;
  error?: string | false;
}

export const FormField: React.FC<FormFieldProps> = ({ label, control, icon, help, error, className }) => (
  <div className={cx('field', className)}>
    {label}
    <div
      className={cx('control', {
        'has-icons-left': icon,
        'has-icons-right': error,
      })}
    >
      {control}
      {icon && <Icon className="is-left" icon={icon} />}
      {error && <Icon className="is-small is-right" icon="fa-exclamation-triangle" />}
    </div>
    {error && <p className="help is-danger">{error}</p>}
    {!error && help && <p className="help">{help}</p>}
  </div>
);

export interface HorizontalFieldProps extends ClassNameProps {
  label?: React.ReactNode;
}

export const HorizontalField: React.FC<HorizontalFieldProps> = ({ label, children, className }) => (
  <div className={cx('field', 'is-horizontal', className)}>
    <div className="field-label is-normal">{label}</div>
    <div className="field-body">{children}</div>
  </div>
);
