// TODO: care enugh to finish prop-types, maybe try flow?
/* eslint-disable react/prop-types, import/extensions, no-shadow */
import React from 'react';
import Title from 'react-title-component';
import { css } from 'glamor';
import glamorous, { ThemeProvider } from 'glamorous';
import { lighten } from 'polished';
import classnames from 'classnames';
import questions from './questions.json';

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
  })
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
  })
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
  })
);

const BoxContainer = ({ children, animate = false, ...props }) => {
  return (
    <glamorous.Div position="relative">
      {[
        ...Array.from({ length: 4 }).map((v, i) => <Corner key={i} pos={cornerPos[i]} />),
        animate && <AnimatedCorner color="blue" />,
      ]}
      <Box {...props}>
        {children}
      </Box>
    </glamorous.Div>
  );
};

const GameContainer = glamorous.div({
  position: 'relative',
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

const TeamContainer = glamorous.li(
  {
    margin: 0,
    padding: 0,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    border: '1px solid white',
  },
  ({ isActive }, { colors: { primary } }) => ({
    borderColor: isActive && primary,
  })
);

const TeamName = glamorous.dd({
  margin: 0,
  padding: 0,
});

const TeamScore = glamorous.dl({
  margin: 0,
  padding: 0,
});

const Scoreboard = ({ teams, activeTeamId }) => (
  <BoxContainer style={{ width: '200px' }}>
    <h2>Score</h2>
    <TeamList>
      {teams.sort(sortByProp('score')).map(t => (
        <TeamContainer key={t.id} isActive={t.id === activeTeamId}>
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
  width: '50px',
  textAlign: 'center',
  padding: '1.5rem .5rem',
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
    transitionDuration: '.7s',
    transitionTimingFunction: 'ease-out',
    transitionDelay: '.5s',
    '&.hide': {
      left: '105%',
    },
  },
  (_, { colors: { primary } }) => ({
    backgroundColor: lighten(0.5, primary),
  })
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

const QuestionBoard = ({ reveledAnswers = [], answerClick, question: { id, text, responses = [] } = {} }) => {
  return (
    <QuestionBoardContainer>
      <BoxContainer>
        {text}
      </BoxContainer>
      <Div>
        {responses.sort(sortByProp('value')).map((response, idx) => {
          const respId = `${id}_${idx}`;
          return (
            <AnswerContainer
              key={respId}
              onClick={answerClick(respId)}
              isReveled={reveledAnswers.includes(respId)}
              position={idx + 1}
              {...response}
            />
          );
        })}
      </Div>
    </QuestionBoardContainer>
  );
};

const AdminScreen = glamorous.div({
  padding: '2rem',
  backgroundColor: 'white',
  border: '1px solid black',
});

const TeamEditRow = ({ name = '', score = 0, onChange, setActive, isActive }) => {
  const scoreUpdate = ({ target: { value } }) => {
    return onChange({ target: { name: 'score', value: Number(value) } });
  };
  return (
    <tr>
      <td>
        <input name="name" value={name} onChange={onChange} />
      </td>
      <td>
        <input name="score" value={score} onChange={scoreUpdate} />
      </td>
      <td style={{ display: setActive ? 'auto' : 'none' }}>
        <input type="checkbox" name="active" checked={isActive} onChange={setActive} />
      </td>
    </tr>
  );
};

const TeamsCRUD = ({ teams = [], updater, setActive, activeTeamId }) => {
  let newTeamField = null;
  const teamUpdate = team => ({ target: { name, value } }) => {
    return updater(
      Object.assign({}, team, {
        [name]: value,
      })
    );
  };
  const addNewTeam = ({ key }) => {
    if (key === 'Enter' && newTeamField) {
      const idList = teams.map(t => t.id);
      const nextId = Math.max.apply(null, idList) + 1;
      updater({ id: nextId, name: newTeamField.value, score: 0 });
      newTeamField.value = '';
    }
  };
  return (
    <table>
      <thead>
        <tr><th colSpan={3}>Team List</th></tr>
        <tr>
          <th>Name</th>
          <th>Score</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        {teams.map(team => (
          <TeamEditRow
            key={team.id}
            setActive={setActive(team.id)}
            onChange={teamUpdate(team)}
            isActive={activeTeamId === team.id}
            {...team}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <input
              name="name"
              ref={input => {
                newTeamField = input;
              }}
              onKeyPress={addNewTeam}
            />
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

const QuestionAdmin = ({
  question: { id, text, responses = [] } = {},
  reveledAnswers = [],
  showAllAnswers,
  answerClick,
}) => {
  return (
    <div>
      <h2>{text}</h2>
      <ul>
        {responses.sort(sortByProp('value')).map((resp, i) => {
          const respId = `${id}_${i}`;
          return (
            <li key={respId} onClick={answerClick(respId)} isActive={reveledAnswers.includes(respId)}>
              <span>{resp.label}</span>
              <span>{resp.value}</span>
            </li>
          );
        })}
      </ul>
      <button onClick={showAllAnswers}>Reveal All</button>
    </div>
  );
};

const randomNumberBetween = (low, high) => {
  return Math.floor(Math.random() * high) + low;
};

const XContainer = glamorous.span({
  fontSize: '3rem',
  color: 'red',
  padding: '1.2rem',
});

const BigX = ({ count = 1 }) => {
  return (
    <Div
      position="absolute"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      top={0}
      left={0}
    >
      {Array.from({ length: count }).map((_, i) => <XContainer key={i}>X</XContainer>)}
    </Div>
  );
};

class App extends React.Component {
  state = {
    activeTeamId: 0,
    currentQuestionId: 0,
    reveledAnswers: [],
    usedQuestions: [],
    teams: [
      { id: 1, name: 'Jackson', score: 0 },
      { id: 2, name: 'Jonas', score: 0 },
      { id: 3, name: 'Kardashians', score: 0 },
    ],
  };

  replaceTeamInList = ({ teams }) => team => {
    if (!team) {
      return teams;
    }
    const teamIndex = teams.findIndex(t => t.id === team.id);
    if (teamIndex >= 0) {
      const newTeams = teams.slice();
      newTeams[teamIndex] = team;
      return { teams: newTeams };
    }
    // id not found add to the end of the list
    return { teams: [...teams, team] };
  };

  addScoreToActiveTeam = ({ teams, activeTeamId }) => score => {
    const activeTeam = teams.find(t => t.id === activeTeamId);
    if (activeTeam) {
      return Object.assign({}, activeTeam, { score: activeTeam.score + score });
    }
    return null;
  };

  revelAnswer = answerId => () => {
    const id = answerId.split('_');
    // fuzzy search since id is array of strings and q.id is number
    const question = questions.find(q => q.id == id[0]); // eslint-disable-line eqeqeq
    const answer = question.responses.sort(sortByProp('value'))[id[1]];

    this.setState(prevState => {
      const updatedActiveTeam = this.addScoreToActiveTeam(prevState)(answer.value);
      return {
        ...this.replaceTeamInList(prevState)(updatedActiveTeam),
        reveledAnswers: [...prevState.reveledAnswers, answerId],
      };
    });
  };

  showAllAnswers = () => {
    this.setState(({ currentQuestionId, reveledAnswers }) => {
      const question = questions.find(q => q.id === currentQuestionId);
      return {
        reveledAnswers: [...reveledAnswers, ...question.responses.map((_, i) => `${question.id}_${i}`)],
      };
    });
  };

  updateTeam = team => {
    this.setState(({ teams }) => {
      return this.replaceTeamInList({ teams })(team);
    });
  };

  setActiveTeam = id => () => {
    this.setState({
      activeTeamId: id,
    });
  };

  showNextQuestion = () => {
    const questionIdList = questions.map(q => q.id);
    const lowerBound = Math.floor.apply(null, questionIdList);
    const upperBound = Math.max.apply(null, questionIdList);

    this.setState(({ usedQuestions }) => {
      let newQuestionId = 0;
      do {
        newQuestionId = randomNumberBetween(lowerBound, upperBound);
      } while (usedQuestions.includes(newQuestionId));
      return {
        currentQuestionId: newQuestionId,
        usedQuestions: [...usedQuestions, newQuestionId],
      };
    });
  };

  render() {
    const { reveledAnswers, teams, currentQuestionId, activeTeamId } = this.state;
    const currentQuestion = questions.find(q => q.id === currentQuestionId);
    return (
      <ThemeProvider theme={gameTheme}>
        <Div display="flex" flexDirection="column" alignItems="center">
          <Title render="Family Feud" />
          <Header>Family Feud</Header>
          <GameContainer>
            <QuestionBoard question={currentQuestion} reveledAnswers={reveledAnswers} answerClick={this.revelAnswer} />
            <Scoreboard teams={teams.slice()} activeTeamId={activeTeamId} />
            <BigX count={3} />
          </GameContainer>
          <AdminScreen>
            <TeamsCRUD
              teams={teams}
              updater={this.updateTeam}
              setActive={this.setActiveTeam}
              activeTeamId={activeTeamId}
            />
            <QuestionAdmin
              question={currentQuestion}
              reveledAnswers={reveledAnswers}
              showAllAnswers={this.showAllAnswers}
              answerClick={this.revelAnswer}
            />
            <button onClick={this.showNextQuestion}>Next Question</button>
          </AdminScreen>
        </Div>
      </ThemeProvider>
    );
  }
}

export default App;
