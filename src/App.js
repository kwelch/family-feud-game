// TODO: care enugh to finish prop-types, maybe try flow?
/* eslint-disable react/prop-types, import/extensions, no-shadow, no-unused-vars */
import React from 'react';
import Title from 'react-title-component';
import { css } from 'glamor';
import glamorous, { ThemeProvider } from 'glamorous';
import { lighten, darken } from 'polished';
import classnames from 'classnames';
import Sound from 'react-sound';
import Box from './components/Box';
import Gameboard from './components/Gameboard';
import AdminScreen, { TeamsCRUD, QuestionAdmin, Soundboard } from './components/AdminScreen';
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
    sounds: {
      theme: Sound.status.STOPPED,
      answer: Sound.status.STOPPED,
      wrong: Sound.status.STOPPED,
    },
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

  addScoreToActive = score => () => {
    this.setState(prevState => ({
      ...this.replaceTeamInList(prevState)(this.addScoreToActiveTeam(prevState)(score)),
    }));
  };

  changeSoundStatus = (key, status) => ({ sounds }) => {
    return {
      sounds: {
        ...sounds,
        [key]: status,
      },
    };
  };

  soundStatusHandler = (key, status) => () => {
    this.setState(prevState => this.changeSoundStatus(key, status)(prevState));
  };

  revelAnswer = answerId => () => {
    const id = answerId.split('_');
    // fuzzy search since id is array of strings and q.id is number
    const question = questions.find(q => q.id == id[0]); // eslint-disable-line eqeqeq
    const answer = question.responses.sort(sortByProp('value'))[id[1]];
    const playSound = this.changeSoundStatus('answer', Sound.status.PLAYING);

    this.setState(prevState => ({
      reveledAnswers: [...prevState.reveledAnswers, answerId],
      ...playSound(prevState),
    }));
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
    const playSound = this.changeSoundStatus('theme', Sound.status.PLAYING);

    this.setState(({ usedQuestions, sounds }) => {
      let newQuestionId = 0;
      do {
        newQuestionId = randomNumberBetween(lowerBound, upperBound);
      } while (usedQuestions.includes(newQuestionId));
      return {
        currentQuestionId: newQuestionId,
        xCount: 0,
        usedQuestions: [...usedQuestions, newQuestionId],
        ...playSound({ sounds }),
      };
    });
  };

  showX = count => () => {
    const playSound = this.changeSoundStatus('wrong', Sound.status.PLAYING);
    this.setState(prevState => ({
      xCount: count,
      ...playSound(prevState),
    }));
  };

  handleSoundStop = key => () => {
    const stopSound = this.changeSoundStatus(key, Sound.status.STOPPED);
    this.setState(prevState => stopSound(prevState));
  };

  render() {
    const { reveledAnswers, teams, currentQuestionId, activeTeamId, xCount, sounds } = this.state;
    const currentQuestion = questions.find(q => q.id === currentQuestionId);
    return (
      <ThemeProvider theme={gameTheme}>
        <AppContainer>
          <AppBackground />
          <Title render="Family Feud" />
          {Object.keys(sounds).map(key => {
            return (
              <Sound
                key={key}
                url={require(`./assets/${key}.mp3`)}
                playStatus={sounds[key]}
                volume={100}
                onFinishedPlaying={this.handleSoundStop(key)}
              />
            );
          })}
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
              addToActive={this.addScoreToActive}
              showX={this.showX}
            />
            <Soundboard sounds={sounds} changeSoundStatus={this.soundStatusHandler} />
          </AdminScreen>
        </AppContainer>
      </ThemeProvider>
    );
  }
}

export default App;
