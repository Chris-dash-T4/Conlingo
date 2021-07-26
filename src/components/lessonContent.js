import React from 'react'
import { Button, Card, Form } from 'semantic-ui-react';
import './lesson.css'
import { positions, WordOption, WordBank, TranslationLines, MultiChoice, MatchCols } from './lessonUtils.js';

// TODO import from JSON input
let currPrompt = "click to add text";
let clong_name = "bruh";

//vars so thing doesn't break
var success_a;
var fail_a;

//utils
export function shuffle(array) {
  if (array==null) { return null; }
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function subset(a, obj) {
    var inv = []; //populate inverse of obj
    var j;//could work for up to 3? only doing sets of to so far at present so no biggie
    for (j=obj.length-1;j>=0;j--) {inv.push(obj[j]);}
    var i = a.length;
    while (i--) {
       if (arraysEqual(a[i],obj) || arraysEqual(a[i],inv)) {
           return i+1; //returning i yielded problems with returning false at i=0
       }
    }
    return false;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function equiv(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
}

// lambdas
const strip_punct = (s) => {
    return s.replace('.','').replace(',','').replace("'",'').replace('"','').replace(';','').replace(':','').replace('!','').replace('?','').replace('\n','');
}
const noop = require('node-noop').noop;
const findmatch = (xs, y, eq) => xs.map(x => eq(x,y)).indexOf(true);

function waitUntil(param, test = (x => x), time = 3000) {
  //console.log('helo');
  return new Promise((resolve,reject) => {
    var start_time = Date.now();
    function checkFlag() {
      console.log(param);
      if (test(param)) {
        console.log('met');
        resolve();
      } else if (Date.now() > start_time + time) {
        console.log('not met, time out');
        reject();
      } else {
        window.setTimeout(checkFlag, 100);
      }
    }
    checkFlag();
  });
}

class Question extends React.Component {
  static get bank() { return 0; }
  static get multichoice() { return 1; }
  static get sentence() { return 5; }
  static get matching() { return 9; }

  constructor(props) {
    super(props);
    //console.log(props.parent);
    //props will be a dictionary object containing various attributes
    this.type=props.type;
    this.phrase = props.phrase;
    this.translation = props.translation;
    this.choices = shuffle(props.choices);
    this.clong=props.clong;
    const lang=(this.clong?clong_name:"English");
    this.children={};
    this.state={
        bank: this.choices,
        lines: [],
        content:null,
    };
    this.par = props.parent
    //undefined elements will not be used with the given Question type
    let setPrompt = props.prompter;
    setPrompt("Write this in "+lang+".");
    var i;
    if (this.type === Question.bank) {
      this.state.content = (
          <div id="question_content">
            <div id="original">
              {this.phrase}
            </div>
            <TranslationLines handler={this.toBank.bind(this)} lang={lang}
                              ref={ref => (this.children.lines = ref)}
                              setState={state => this.setState(state)}
                              words={this.state.lines}
                              length={this.choices.length} />
            <WordBank handler={this.toLines.bind(this)} lang={lang}
                      ref={ref => (this.children.bank = ref)}
                      setState={state => this.setState(state)}
                      words={this.state.bank} />
          </div>
      );
    }
    if (this.type === Question.multichoice) {
      this.state.selection = -1;
      this.state.content = (
          <div id="question_content">
            <div id="original">
              {this.phrase}
            </div>
            <MultiChoice lang={lang} opts={this.choices}
                         sel={this.state.selection}
                         handler={this.mc_select.bind(this)}
                         ref={ref => (this.children.mc = ref)}/>
          </div>
      );
      setPrompt("Select the correct translation.");
    }
    if (this.type === Question.sentence) {
      this.state.content = (
          <div id="question_content">
            <div id="original">
              {this.phrase}
            </div>
            <Form id="sentence_container">
              <Form.TextArea id="sentence"
                             placeholder={'Enter '+lang+' text...'} />
            </Form>
          </div>
      );
      for (i=0;i<props.translation.length;i++) {
        this.translation[i]=strip_punct(props.translation[i].toLowerCase());
      }
    }
    if (this.type === Question.matching) {
      this.choices = props.choices;
      var words = []
      words.push(shuffle(this.choices.map(x => x[0])));
      words.push(shuffle(this.choices.map(x => x[1])));
      this.pairs = [];
      for (i=0;i<this.choices.length;i++) {
        this.pairs.push([
            words[0].indexOf(this.choices[i][0]),
            words[1].indexOf(this.choices[i][1])
        ]);
        // This should contain no duplicates so long as the input contains
        // no duplicates
      }
      console.log(this.pairs);
      this.state.selection = [-1,-1];
      this.state.content = (
          <div id="question_content">
            <MatchCols lang={lang} pairs={words} natlang={"English"}
                       sel={this.state.selection}
                       l_handler={this.onePair.bind(this)}
                       r_handler={this.twoPair.bind(this)}
                       ref={ref => (this.children.match = ref)}/>
          </div>
      );
      setPrompt("Match the pairs.");
    }
    this.ready = true;
    //console.log('troled once again');
  }

  toLines(i) {
    if (this.par.state.answering) {
      let bank = this.state.bank.slice(0);
      let rem = bank.splice(i,1);
      let lines = this.state.lines.concat(rem);
      this.setState({
          bank: bank,
          lines: lines,
      });
      this.children.bank.setState({
        children: bank,
      });
      this.children.lines.setState({
        children: lines,
      });
    }
  }

  toBank(i) {
    if (this.par.state.answering) {
      let lines = this.state.lines.slice(0);
      let rem = lines.splice(i,1);
      let bank = this.state.bank.concat(rem);
      this.setState({
        bank: bank,
        lines: lines,
      });
      this.children.bank.setState({
        children: bank,
      });
      this.children.lines.setState({
        children: lines,
      });
    }
  }

  mc_select(n) {
    let sel = n;
    if (n===this.state.selection) sel=-1;
    this.setState({selection: sel});
    this.children.mc.setState({active: sel});
  }

  checkPair() {
    let p = findmatch(this.pairs,this.state.selection,arraysEqual);
    console.log(this.pairs);
    console.log(this.state.selection);
    console.log(this.pairs.map(x=>x[0]).indexOf(this.state.selection[0]));
    if (p < 0) {
      fail_a.play();
      this.setState({selection: [-1,-1]});
      this.children.match.setState({active: [-1,-1]});
    } else {
      let matches = [...this.children.match.state.matched];
      matches.push(this.pairs[p]);
      this.pairs.splice(p,1);
      this.setState({selection: [-1,-1]});
      this.children.match.setState({active: [-1,-1], matched: matches});
      if (this.pairs.length===0)
        this.par.checkCurrent();
    }
  }

  onePair(n) {
    let selection = [...this.state.selection];
    selection[0] = n;
    this.setState({selection});
    this.children.match.setState({active: selection});
    console.log('1p');
    waitUntil(this, o=>o.state.selection.indexOf(-1)===-1).then(this.checkPair.bind(this),noop);
    //if (selection.indexOf(-1)===-1) this.checkPair();
  }

  twoPair(n) {
    let selection = [...this.state.selection];
    selection[1] = n;
    this.setState({selection});
    this.children.match.setState({active: selection});
    console.log('2p');
    //if (selection.indexOf(-1)===-1) this.checkPair();
  }

  verify() {
    var fin_tr="";
    var i;
    if (this.type===Question.bank) {
      fin_tr = this.state.lines.join(' ');
      console.log('"'+fin_tr+'"');
      if (fin_tr===this.translation[0]) {
        return true;
      }
      else if (this.translation.length > 1) {
        for (i=1;i<this.translation.length;i++) {
          if (fin_tr===this.translation[i]) { return 2; }
        }
      }
      else {
        console.log("Expected:"+this.translation+"\nReceived:"+fin_tr);
        return false;
      }
    }//^^ wordbank
    if (this.type===Question.multichoice) {
      if (this.state.selection === -1) {return -1;}
      fin_tr=this.choices[this.state.selection];
      console.log('"'+fin_tr+'"');
      if (fin_tr===this.translation[0]) {
        /*let mcColor=this.choices.map(x => undefined);
        mcColor[i0] = "green";
        this.setState({mcColor});*/
        return true;
      }
      else {
        console.log("Expected:"+this.translation+"\nReceived:"+fin_tr);
        /*let mcColor=this.choices.map(x => undefined);
        mcColor[i0] = "red";
        for (i=0;i<this.choices.length;i++){
          if (this.choices[i] === this.translation[0]) {
            mcColor[i] = "green";
          }
        }
        this.setState({mcColor});*/
        return false;
      }
    }//^^ multiple choice
    if (this.type===Question.sentence) {
      const fin_em = document.getElementById("sentence");
      fin_tr=strip_punct(fin_em.value.toLowerCase());
      console.log('"'+fin_tr+'"');
      if (fin_tr===this.translation[0]) {
        return true;
      }
      else if (this.translation.length > 1) {
        for (i=1;i<this.translation.length;i++) {
          console.log(this.translation[i]);
          if (fin_tr===this.translation[i]) { return 2; }
        }
      }
      else {
        console.log("Expected:"+this.translation+"\nReceived:"+fin_tr);
      }
    }//^^ sentence entry
    if (this.type===Question.matching) {
      if (this.pairs.length === 0) return true;
      else return -1;
    }
    return false;
  }

  checkAns(update) {
    console.log("check");
    this.par.toggleClick();
    const correct = this.verify();
    if (correct === -1) {
      this.par.toggleClick();
      return;
    }
    if (!this.translation) this.translation=[undefined];
    update(correct, this.translation[0]);
    if (correct) {
      success_a.play();
    }
    else {
      fail_a.play();
    }
  }

  render() {
    return (
        <>
        {this.state.content}
        </>
    );
  }
}

class QuestionContainer extends React.Component {
  constructor(props) {
      super();
      this.clong_name=props.lang;
      console.log(this.clong_name);
      let q_data=[]; // TODO load from db/json
      const sample1 = {
            "phrase":"Man.",
            "translation":["Horse"],
            "choices":["Horse","cow","Hubert","Horse","cow","Hubert","Horse"],
            "eng":0,"clong":1
      }
      const sample2 = {
            "phrase":"Click to add text.",
            "translation":["Jebo li te pas","Jebo li li te pas"],
            "choices":["pas","Jebo","radio","te","li","li te","crni"],
            "eng":0,"clong":1
      }
      const sample3 = {
            "phrase":"Man.",
            "translation":["Horse."],
            "choices":["Horse.","Jebo li te pas.","West text."],
            "eng":0,"clong":1
      }
      const sample4 = {
            "phrase":"Man.",
            "translation":["Horse."],
            "eng":0,"clong":1
      }
      const sample5 = {
            "phrase":"Horse.",
            "translation":["Man"],
            "choices":["Man","sauce","click","to","add","text","funny"],
            "eng":1,"clong":0
      }
      const sample6 = {
            "choices":[["man","horse"],["sauce","sus"],["click","jebo"],["to add","li te"],["text","pas"],["funny","haaah"]],
            "eng":1,"clong":1
      }
      q_data.push([sample1,Question.bank]);
      q_data.push([sample2,Question.bank]);
      q_data.push([sample3,Question.multichoice]);
      q_data.push([sample4,Question.sentence]);
      q_data.push([sample5,Question.bank]);
      q_data.push([sample6,Question.matching]);

      const qs = [];
      const refs = q_data.map(x=>null);
      for (var i = 0; i < q_data.length; i++) {
        let j = i;
        const q_n = (
            <Question type={q_data[j][1]} phrase={q_data[j][0].phrase}
                      translation={q_data[j][0].translation} prompter={this.setPrompt.bind(this)}
                      choices={q_data[j][0].choices} ref={ref => {if (ref && refs[j] == null) refs[j]=ref; console.log(j); console.log(ref);}}
                      eng={q_data[j][0].eng} clong={q_data[j][0].clong} parent={this}/>
            );
        qs.push(q_n);
      }
      this.q_data = q_data;

      const dat_out=JSON.stringify(this.qs);
      console.log(dat_out);
      this.state = {checkDisabled: false, answering: true, currPrompt: "click to add text", qs, refs, q_c: 0};

      this.state.content = (
            <>
              <div id="prompt_aln">
                <h2 id="prompt">{this.state.currPrompt}</h2>
              </div>
              {this.state.qs.map((x,i) => i===this.state.q_c && x)}
              <div id="checkbar" style={this.state.answering?{}:{backgroundColor: this.state.barColor}}>
                <div id="checktext">
                    {this.state.barText}
                </div>
                {/*!this.state.answering && <Card />*/}
                <Button id="continuebutton" disabled={this.state.checkDisabled}
                        onClick={this.state.answering?() => this.state.refs[this.state.q_c].checkAns(this.displayStatus.bind(this)):this.nextQuestion.bind(this)}
                        positive>
                  {this.state.answering?"Check":"Next"}
                </Button>
                <audio className="success" ref={ref => {success_a = ref}}>
                  <source src="http://soundfxcenter.com/video-games/super-mario-bros/8d82b5_Super_Mario_Bros_Coin_Sound_Effect.mp3"></source>
                </audio>
                <audio className="fail" ref={ref => {fail_a = ref}}>
                  <source src="https://vignette.wikia.nocookie.net/soundeffects/images/6/65/Question_Block_Hit.ogg"></source>
                </audio>
              </div>
            </>
      );

      waitUntil(this, o => (o.state.refs[this.state.q_c] && o.state.refs[this.state.q_c].ready)).then(this.refreshContent.bind(this), () => console.log('no'));
  }

  refreshContent() {
    this.setState({content: (
          <>
            <div id="prompt_aln">
              <h2 id="prompt">{this.state.currPrompt}</h2>
            </div>
            {this.state.qs.map((x,i) => i===this.state.q_c && x)}
            <div id="checkbar" style={this.state.answering?{}:{backgroundColor: this.state.barColor}}>
              <div id="checktext">
                  {this.state.barText}
              </div>
              {/*!this.state.answering && <Card />*/}
              <Button id="continuebutton" disabled={this.state.checkDisabled}
                      onClick={this.state.answering?() => this.state.refs[this.state.q_c].checkAns(this.displayStatus.bind(this)):this.nextQuestion.bind(this)}
                      positive>
                {this.state.answering?"Check":"Next"}
              </Button>
              <audio className="success" ref={ref => {success_a = ref}}>
                <source src="http://soundfxcenter.com/video-games/super-mario-bros/8d82b5_Super_Mario_Bros_Coin_Sound_Effect.mp3"></source>
              </audio>
              <audio className="fail" ref={ref => {fail_a = ref}}>
                <source src="https://vignette.wikia.nocookie.net/soundeffects/images/6/65/Question_Block_Hit.ogg"></source>
              </audio>
            </div>
          </>
        )});
  }

  checkCurrent() {
      this.state.refs[this.state.q_c].checkAns(this.displayStatus.bind(this));
  }

  // Functions for child elements to use
  toggleClick() {
    this.setState({answering: !this.state.answering});
  }

  setPrompt(p) {
    this.setState({currPrompt: p});
    //this.refreshContent();
  }

  reappendQuestion(index) {
    let qs = [...this.state.qs];
    let refs = this.state.refs;
    refs.push(null);
    const q_n = (
        <Question type={this.q_data[index][1]} phrase={this.q_data[index][0].phrase}
                  translation={this.q_data[index][0].translation} prompter={this.setPrompt.bind(this)}
                  choices={this.q_data[index][0].choices} ref={ref => {if (ref /*&& refs.length == qs.length - 1*/) refs[refs.length-1] = ref;}}
                  eng={this.q_data[index][0].eng} clong={this.q_data[index][0].clong} parent={this}/>
        );
    qs.push(q_n);
    //refs.push(refs[index]);
    this.setState({qs, refs});
    return;
  }

  displayStatus(correct,ans) {
    let text = "";
    let refs = this.state.refs;
    if (correct===2) {
      text="Correct. Another correct response is '"+ans+"'.";
    }
    else if (correct) {
      text="Correct. Good job!";
    }
    else {
      text="The correct answer was '"+ans+"'."
      this.reappendQuestion(this.state.q_c);
      //qs.push(qs[0]);
      //refs.push(refs[0]);
    }
    this.setState({barColor: correct?"#0f0":"#f00", barText: text})
    waitUntil(this, o => o.state.barColor && o.state.barText).then(this.refreshContent.bind(this), () => console.log('bre'));
  }

  nextQuestion() {
    if (this.state.q_c + 1 === this.state.qs.length) {
      window.location.href = "/";
    }
    this.setState({barColor: undefined, barText: "", q_c: this.state.q_c+1})
    this.toggleClick();
    this.refreshContent();
    waitUntil(this, o => (o.state.refs[this.state.q_c] && o.state.refs[this.state.q_c].ready)).then(this.refreshContent.bind(this), () => console.log('no'));
  }

  render() {
    //console.log("dis ben gerendeered");
    //console.log(this.state.content);
    return this.state.content;
  }
}

const MyInfo = (props) => {
  return (
    <QuestionContainer path={props.path}/>
  );
}

export default MyInfo
