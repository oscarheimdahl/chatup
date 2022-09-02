import './input.scss';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label?: string;
  indicated?: boolean;
  type?: 'password' | 'text' | 'number';
  reference?: React.RefObject<HTMLInputElement>;
}

const Input = ({ reference, value, onChange, name, label, indicated, type = 'text' }: InputProps) => {
  return (
    <section className='input-section'>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        ref={reference}
        className={indicated ? 'indicated' : ''}
        value={value}
        onChange={onChange}
        type={type}
        name={name}
      ></input>
      {/* {indicated && <div className={`indicator ${indicated ? 'show' : ''}`}></div>} */}
    </section>
  );
};

export default Input;
