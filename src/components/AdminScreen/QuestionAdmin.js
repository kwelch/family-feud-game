import React from 'react';
import glamorous from 'glamorous';
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

export const QuestionAdmin = ({
  question: { id, text, responses = [] } = {},
  reveledAnswers = [],
  showAllAnswers,
  showNextQuestion,
  answerClick,
  showX,
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
