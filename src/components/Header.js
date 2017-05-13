import glamorous from 'glamorous';
const Header = glamorous.h1(
  {
    color: 'white',
    fontSize: '2.3rem',
    textShadow: '1px 1px black, 3px 3px white',
  },
  (_, { colors: { accent } }) => ({
    color: accent,
  })
);

export default Header;
