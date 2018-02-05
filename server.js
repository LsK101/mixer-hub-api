 const express = require('express');
 const app = express();

 const PORT = process.env.PORT || 5000;

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

 app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

 module.exports = {app};