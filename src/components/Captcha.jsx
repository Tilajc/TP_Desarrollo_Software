import { useMemo } from 'react';
import { Repeat } from 'lucide-react';
import { getRandomInt } from '@/utils/randomize';

const sizeClasses = [
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
];
const fontWeights = ['font-normal', 'font-bold', 'font-black'];
const rotations = [
  '-rotate-12',
  'rotate-6',
  '-rotate-6',
  'rotate-12',
  'rotate-0',
];
const colors = [
  'text-blue-600',
  'text-indigo-600',
  'text-slate-700',
  'text-purple-600',
  'text-sky-700',
];

const pick = (options) => options[getRandomInt(options.length)];

const Captcha = ({ word, updateCaptcha }) => {
  const letters = useMemo(() => {
    return word?.split('').map((letter) => ({
      letter,
      className: `inline-block transition-transform duration-200 ${pick(sizeClasses)} ${pick(fontWeights)} ${pick(rotations)} ${pick(colors)}`,
      offset: getRandomInt(4) - 2,
    }));
  }, [word]);

  return (
    <div className="bg-gray-100 border border-gray-300 flex items-center justify-between p-3 rounded-lg select-none">
      <div className="flex space-x-1 overflow-hidden py-2 px-3 bg-white rounded border border-gray-200 tracking-widest relative">
        {letters.map(({ letter, className, offset }, index) => (
          <span
            key={index}
            className={className}
            style={{ transform: `translateY(${offset}px)` }}
          >
            {letter}
          </span>
        ))}
      </div>

      <button
        type="button"
        title="Cambiar captcha"
        className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer transition-colors"
        onClick={updateCaptcha}
      >
        <Repeat className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Captcha;
