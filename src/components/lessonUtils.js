import React from 'react';
import { Button } from 'semantic-ui-react';

export const positions = {'none':0,'bank':1,'sentence':2};

export class WordOption extends React.Component {

  constructor(props) {
    super(props);
    this.lang=props.lang;
    this.state={text:props.text,move:props.move};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.text
        ? { text: nextProps.text, move: nextProps.move }
        : { text: prevState.text, move: prevState.move };
  }

  render() {
    //TODO format
    return (
        <Button disabled={this.state.disabled}
                onClick={this.state.move}>
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

  /*static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.children
        ? { children: nextProps.children }
        : { children: prevState.children };
  }*/

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
