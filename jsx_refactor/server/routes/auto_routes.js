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
        console.log(req.body)
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

module.exports = router;