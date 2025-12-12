import { Link } from 'react-router-dom';

const languages = [
  {
    label: 'English (United States)',
    value: 'en',
  },
  {
    label: 'Amharic (Ethiopia)',
    value: 'am',
  },
];

function Header() {
  return (
    <div>
      <div>
        <Link to="/">GoEvent</Link>
      </div>

      <div>
        {languages.map((language) => (
          <button key={language.value}>{language.label}</button>
        ))}
      </div>

      <div>
        <button>Login</button>
        <button>Signup</button>
      </div>
    </div>
  );
}

export default Header;
