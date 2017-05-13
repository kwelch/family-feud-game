import React from 'react';
import glamorous from 'glamorous';
import Header from '../Header';
import Questionboard from '../Questionboard';
import Scoreboard from '../Scoreboard';

const { Div } = glamorous;

const GameContainer = glamorous.div({
  position: 'relative',
  width: '50%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
});

const XContainer = glamorous.span({
  fontSize: '3rem',
  color: 'red',
  padding: '0.4rem 0 0 0.4rem',
  border: '8px solid red',
  textAlign: 'center',
  textShadow: '3px 3px black',
  boxShadow: '3px 3px 0px black',
  '& + span': {
    marginLeft: 8,
  },
});

const FadedContainer = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginBottom: 20,
});

const BigX = ({ count = 0 }) => {
  return (
    <FadedContainer>
      {Array.from({ length: count }).map((_, i) => <XContainer key={i}>X</XContainer>)}
    </FadedContainer>
  );
};

export default ({ xCount, currentQuestion, reveledAnswers, activeTeamId, teams, revelAnswer }) => {
  return (
    <GameContainer>
      <Div display="flex" flexDirection="column" flexGrow={1}>
        <Header style={{ textAlign: 'center' }}>Family Feud</Header>
        <BigX count={xCount} />
        <Questionboard question={currentQuestion} reveledAnswers={reveledAnswers} answerClick={revelAnswer} />
      </Div>
      <Scoreboard teams={teams.slice()} activeTeamId={activeTeamId} />
    </GameContainer>
  );
};
