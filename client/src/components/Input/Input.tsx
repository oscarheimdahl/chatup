import './input.scss';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  label?: string;
  indicated?: boolean;
}

const Input = ({ value, onChange, id, label, indicated }: InputProps) => {
  return (
    <section className='input-section'>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className={indicated ? 'indicated' : ''}
        value={value}
        onChange={onChange}
        type='text'
        name={id}
        id={id}
      ></input>
      {/* <div className={`indicator ${indicated ? 'show' : ''}`}></div> */}
    </section>
  );
};

export default Input;
