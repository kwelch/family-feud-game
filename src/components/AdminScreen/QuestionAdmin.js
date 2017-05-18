import React from 'react';
import glamorous from 'glamorous';
import { lighten } from 'polished';
import { sortByProp } from '../../utils';

export const Button = glamorous.button(
  {
    color: 'white',
    border: `1px solid white`,
    boxShadow: '2px 2px 0px black',
    margin: '0 .5rem',
  },
  ({ x }, { colors: { accent, primary } }) => ({
    backgroundColor: x ? primary : accent,
  })
);

const QuestionAdminContainer = glamorous.div({
  margin: '0 .25rem 1.25rem',
});

const ResponseContainer = glamorous.ul({
  listStyle: 'none',
  margin: '.15rem',
  padding: 0,
});

const Response = glamorous.li(
  {
    listStyle: 'none',
    margin: '.15rem',
    padding: '.2rem',
    border: '1px solid black',
  },
  ({ isActive }, { colors: { primary, accent } }) => ({
    cursor: isActive ? 'default' : 'pointer',
    backgroundColor: lighten(0.2, isActive ? primary : accent),
  })
);

const TotalScore = glamorous.span({});

export const QuestionAdmin = ({
  question: { id, text, responses = [] } = {},
  reveledAnswers = [],
  showAllAnswers,
  showNextQuestion,
  answerClick,
  addToActive,
  showX,
}) => {
  let total = 0;
  return (
    <div>
      <QuestionAdminContainer>
        <h2>{text}</h2>
        <ResponseContainer>
          {responses.sort(sortByProp('value')).map((resp, i) => {
            const respId = `${id}_${i}`;
            const isActive = reveledAnswers.includes(respId);
            total += isActive ? resp.value : 0;
            return (
              <Response
                style={{ paddingBottom: '1rem' }}
                key={respId}
                onClick={!isActive && answerClick(respId)}
                isActive={isActive}
              >
                <span>{resp.label}</span>
                <span style={{ marginLeft: '1rem' }}>{resp.value}</span>
              </Response>
            );
          })}
        </ResponseContainer>
        <TotalScore>
          Total: {total}
          <Button onClick={addToActive(total)}>Add to Active</Button>
        </TotalScore>
      </QuestionAdminContainer>
      <Button onClick={showAllAnswers}>Reveal All</Button>
      <Button onClick={showNextQuestion}>Next Question</Button>
      <br />
      <br />
      <Button x onClick={showX(0)}><s>X</s></Button>
      <Button x onClick={showX(1)}>X</Button>
      <Button x onClick={showX(2)}>XX</Button>
      <Button x onClick={showX(3)}>XXX</Button>
    </div>
  );
};

export default QuestionAdmin;
