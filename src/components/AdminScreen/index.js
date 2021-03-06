import glamorous from 'glamorous';
export * from './TeamsCRUD';
export * from './QuestionAdmin';
export * from './Soundboard';

const AdminScreen = glamorous.div(
  {
    width: '50%',
    padding: '2rem',
    backgroundColor: 'white',
    border: '1px solid black',
    boxSizing: 'border-box',
  },
  (_, { colors: { accent } }) => ({
    '& input': {
      border: `1px solid ${accent}`,
    },
  })
);

export default AdminScreen;
