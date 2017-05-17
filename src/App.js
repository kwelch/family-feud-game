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
import AdminScreen, { TeamsCRUD, QuestionAdmin } from './components/AdminScreen';
import { sortByProp } from './utils';
import questions from './questions.json';

const { Div } = glamorous;

const gameTheme = {
  colors: {
    primary: '#f2621c',
    accent: '#334f99',
    backgroundColor: '#fbf152',
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

const randomNumberBetween = (low, high) => {
  return Math.floor(Math.random() * high) + low;
};

const AppContainer = glamorous.div(
  {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    '@media(max-width: 2000px)': {
      flexDirection: 'column',
    },
  },
  (_, { colors: { primary, accent } }) => ({
    '& button': {},
  })
);

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
    activeTeamId: 0,
    currentQuestionId: 0,
    reveledAnswers: [],
    usedQuestions: [],
    xCount: 0,
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
        xCount: 0,
        usedQuestions: [...usedQuestions, newQuestionId],
      };
    });
  };

  showX = count => () => {
    // todo: add sound
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
              showNextQuestion={this.showNextQuestion}
              showX={this.showX}
            />
          </AdminScreen>
        </AppContainer>
      </ThemeProvider>
    );
  }
}

export default App;
