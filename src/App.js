import React from 'react';
import Title from 'react-title-component';
import { css } from 'glamor';
import glamorous, { ThemeProvider } from 'glamorous';

const { Div } = glamorous;

const gameTheme = {
  containerBorderSize: 10,
};

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
    width: '90%',
    border: `0px solid white`,
    boxSizing: 'border-box',
  },
  (_, { containerBorderSize }) => ({
    borderWidth: containerBorderSize,
  }),
);

const cornerPos = [
  { left: '-10px', top: '-10px' },
  { bottom: '-10px', left: '-10px' },
  { top: '-10px', right: '-10px' },
  { right: '-10px', bottom: '-10px' },
];

const Corner = glamorous.div(
  {
    display: 'block',
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: 9,
  },
  ({ pos }, { containerBorderSize }) => ({
    height: containerBorderSize,
    width: containerBorderSize,
    ...pos,
  }),
);

// Define the animation styles
const animationStyles = ({ dir }) => {
  const runner = css.keyframes({
    '0%': { [dir]: '0%' },
    '100%': { [dir]: '100%' },
  });
  return { animation: `${runner} 6s 1 ease-in-out alternate` };
};

const AnimatedCorner = glamorous.div(
  {
    display: 'block',
    position: 'absolute',
  },
  ({ pos, color, dir }, { containerBorderSize }) => ({
    height: containerBorderSize,
    width: containerBorderSize,
    backgroundColor: color,
    ...pos,
    ...animationStyles({ dir }),
  }),
);

const BoxContainer = ({ children, style, ...props }) => {
  return (
    <Box {...props} style={{ position: 'relative', ...style }}>
      {[
        ...Array.from({ length: 4 }).map((v, i) => (
          <Corner key={i} pos={cornerPos[i]} />
        )),
        children,
      ]}
    </Box>
  );
};

const GameBoard = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const App = () => {
  return (
    <ThemeProvider theme={gameTheme}>
      <GameBoard>
        <Title render="Family Feud" />
        <Header>Family Feud</Header>
        <Div display="flex" flexDirection="row">
          <div>
            <BoxContainer>
              Name another word for small business
            </BoxContainer>
          </div>
          <BoxContainer style={{ width: '200px' }}>
            <h2>Score</h2>
            <ol>
              <li><dd>Jackson</dd><dl>100</dl></li>
              <li><dd>Jonas</dd><dl>850</dl></li>
              <li><dd>Kardashians</dd><dl>0</dl></li>
            </ol>
          </BoxContainer>
        </Div>
      </GameBoard>
    </ThemeProvider>
  );
};

export default App;
