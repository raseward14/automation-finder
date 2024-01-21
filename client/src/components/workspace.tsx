import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Col, ContainerProps } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

type workspacePropList = {
  firstProp: (a: JSON | undefined) => void;
};

export default function Workspace({ firstProp }: workspacePropList) {
  let { token } = useParams();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState<JSON>();
  const [teamArray, setTeamArray] = useState<Object[]>();

  const GetTeams = async (): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/teams`, {
        token: token,
      })
      .then((resp) => {
        setTeamData(resp.data);
        console.log(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createButtons = (data: any) => {
    if (data !== undefined) {
      let jsonData = JSON.parse(data);
      let teamArr = jsonData.teams;

      const teamNames = teamArr.map((team: any, index: number) => {
        return team.name;
      });
      setTeamArray(teamNames);
    }
  };

  useEffect(() => {
    if (teamData !== undefined) {
      createButtons(teamData);
      firstProp(teamData);
    }
  }, [teamData]);

  useEffect(() => {
    GetTeams();
  }, []);

  return (
    <Container>
      <table>
        <tbody>
          <th>Click Workspace to find Automation</th>
          {teamArray?.map((team: any, i: number) => (
            <tr>
              <td>
                <Button
                  key={i}
                  onClick={() => {
                    navigate('/automations');
                  }}
                >
                  {`${team}`}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
