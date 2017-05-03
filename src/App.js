import React from 'react';
import Title from 'react-title-component';
import glamorous from 'glamorous';

const { Div } = glamorous;

const Header = glamorous.h1({
  fontSize: '1.3rem',
});

const App = () => {
  return (
    <Div>
      <Title render="Family Feud" />
      <Header>Family Feud</Header>
    </Div>
  );
};

export default App;
