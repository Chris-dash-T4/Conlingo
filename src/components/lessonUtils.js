import React from 'react';
import { Button } from 'semantic-ui-react';

export const positions = {'none':0,'bank':1,'sentence':2};

export class WordOption extends React.Component {

  constructor(props) {
    super(props);
    this.lang=props.lang;
    this.state={text:props.text,move:props.move,active:props.active,disabled:props.disabled};
  }

  // Updates state when parent components update
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.active !== prevState.active) return {active: nextProps.active, disabled: nextProps.disabled }
    return nextProps.text
        ? { text: nextProps.text, move: nextProps.move, color: nextProps.color }
        : { text: prevState.text, move: prevState.move, color: prevState.color };
  }

  render() {
    //TODO format
    return (
        <Button disabled={this.state.disabled}
                onClick={this.state.move}
                active={this.state.active > 0}
                className={this.lang.toLowerCase()}>
          {this.state.text}
        </Button>
    );
  }
}

export class WordBank extends React.Component {
  constructor(props) {
    super(props);
    this.handler=props.handler;
    this.lang = props.lang;
    this.state = {
        children: props.words,
    }
  }

  /*static getDerivedStateFromProps(nextProps, prevState) {
    console.log('h');
    return nextProps.children
        ? { children: nextProps.children }
        : { children: prevState.children };
  }*/

  move(i) {
    this.handler(i);
  }

  render() {
    let cNodes = [];
    for (var i=0; i<this.state.children.length; i++) {
      let ind = i;
      const word = (
          <WordOption text={this.state.children[i]} lang={this.lang}
                      move={() => this.move(ind)} />
      );
      cNodes.push(word);
    }
    return (
        <div id="wordbank">
          {cNodes}
        </div>
    );
  }
}

export class TranslationLines extends React.Component {
  constructor(props) {
    super(props);
    this.handler = props.handler;
    this.lang = props.lang;
    this.lines = props.length/7;
    this.state = {
        children: props.words,
    }
  }

  move(i) {
    this.handler(i);
  }

  render() {
    let childs = [];
    for (var i=0; i<this.state.children.length; i++) {
      const ind = i;
      const word = (
          <WordOption text={this.state.children[i]} lang={this.lang}
                      move={() => this.move(ind)} />
      );
      childs.push(word);
    }
    let out = [];
    for (var j=0; j<this.lines; j++) {
      let local=childs.splice(0,7);
      const line = (
          <div className="final_word_container" id={"fwc"+(j+1)}>
            {local}
          </div>
      );
      out.push(line);
    }
    return (
        <div id="translation">
          {out}
        </div>
    );
  }
}

export class MultiChoice extends React.Component {
  constructor(props) {
    super(props);
    this.handler=props.handler;
    this.lang = props.lang;
    this.state = {
        children: props.opts,
        active: props.sel
    }
  }

  select(i) {
    this.handler(i);
  }

  render() {
    console.log("rendering multichoice");
    // console.log(this.state.active);
    let cNodes = [];
    for (var i=0; i<this.state.children.length; i++) {
      let ind = i;
      console.log("i="+i);
      const word = (
          <WordOption text={this.state.children[i]} lang={this.lang}
                      move={() => this.select(ind)} active={ind===this.state.active}/>
      );
      cNodes.push(word);
    }
    return (
        <Button.Group vertical fluid id="mc_list">
          {cNodes}
        </Button.Group>
    );
  }
}

export class MatchCols extends React.Component {
  constructor(props) {
    super(props);
    this.l_handler=props.l_handler;
    this.r_handler=props.r_handler;
    this.l_lang = props.natlang;
    this.r_lang = props.lang;
    this.state = {
        children: props.pairs,
        active: props.sel,
        matched: []
    }
  }

  selectRight(i) {
    this.r_handler(i);
  }

  selectLeft(i) {
    this.l_handler(i);
  }

  isMatched(i,col) {
    for (var j=0; j<this.state.matched.length; j++) {
      if (this.state.matched[j][col]===i) return true;
    }
    return false;
  }

  render() {
    console.log("rendering matching");
    console.log(this.state.active);
    let leftNodes = [];
    let rightNodes = [];
    for (var i=0; i<this.state.children[0].length; i++) {
      let ind = i;
      console.log("i="+i);
      const l_n = (
          <WordOption text={this.state.children[0][i]} lang={this.l_lang}
                      move={() => this.selectLeft(ind)}
                      active={ind===this.state.active[0]}
                      disabled={this.isMatched(ind,0)}/>
      );
      const r_n = (
          <WordOption text={this.state.children[1][i]} lang={this.r_lang}
                      move={() => this.selectRight(ind)}
                      active={ind===this.state.active[1]}
                      disabled={this.isMatched(ind,1)}/>
      );
      leftNodes.push(l_n);
      rightNodes.push(r_n);
    }
    return (
        <>
          <Button.Group vertical floated='left' id="match_l">
            {leftNodes}
          </Button.Group>
          <Button.Group vertical floated='right' id="match_r">
            {rightNodes}
          </Button.Group>
        </>
    );
  }
}

/*
export class SentenceBox extends React.Component {
  constructor(props) {
    super(props);
    this.state
}*/
