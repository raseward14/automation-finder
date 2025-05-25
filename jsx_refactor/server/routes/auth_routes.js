const router = require("express").Router();
const { response } = require("express");

router.route("/basic").post(
  async (req, res) => {
    var encode = base64url(req.body.email + ":" + req.body.password);
    //cGJpc2hvcEBjbGlja3VwLmNvbTpQaSR0aW5lODc4OA==
    console.log(encode);
    const resp = await fetch(`https://api.clickup.com/auth/v1/login?include_teams=true`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encode}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        email: req.body.email,
        password: req.body.password,
      }),
    });
    const data = await resp.json();
    // const token = data.token;
    res.status(200).json(data);
  }
);

//getToken
router.route("/token").post(
    async (req, res) => {
        var JWT = req.body.token;
        console.log(JWT);
        const resp = await fetch(`https://id.app.clickup.com/auth/v1/tokenLogin?include_teams=true`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            cu_jwt: `Bearer ${JWT}`,
          }),
        });
        const data = await resp.json();
        console.log('token login: ', data);
        // const token = data.token;
        res.status(200).json(data);
      }
)

//get OAUTH token
router.route("/accesstoken").post(
  async (req, res) => {
  const query = new URLSearchParams({
    client_id: req.body.client_id,
    client_secret: req.body.client_secret,
    code: req.body.code,
  }).toString();

  const resp = await fetch(
    `https://api.clickup.com/api/v2/oauth/token?${query}`,
    { method: "POST" }
  );

  const data = await resp.text();
  console.log(data);
  res.send(data);
});

module.exports = router;