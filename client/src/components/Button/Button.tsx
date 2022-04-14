import './button.scss';

interface ButtonProps {
  children: string;
}

const Button = ({ children }: ButtonProps) => {
  return <button className='button-component'>{children}</button>;
};

export default Button;
