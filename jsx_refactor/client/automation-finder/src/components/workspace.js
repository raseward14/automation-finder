import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate, useParams } from 'react-router-dom';

export default function Workspace({
  socket,
  teamCallback,
  spaceCallback,
  folderCallback,
  listCallback,
  folderlessListCallback,
  tokenCallback,
}) {
  let { token } = useParams();

  const navigate = useNavigate();
  const [teamData, setTeamData] = useState();
  const [teamArray, setTeamArray] = useState([]);
  const [spaceArray, setSpaceArray] = useState([]);
  const [folderArray, setFolderArray] = useState([]);
  const [folderlessListArray, setFolderlessListArray] = useState([]);
  const [listArray, setListArray] = useState([]);
  const [clickedTeam, setClickedTeam] = useState();
  const [showNavButton, setShowNavButton] = useState(false);
  const [workspacePressed, setWorkspacePressed] = useState(-1);

  const GetTeams = async () => {
    await axios
      .post(`http://localhost:8080/workspace/teams`, {
        token: token,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const teamsArrayData = jsonData.teams;
          const individualTeamObjects = [];
          for (const team of teamsArrayData) {
            individualTeamObjects.push(team);
          }
          setTeamArray(individualTeamObjects);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetSpaces = async (teamId) => {
    await axios
      .post(`http://localhost:8080/workspace/spaces`, {
        token: token,
        teamId: teamId,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const spaceArrayData = jsonData.spaces;
          const indvidualArray = [];
          for (var i = 0; i < spaceArrayData.length; i++) {
            indvidualArray.push(spaceArrayData[i]);
          }
          setSpaceArray((spaceArray) => [...spaceArray, ...indvidualArray]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetFolders = async (spaceId) => {
    await axios
      .post(`http://localhost:8080/workspace/folders`, {
        token: token,
        spaceId: spaceId,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const folderArrayData = jsonData.folders;
          const indvidualArray = [];
          for (var i = 0; i < folderArrayData.length; i++) {
            indvidualArray.push(folderArrayData[i]);
          }
          setFolderArray((folderArray) => [...folderArray, ...indvidualArray]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetFolderlessLists = async (spaceId) => {
    await axios
      .post(`http://localhost:8080/workspace/folderless/lists`, {
        token: token,
        spaceId: spaceId,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const folderlessListArrayData = jsonData.lists;
          const indvidualArray = [];
          for (var i = 0; i < folderlessListArrayData.length; i++) {
            indvidualArray.push(folderlessListArrayData[i]);
          }
          setFolderlessListArray((folderlessListArray) => [
            ...folderlessListArray,
            ...indvidualArray,
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const GetLists = async (folderId) => {
    await axios
      .post(`http://localhost:8080/workspace/lists`, {
        token: token,
        folderId: folderId,
      })
      .then((resp) => {
        if (resp.data != undefined) {
          let jsonData = JSON.parse(resp.data);
          const listArrayData = jsonData.lists;
          const indvidualArray = [];
          for (var i = 0; i < listArrayData.length; i++) {
            indvidualArray.push(listArrayData[i]);
          }
          setListArray((listArray) => [...listArray, ...indvidualArray]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getIds = async (teamId) => {
    await GetSpaces(teamId);

    const setFolderIds = async () => {
      for (var i = 0; i < spaceArray.length; i++) {
        GetFolders(spaceArray[i].id);
      }
    };

    await setFolderIds();

    const setFolderlessIds = async () => {
      for (var i = 0; i < spaceArray.length; i++) {
        GetFolderlessLists(spaceArray[i].id);
      }
    };

    await setFolderlessIds();

    const setListIds = async () => {
      for (var i = 0; i < folderArray.length; i++) {
        GetLists(folderArray[i].id);
      }
    };

    await setListIds();

    tokenCallback(token);
    spaceCallback(spaceArray.map((space) => space.id));
    folderCallback(folderArray.map((folder) => folder.id));
    folderlessListCallback(folderlessListArray.map((list) => list.id));
    listCallback(listArray.map((list) => list.id));

    setShowNavButton(true);
  };

  const createButtons = (data) => {
    if (data !== undefined) {
      let jsonData = JSON.parse(data);
      let teamArr = jsonData.teams;

      const teamNames = teamArr.map((team) => {
        return team.name;
      });
      setTeamArray(teamNames);
    }
  };

  const sendTeam = (data) => {
    if (data !== undefined) {
      teamCallback(data);
    }
  };

  useEffect(() => {
    sendTeam(clickedTeam);
  }, [clickedTeam]);

  useEffect(() => {
    GetTeams();
  }, []);

  useEffect(() => {
    if (teamData !== undefined) {
      createButtons(teamData);
    }
  }, [teamData]);

  const style = {
    container: {
      margin: '5% 10% 10% 10%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      justifyContent: 'center',
      width: '100vw',
      margin: '0 auto',
    },
    button: {
      width: 'auto', // Make the button only as wide as needed
      margin: '5px', // Optional: Add margin for spacing
    },
  };

  return (
    <Container fluid style={style.container}>
      <Row></Row>
      <Row style={style.row}>
        <Col id="hierarchy_col">
          <h1>Select a Workspace</h1>
          {teamArray?.map((team, i) => (
            <Button
              style={style.button}
              variant={workspacePressed == i ? 'dark' : 'outline-dark'}
              key={i}
              onClick={ async () => {
                sendTeam(team.id)
                setShowNavButton(false);
                setSpaceArray([]);
                setFolderArray([]);
                setFolderlessListArray([]);
                setListArray
                await getIds(team.id);
                i === workspacePressed
                  ? setWorkspacePressed(-1)
                  : setWorkspacePressed(i);
              }}
            >
              {`${team.name} id: ${team.id}`}
            </Button>
          ))}
        </Col>
        {showNavButton ? (
          <Col>
            <h3>Find Automations</h3>
            <tr>
              <td>
                <Button
                  onClick={() => {
                    navigate('/automations');
                  }}
                >
                  Automations
                </Button>
              </td>
            </tr>
          </Col>
        ) : (
          <Row>
            {clickedTeam ? (
              <>
                <br />
                <br />
                <span className="spinner-text">
                  Collecting workspace details...
                </span>
                <br />
                <br />
                <Spinner
                  className="spinner"
                  animation="border"
                  variant="info"
                />
              </>
            ) : (
              <Col></Col>
            )}
          </Row>
        )}
      </Row>
      <Row>
        <h1>STATUS</h1>
      </Row>
      <Row>
        <h5 style={{ fontSize: 'x-small' }}>
          {' '}
          {spaceArray.length} Spaces | {folderArray.length} Folders |{' '}
          {folderlessListArray.length} Folderless Lists | {listArray.length}{' '}
          Lists
        </h5>
      </Row>
    </Container>
  );
}
