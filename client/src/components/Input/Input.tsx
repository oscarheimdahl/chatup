import './input.scss';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  label?: string;
}

const Input = ({ value, onChange, id, label }: InputProps) => {
  return (
    <section className='input-section'>
      {label && <label htmlFor={id}>{label}</label>}
      <input value={value} onChange={onChange} type='text' name={id} id={id} />
    </section>
  );
};

export default Input;
