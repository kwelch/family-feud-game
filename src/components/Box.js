import glamorous from 'glamorous';

const Box = glamorous.div(
  {
    position: 'relative',
    display: 'table',
    padding: '2rem',
    color: 'white',
    border: '2px solid white',
    boxShadow: '5px 5px 0px black',
  },
  ({ width, big }, { colors: { primary } }) => ({
    fontSize: big ? '1.75rem' : '1.2rem',
    width,
    backgroundColor: primary,
  })
);

export default Box;
