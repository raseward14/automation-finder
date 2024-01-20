import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

type workspacePropList = {
  firstProp: (a: JSON | undefined) => void
}

export default function Workspace({ firstProp }: workspacePropList) {
  let { token } = useParams();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState<JSON>();

  const GetTeams = async (): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/teams`, {
        token: token,
      })
      .then((resp) => {
        setTeamData(resp.data)})
      .catch((error) => {
        console.log(error);
      });
  };

  const listButtons = (data: any) => {
    console.log('list function', typeof data);
  }
    
  useEffect(() => {
    listButtons(teamData)
    firstProp(teamData)
  }, [teamData])

  useEffect(() => {
    GetTeams();
  }, []);

  return <Container>{JSON.stringify(teamData)}
  <Button
  onClick={() => {
    navigate('/automations');
  }}
  >Automations</Button>
  </Container>;
}
