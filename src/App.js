// TODO: care enugh to finish prop-types, maybe try flow?
/* eslint-disable react/prop-types, import/extensions, no-shadow, no-unused-vars */
import React from 'react';
import Title from 'react-title-component';
import { css } from 'glamor';
import glamorous, { ThemeProvider } from 'glamorous';
import { lighten, darken } from 'polished';
import classnames from 'classnames';
import Box from './components/Box';
import Gameboard from './components/Gameboard';
import { sortByProp } from './utils';
import questions from './questions.json';

const { Div } = glamorous;

const gameTheme = {
  colors: {
    primary: '#fb0605',
    accent: '#073b9e',
    backgroundColor: '#fde81f',
  },
  containerBorderSize: 8,
};

css.global('html', {
  width: '100%',
});
css.global('body', {
  height: '100%',
  width: '100%',
  backgroundColor: gameTheme.colors.backgroundColor,
});

const AdminScreen = glamorous.div({
  width: '50%',
  padding: '2rem',
  backgroundColor: 'white',
  border: '1px solid black',
  boxSizing: 'border-box',
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
            <li
              style={{ paddingBottom: '1rem' }}
              key={respId}
              onClick={answerClick(respId)}
              isActive={reveledAnswers.includes(respId)}
            >
              <span>{resp.label}</span>
              <span style={{ marginLeft: '1rem' }}>{resp.value}</span>
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

const AppContainer = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

const AppBackground = glamorous.div({
  content: '',
  position: 'absolute',
  display: 'block',
  width: '100%',
  height: '100%',
  bottom: 0,
  zIndex: -1,
  backgroundImage: `url(${require('./assets/bg.jpg')})`,
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'center top',
  transform: 'rotate(180deg)',
});

class App extends React.Component {
  state = {
    activeTeamId: 1,
    currentQuestionId: 0,
    reveledAnswers: [],
    usedQuestions: [],
    xCount: 3,
    teams: [
      { id: 1, name: 'Jackson', score: 0 },
      { id: 2, name: 'Jonas', score: 0 },
      { id: 3, name: 'Kardashians', score: 0 },
    ],
  };

  constructor(props) {
    super(props);
    setTimeout(this.showNextQuestion);
  }

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
        // xCount: 0,
        usedQuestions: [...usedQuestions, newQuestionId],
      };
    });
  };

  showX = count => () => {
    this.setState({
      xCount: count,
    });
  };

  render() {
    const { reveledAnswers, teams, currentQuestionId, activeTeamId, xCount } = this.state;
    const currentQuestion = questions.find(q => q.id === currentQuestionId);
    return (
      <ThemeProvider theme={gameTheme}>
        <AppContainer>
          <AppBackground />
          <Title render="Family Feud" />
          <Gameboard
            xCount={xCount}
            currentQuestion={currentQuestion}
            reveledAnswers={reveledAnswers}
            activeTeamId={activeTeamId}
            teams={teams}
            revelAnswer={this.revelAnswer}
          />
          <AdminScreen style={{ display: 'none' }}>
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
            <br />
            <button onClick={this.showNextQuestion}>Next Question</button><br />
            <br />
            <button onClick={this.showX(0)}><s>X</s></button>
            <button onClick={this.showX(1)}>X</button>
            <button onClick={this.showX(2)}>XX</button>
            <button onClick={this.showX(3)}>XXX</button>
          </AdminScreen>
        </AppContainer>
      </ThemeProvider>
    );
  }
}

export default App;
