import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Col, ContainerProps } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

type workspacePropList = {
  firstProp: (a: JSON | undefined) => void;
};

type WrapperProps = {
  children: JSX.Element;
};

function Wrapper (props: WrapperProps) {
  return <div>{props.children}</div>;
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

  const listButtons = (data: any) => {
    if (data !== undefined) {
      let jsonData = JSON.parse(data);
      let teamArr = jsonData.teams;
      setTeamArray(teamArr);
      console.log(teamArr);
    }
  };

  useEffect(() => {
    if (teamData !== undefined) {
      listButtons(teamData);
      firstProp(teamData);
    }
  }, [teamData]);

  useEffect(() => {
    GetTeams();
  }, []);

  return (
    <Container>
      <>
      {teamArray?.forEach((team: object) => {
        console.log(team)
      })}
      <Button
        onClick={() => {
          navigate('/automations');
        }}
      >
        Automations
      </Button>
      </>
    </Container>
  );
}
