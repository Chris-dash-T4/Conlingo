import React from 'react';
import Layout from '../components/Layout'
import { Router, Link } from "@reach/router"
import { Button, Segment, Progress } from 'semantic-ui-react';
import MyInfo from '../components/lessonContent.js'

const Lesson = ({location}) => {
  let lang = location.pathname.split("/lesson")[1];
  return (
    <Layout>
      <div id="progressbar">
        <Progress color="green" percent={0} indicating/>
      </div>
      <Router basepath="/lesson">
          <MyInfo path={lang}/>
      </Router>
    </Layout>
  );
}

export default Lesson;
