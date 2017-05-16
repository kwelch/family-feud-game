import React from 'react';

export const TeamEditRow = ({ name = '', score = 0, onChange, setActive, isActive }) => {
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
      <td style={{ display: setActive ? 'auto' : 'none', textAlign: 'center' }}>
        <input type="checkbox" name="active" checked={isActive} onChange={setActive} />
      </td>
    </tr>
  );
};

export const TeamsCRUD = ({ teams = [], updater, setActive, activeTeamId }) => {
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

export default TeamsCRUD;
