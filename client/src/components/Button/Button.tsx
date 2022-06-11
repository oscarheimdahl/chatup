import './button.scss';

interface ButtonProps {
  children: string;
  underline?: boolean;
  className?: string;
  secondary?: boolean;
  onClick?: () => any;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button = ({ children, underline, className = '', secondary, onClick, type }: ButtonProps) => {
  const underlineClass = underline ? 'underline' : '';
  const secondaryClass = secondary ? 'secondary' : '';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button-component ${className} ${underlineClass} ${secondaryClass}`}
    >
      {children}
    </button>
  );
};

export default Button;
