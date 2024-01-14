import axios from 'axios';

const getListAutomations = (shard: string, listID: number, bearer: string) => {
  return axios.post(`https://${shard}.clickup.com/automation/filters/subcategory/${listID}/workflow?paging=true`, {
    headers: {
      Authorization: `Bearer: ${bearer}`,
      'Content-Type': 'application/json'
    }
  })
}

const getFolderAutomations = (shard: string, folderID: number, bearer: string) => {
  return axios.post(`https://${shard}.clickup.com/automation/filters/category/${folderID}/workflow?paging=true`, {
    headers: {
      Authorization: `Bearer: ${bearer}`,
      'Content-Type': 'application/json'
    }
  })
}

const getSpaceAutomations = (shard: string, spaceID: number, bearer: string) => {
  return axios.post(`https://${shard}.clickup.com/automation/filters/project/${spaceID}/workflow?paging=true`, {
    headers: {
      Authorization: `Bearer: ${bearer}`,
      'Content-Type': 'application/json'
    }
  })
}

export { getListAutomations, getFolderAutomations, getSpaceAutomations };