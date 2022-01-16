const fs = require('fs');
const path = require("path");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: { "../../theme.config$": path.join(__dirname,  "src/semantic/theme.config")}
    }
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  if (page.path.match(/^\/lesson/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/lesson/*"
    //fs.writeFile("./example.txt","test", () => {console.log('troled')});
    fs.readFile("public/lesson-data/lessons.json", (err,data) => {
        let lessons = JSON.parse(data)
        console.log(JSON.parse(data));
        console.log(lessons);
        page.context = {info: page.path, data: lessons}
        createPage(page)
    });
  }
  if (page.path.match(/^\/learn/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/learn/*"
    //fs.writeFile("./example.txt","test", () => {console.log('troled')});
    fs.readFile("public/lesson-data/skills.json", (err,data) => {
        if (err) console.error(err);
        let trees = JSON.parse(data)
        console.log(JSON.parse(data));
        page.context = {info: page.path, data: trees}
        createPage(page)
    });
    //createPage(page)
  }
}
