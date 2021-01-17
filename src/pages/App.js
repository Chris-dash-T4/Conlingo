import React from 'react';
import { Header, Button, Segment, List, Grid, Progress } from 'semantic-ui-react';
//import logo from './3822_FLOOSHED.png';
import Layout from '../components/Layout'
import './App.css';

const screens = { "skills":1,"lesson":2,"create":3 }
var mode = screens.skills;

const langs=["HXJ","Ol'unsih"];
function fillLangList() {
  const out = [];
  for (var i=0; i<langs.length; i++) {
    const li = (
        <List.Item>{langs[i]}</List.Item>
    );
    out.push(li);
  }
  return out;
}

const tree=[
    [{"Alphabet":[5,5]}],
    [{"Intro":[2,3]},{"Life":[1,5]}],
    [{"Grammar":[0,4]}],
    [{"Food":[0,4]},{"People":[0,4]},{"Countries":[0,4]}],
];
function isRowUnlocked(stree,r) {
  if (r===0) return true;
  let out = true;
  for (var i=0; i<stree[r-1].length; i++) {
    const ratio = Object.values(stree[r-1][i])[0]
    out &= (ratio[0]===ratio[1]);
  }
  return out;
}

function fillSkillTree() {
  const out = [];
  for (var i=0; i<tree.length; i++) {
    const row = [];
    for (var k=0; k<tree[i].length; k++) {
      const title = Object.keys(tree[i][k])[0];
      const lesson = (
          <Grid.Column>
            <Button className="lesson"
                    disabled={isRowUnlocked(tree,i)?undefined:true}
                    onClick={isRowUnlocked(tree,i)?() => {console.log(title);}:undefined}>
              {title}
            </Button>
            <Progress value={tree[i][k][title][0]}
                      total={tree[i][k][title][1]}
                      progress={isRowUnlocked(tree,i)?'ratio':undefined}
                      disabled={isRowUnlocked(tree,i)?undefined:true}
                      size="small" indicating width="96px"/>
          </Grid.Column>
      );
      row.push(lesson);
    }
    const rowTag = (
        <Grid.Row columns={tree[i].length} className="lesson_row">{row}</Grid.Row>
    );
    out.push(rowTag);
  }
  return out;
}

const Home = ({location}) => {
  return (
    <Layout>
      <div id="header_container">
        <div id="logo">
          <Segment className="title" inverted color="teal">
            <Header as='h3'>Home Page <span>{location.pathname}</span></Header>
          </Segment>
        </div>
        <div id="h_menu">
          <div className="h_item">
          </div>
          <div className="h_item">
          </div>
          <div className="h_item">
            <Button secondary>
              Learn
            </Button>
          </div>
          <div className="h_item">
            <Button secondary>
              Create
            </Button>
          </div>
        </div>
      </div>
      <div id="sidebar">
        <h3>
          <List id="lang_list">
            {fillLangList()}
          </List>
        </h3>
      </div>
      <div id="main_content">
        {fillSkillTree()}
      </div>
    </Layout>
  );
}

export default Home;
