const app = require("./app");
const PORT = process.env.PORT || 3001;

async function init() {
  try {
    app.listen(PORT, () => {
      console.log("Express App Listening on Port 3001");
    });
  } catch (error) {
    console.log(error);
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

init();
