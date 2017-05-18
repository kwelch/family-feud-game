import React from 'react';
import glamorous from 'glamorous';
import Sound from 'react-sound';

const SoundboardContainer = glamorous.div({
  marginTop: '2rem',
});

const SoundButton = glamorous.button(
  {
    color: 'white',
    border: `1px solid white`,
    boxShadow: '2px 2px 0px black',
    margin: '0 .5rem',
  },
  ({ isPlaying }, { colors: { primary, accent } }) => ({
    backgroundColor: isPlaying ? primary : accent,
  })
);

export const Soundboard = ({ sounds, changeSoundStatus }) => {
  return (
    <SoundboardContainer>
      {Object.keys(sounds).map(key => {
        const isPlaying = sounds[key] === Sound.status.PLAYING;
        return (
          <SoundButton
            key={key}
            isPlaying={isPlaying}
            onClick={changeSoundStatus(key, isPlaying ? Sound.status.STOPPED : Sound.status.PLAYING)}
          >
            {key}&nbsp;
            {isPlaying ? '◼︎' : '▶︎'}
          </SoundButton>
        );
      })}
    </SoundboardContainer>
  );
};

export default Soundboard;
