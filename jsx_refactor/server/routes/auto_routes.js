const router = require("express").Router();

// get shard
router.route("/shard").post(
    async (req, res) => {
        const teamId = req.body.teamId;
        try {
            const response = await fetch(
                `https://app.clickup.com/shard/v1/handshake/${teamId}`,
                { method: "GET" }
            );
            const data = await response.json();
            const shard = data.shardId;
            res.status(200).json(shard);
        } catch (err) {
            res.status(500).json(err);
        }
    }
);

// get Automation by trigger_id
router.route("/trigger").post(
    async (req, res) => {
        const shard = req.body.shard;
        const triggerId = req.body.triggerId;
        const token = req.body.bearer;
        try {
            const response = await fetch(
                `https://${shard}.clickup.com/automation/workflow/${triggerId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
);

// get task endpoint:
// https://prod-us-west-2-2.clickup.com/tasks/v2/task
// the body is a JSON array of task_id strings {"task_ids": ["866aahpu1"]}
router.route("/getTasks").post(
    async (req, res) => {
        const shard = req.body.shard;
        const taskIds = JSON.stringify({ "task_ids": req.body.taskIds });
        const token = req.body.bearer;
        console.log(taskIds)
        try {
            const response = await fetch(`https://${shard}.clickup.com/tasks/v2/task`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                    body: taskIds
                }
            );
            const data = await response.json();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: "An error occurred", details: err });
        }
    }
)

// get Custom Field endpoint:
// https://prod-us-west-2-2.clickup.com/customFields/v2/field/7c4f6f29-23cf-4af4-a9c1-6c2943b2c23b
// auth'd with the same bearer token - inclu
router.route("/customField").post(
    async (req, res) => {
        const shard = req.body.shard;
        const fieldId = req.body.fieldId;
        const token = req.body.bearer;
        try {
            const response = await fetch(`https://${shard}.clickup.com/customFields/v2/field/${fieldId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
)

// get Workspace members endpoint:
// https://prod-us-west-2-2.clickup.com/user/v1/team/10618731/member
router.route("/members").post(
    async (req, res) => {
        const shard = req.body.shard;
        const teamId = req.body.teamId;
        const token = req.body.bearer;
        try {
            const response = await fetch(`https://${shard}.clickup.com/user/v1/team/${teamId}/member`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
)

// get Workspace teams (user groups)
router.route("/userTeams").post(
    async (req, res) => {
        const shard = req.body.shard;
        const teamId = req.body.teamId;
        const token = req.body.bearer;
        try {
            const response = await fetch(`https://${shard}.clickup.com/user/v1/team/${teamId}/group`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
)


// List
// https://{shard}.clickup.com/hierarchy/v1/subcategory/{list_id}
// endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})
router.route("/listStatus").post(
    async (req, res) => {
        const shard = req.body.shard;
        const locationId = req.body.locationId;
        const token = req.body.bearer;
        try {
            const response = await fetch(`https://${shard}.clickup.com/hierarchy/v1/subcategory/${locationId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            res.status(200).json(data?.statuses);
        } catch (err) {
            res.status(500).json(err);
        }
    }
)

// Folder
// https://{shard}.clickup.com/hierarchy/v1/category/{Folder_id}
// endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})
router.route("/folderStatus").post(
    async (req, res) => {
        const shard = req.body.shard;
        const locationId = req.body.locationId;
        const token = req.body.bearer;
        try {
            const response = await fetch(`https://${shard}.clickup.com/hierarchy/v1/category/${locationId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            res.status(200).json(data?.statuses);
        } catch (err) {
            res.status(500).json(err)
        }
    }
)

// Space
// https://{shard}.clickup.com/hierarchy/v1/project/{space_id}
// endpoints for statuses -> req.data.statuses (array of objects { "id": "", "status": "text name", "orderindex": 0, "color": "#87909e", "type": "open"/"custom"/"closed"})
router.route("/spaceStatus").post(
    async (req, res) => {
        const shard = req.body.shard;
        const locationId = req.body.locationId;
        const token = req.body.bearer;
        try {
            const response = await fetch(`https://${shard}.clickup.com/hierarchy/v1/project/${locationId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            res.status(200).json(data?.statuses);
        } catch (err) {
            res.status(500).json(err)
        }
    }
)

module.exports = router;