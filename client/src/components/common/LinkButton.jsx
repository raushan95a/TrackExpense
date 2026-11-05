import { Link } from 'react-router-dom';
import { buttonClass } from './buttonStyles.js';

/** Router link styled as a button. */
export default function LinkButton({ variant = 'primary', fullWidth, className, ...props }) {
  return <Link className={buttonClass({ variant, fullWidth, className })} {...props} />;
}
