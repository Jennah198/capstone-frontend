import { ChevronDown, Triangle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const languages = [
  {
    label: 'English (United States)',
    value: 'en',
  },
  {
    label: 'Amharic',
    value: 'am',
  },
];

function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 gap-3 sm:gap-4">
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <Link to="/" className="text-2xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap">
          GoEvent
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 md:gap-12 w-full md:w-auto justify-center md:justify-end">
        <div className="relative">
          <select>
            {languages.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button className="flex items-center text-teal-700 border border-teal-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md hover:bg-teal-700 hover:text-white transition-all duration-300 text-xs sm:text-sm md:text-base whitespace-nowrap">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="ml-1 sm:ml-2">Sign in</span>
          </button>
          <button className="bg-teal-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md hover:bg-teal-800 transition-all duration-300 hover:cursor-pointer hover:shadow-lg text-xs sm:text-sm md:text-base whitespace-nowrap">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
