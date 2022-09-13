import { host } from '@src/config/vars';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { setColor } from '@src/store/slices/userSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './color-chooser.scss';

interface ColorChooserProps {}

const ColorChooser = ({}: ColorChooserProps) => {
  const dispatch = useAppDispatch();
  const color = useAppSelector((s) => s.user.color);
  const token = useAppSelector((s) => s.user.token);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const colorNum = +e.target.value;
    if (colorNum === undefined) return;

    await axios.put(host + 'user/color', { color: colorNum });
    dispatch(setColor(colorNum));
  };

  return (
    <form id='color-chooser'>
      <input onChange={handleChange} checked={color === 0} className='color-0' name='color' type='radio' value={0} />
      <input onChange={handleChange} checked={color === 1} className='color-1' name='color' type='radio' value={1} />
      <input onChange={handleChange} checked={color === 2} className='color-2' name='color' type='radio' value={2} />
      <input onChange={handleChange} checked={color === 3} className='color-3' name='color' type='radio' value={3} />
      <input onChange={handleChange} checked={color === 4} className='color-4' name='color' type='radio' value={4} />
      <input onChange={handleChange} checked={color === 5} className='color-5' name='color' type='radio' value={5} />
      <input onChange={handleChange} checked={color === 6} className='color-6' name='color' type='radio' value={6} />
      <input onChange={handleChange} checked={color === 7} className='color-7' name='color' type='radio' value={7} />
    </form>
  );
};

export default ColorChooser;
