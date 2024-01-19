import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

type workspacePropList = {
  firstProp: (a: JSON | undefined) => void
}

export default function Workspace({ firstProp }: workspacePropList) {
  let { token } = useParams();
  const [teamData, setTeamData] = useState<JSON>();

  const GetTeams = async (): Promise<void> => {
    await axios
      .post(`http://localhost:3001/workspace/teams`, {
        token: token,
      })
      .then((resp) => setTeamData(resp.data))
      .catch((error) => {
        console.log(error);
      });
    };
    
  useEffect(() => {
    firstProp(teamData)
  }, [teamData])

  useEffect(() => {
    GetTeams();
  }, []);

  return <Container>{JSON.stringify(teamData)}</Container>;
}
