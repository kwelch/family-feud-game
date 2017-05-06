// TODO: care enugh to finish prop-types, maybe try flow?
/* eslint-disable react/prop-types, import/extensions, no-shadow */
import React from 'react';
import Title from 'react-title-component';
import { css } from 'glamor';
import glamorous, { ThemeProvider } from 'glamorous';
import { lighten } from 'polished';
import classnames from 'classnames';
import questions from './questions.json';

const teams = [
  { id: 1, name: 'Jackson', score: 100 },
  { id: 2, name: 'Jonas', score: 850 },
  { id: 3, name: 'Kardashians', score: 0 },
];

const { Div } = glamorous;

const sortByProp = prop => (a, b) => b[prop] - a[prop];

const gameTheme = {
  colors: {
    primary: '#004070',
    backgroundColor: lighten(0.4, '#004070'),
  },
  containerBorderSize: 8,
};

css.global('body', {
  width: '100%',
  backgroundColor: gameTheme.colors.backgroundColor,
});

const Header = glamorous.h1({
  color: 'white',
  fontSize: '2.3rem',
  textShadow: '2px 2px black',
});

const Box = glamorous.div(
  {
    backgroundColor: 'black',
    color: 'white',
    padding: '20px',
    border: `0px solid white`,
  },
  (_, { containerBorderSize, colors: { primary } }) => ({
    backgroundColor: lighten(0.2, primary),
    borderColor: primary,
    borderWidth: containerBorderSize,
  }),
);

const cornerPos = [
  { left: '0px', top: '0px' },
  { bottom: '0px', left: '0px' },
  { top: '0px', right: '0px' },
  { right: '0px', bottom: '0px' },
];

const Corner = glamorous.div(
  {
    display: 'block',
    backgroundColor: 'red',
    position: 'absolute',
    zIndex: 9,
  },
  ({ pos }, { containerBorderSize, colors: { backgroundColor } }) => ({
    height: containerBorderSize,
    width: containerBorderSize,
    backgroundColor,
    ...pos,
  }),
);

// Define the animation styles
const animationStyles = ({ containerBorderSize }) => {
  const runner = css.keyframes({
    '0%': { left: '0%', top: '0%', marginLeft: 0, marginTop: 0 },
    '25%': {
      left: '100%',
      top: '0%',
      marginLeft: `-${containerBorderSize}px`,
      marginTop: 0,
    },
    '50%': {
      left: '100%',
      top: '100%',
      marginLeft: `-${containerBorderSize}px`,
      marginTop: `-${containerBorderSize}px`,
    },
    '75%': {
      left: '0%',
      top: '100%',
      marginLeft: 0,
      marginTop: `-${containerBorderSize}px`,
    },
    '100%': { left: '0%', top: '0%', marginLeft: 0, marginTop: 0 },
  });
  return { animation: `${runner} 6s infinite linear` };
};

const AnimatedCorner = glamorous.div(
  {
    display: 'block',
    backgroundColor: 'red',
    position: 'absolute',
    zIndex: 9,
    top: 0,
    left: 0,
  },
  ({ color }, { containerBorderSize }) => ({
    height: containerBorderSize,
    width: containerBorderSize,
    backgroundColor: color,
    ...animationStyles({ containerBorderSize }),
  }),
);

const BoxContainer = ({ children, animate = false, ...props }) => {
  return (
    <glamorous.Div position="relative">
      {[
        ...Array.from({ length: 4 }).map((v, i) => (
          <Corner key={i} pos={cornerPos[i]} />
        )),
        animate && <AnimatedCorner color="blue" />,
      ]}
      <Box {...props}>
        {children}
      </Box>
    </glamorous.Div>
  );
};

const GameContainer = glamorous.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-around',
  alignItems: 'flex-start',
});

const TeamList = glamorous.ol({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const TeamContainer = glamorous.li({
  margin: 0,
  padding: 0,
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const TeamName = glamorous.dd({
  margin: 0,
  padding: 0,
});

const TeamScore = glamorous.dl({
  margin: 0,
  padding: 0,
});

const Scoreboard = ({ teams }) => (
  <BoxContainer style={{ width: '200px' }}>
    <h2>Score</h2>
    <TeamList>
      {teams.sort(sortByProp('score')).map(t => (
        <TeamContainer key={t.id}>
          <TeamName>{t.name}</TeamName>
          <TeamScore>{t.score}</TeamScore>
        </TeamContainer>
      ))}
    </TeamList>
  </BoxContainer>
);

const AnswerWrapper = glamorous.div({
  position: 'relative',
  margin: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  border: '2px solid black',
  overflow: 'hidden',
});

const AnswerText = glamorous.span({
  flexGrow: 1,
  backgroundColor: 'white',
  padding: '1.5rem 1rem',
});

const AnswerValue = glamorous.span({
  width: '15%',
  textAlign: 'center',
  padding: '1.5rem 1rem',
  borderLeft: '2px solid black',
  backgroundColor: 'red',
});

const AnswerHidder = glamorous.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'left',
    transitionDuration: '1s',
    transitionTimingFunction: 'ease-out',
    transitionDelay: '.5s',
    '&.hide': {
      left: '105%',
    },
  },
  (_, { colors: { primary } }) => ({
    backgroundColor: lighten(0.5, primary),
  }),
);

const PositionIndicator = glamorous.div({});

const AnswerContainer = ({ label, value, isReveled, onClick, position }) => {
  return (
    <AnswerWrapper onClick={!isReveled && onClick}>
      <AnswerHidder className={classnames({ hide: isReveled })}>
        <PositionIndicator>
          {position}
        </PositionIndicator>
      </AnswerHidder>
      <AnswerText>{label}</AnswerText><AnswerValue>{value}</AnswerValue>
    </AnswerWrapper>
  );
};

const QuestionBoardContainer = glamorous.div({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
});

const QuestionBoard = ({
  reveledAnswers = [],
  answerClick,
  question: { text, responses },
}) => {
  return (
    <QuestionBoardContainer>
      <BoxContainer>
        {text}
      </BoxContainer>
      <Div>
        {responses
          .sort(sortByProp('value'))
          .map((response, idx) => (
            <AnswerContainer
              key={response.id}
              onClick={answerClick(response.id)}
              isReveled={reveledAnswers.includes(response.id)}
              position={idx + 1}
              {...response}
            />
          ))}
      </Div>
    </QuestionBoardContainer>
  );
};

class App extends React.Component {
  state = {
    currentQuestionIndex: 0,
    reveledAnswers: [1],
  };

  revelAnswer = answerId => () => {
    this.setState(prevState => ({
      reveledAnswers: [...prevState.reveledAnswers, answerId],
    }));
  };

  render() {
    return (
      <ThemeProvider theme={gameTheme}>
        <Div display="flex" flexDirection="column" alignItems="center">
          <Title render="Family Feud" />
          <Header>Family Feud</Header>
          <GameContainer>
            <QuestionBoard
              question={questions[this.state.currentQuestionIndex]}
              reveledAnswers={this.state.reveledAnswers}
              answerClick={this.revelAnswer}
            />
            <Scoreboard teams={teams} />
          </GameContainer>
        </Div>
      </ThemeProvider>
    );
  }
}

export default App;
