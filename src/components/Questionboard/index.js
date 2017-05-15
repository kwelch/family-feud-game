import React from 'react';
import glamorous from 'glamorous';
import { lighten } from 'polished';
import classnames from 'classnames';
import Box from '../Box';
import { sortByProp } from '../../utils';

const { Div } = glamorous;

const QuestionBoardContainer = glamorous.div({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
});

const AnswerWrapper = glamorous.div(
  {
    position: 'relative',
    // margin: '1rem',
    fontSize: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    width: '380px',
    border: '2px solid white',
    boxShadow: '5px 5px 0px black',
  },
  ({ position }) => ({
    gridRow: position % 4,
  })
);

const AnswerText = glamorous.span(
  {
    flexGrow: 1,
    padding: '1.5rem 1rem',
  },
  (_, { colors: { accent } }) => ({
    backgroundColor: lighten(0.3, accent),
  })
);

const AnswerValue = glamorous.span(
  {
    width: '50px',
    textAlign: 'center',
    padding: '1.5rem .5rem',
    borderLeft: '2px solid black',
    color: 'white',
  },
  (_, { colors: { accent } }) => ({
    backgroundColor: accent,
  })
);

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
  (_, { colors: { accent } }) => ({
    backgroundColor: accent,
  })
);

const PositionIndicator = glamorous.div({ color: 'white' });

const AnswerContainer = ({ label, value, isReveled, onClick, position }) => {
  return (
    <AnswerWrapper position={position} onClick={!isReveled && onClick}>
      <AnswerHidder className={classnames({ hide: isReveled })}>
        <PositionIndicator>
          {position}
        </PositionIndicator>
      </AnswerHidder>
      <AnswerText>{label}</AnswerText><AnswerValue>{value}</AnswerValue>
    </AnswerWrapper>
  );
};

const QuestionBoard = ({ reveledAnswers = [], answerClick, question: { id, text, responses = [] } = {} }) => {
  const sortedResponses = responses.sort(sortByProp('value'));
  // TODO: two columns
  return (
    <QuestionBoardContainer>
      <Box width="80%" big>
        {text}
      </Box>
      <Div display="grid" gridTemplateColumns="repeat(fill, auto)" gridGap="25px" margin="1rem">
        {Array.from({ length: 8 }).map((curr, idx) => {
          if (idx < sortedResponses.length) {
            const response = sortedResponses[idx];
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
          } else {
            return (
              <AnswerWrapper key={idx} position={idx + 1} style={{ padding: '1.5rem 0' }}>
                <AnswerHidder />?
              </AnswerWrapper>
            );
          }
        })}
      </Div>
    </QuestionBoardContainer>
  );
};

export default QuestionBoard;
