import React from 'react';
import Layout from '../components/Layout'
import { Router, Link } from "@reach/router"
import { Button, Segment, Progress } from 'semantic-ui-react';
import LessonContent from '../components/lessonContent.js'

const Lesson = ({location, pageContext}) => {
  let pathData = location.pathname.slice(1).split("/");
  if (pathData[0] !== "lesson") return (
    <Layout>
      <img src="https://clipartcraft.com/images/troll-face-transparent-5.png" />
    </Layout>
  );
  console.log(pathData);
  let lang = pathData[1];
  let skill = pathData[2];
  let lesson = pathData[3];
  // `lang' is basically a UID for a particular lesson
  console.log((pageContext.data));
  //console.log(lang);
  let lessonData = undefined;
  if (pageContext.data[lang] && pageContext.data[lang][skill]
      && pageContext.data[lang][skill][lesson])
        lessonData = pageContext.data[lang][skill][lesson];
  if (!lessonData || !pageContext.data[lang].name) return (
    <Layout>
      <img src="https://clipartcraft.com/images/troll-face-transparent-5.png" />
    </Layout>
  );
  console.log(lessonData);
  return (
    <Layout>
      <Router basepath="/lesson">
          <LessonContent path={[lang,skill,lesson].join("/")} data={lessonData} langName={pageContext.data[lang].name}/>
      </Router>
    </Layout>
  );
}

export default Lesson;
