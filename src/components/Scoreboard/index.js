import React from 'react';
import glamorous from 'glamorous';
import Box from '../Box';
import { sortByProp } from '../../utils';

const TeamList = glamorous.ol({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const TeamContainer = glamorous.li(
  {
    margin: 0,
    padding: '0.4rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    border: '3px solid white',
    boxShadow: '2px 2px 0px black',
    '& + li': {
      marginTop: '0.6rem',
    },
  },
  ({ isActive }, { colors: { accent, backgroundColor } }) => ({
    borderColor: isActive && backgroundColor,
    backgroundColor: isActive && accent,
  })
);

const TeamName = glamorous.dd({
  margin: 0,
  padding: 0,
});

const TeamScore = glamorous.dl({
  margin: 0,
  marginLeft: '1rem',
});

const ScoreboardTitle = glamorous.h2({
  padding: 0,
  margin: '0 0 .75rem',
  color: 'white',
  textShadow: '2px 2px black',
});

const Scoreboard = ({ teams, activeTeamId }) => (
  <Box>
    <ScoreboardTitle>Scores</ScoreboardTitle>
    <TeamList>
      {teams.sort(sortByProp('score')).map(t => (
        <TeamContainer key={t.id} isActive={t.id === activeTeamId}>
          <TeamName>{t.name}</TeamName>
          <TeamScore>{t.score}</TeamScore>
        </TeamContainer>
      ))}
    </TeamList>
  </Box>
);

export default Scoreboard;
