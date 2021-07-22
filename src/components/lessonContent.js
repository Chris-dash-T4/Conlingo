import React from 'react'
import { Button, Card, Form } from 'semantic-ui-react';
import './lesson.css'
import { positions, WordOption, WordBank, TranslationLines } from './lessonUtils.js';

let currPrompt = "click to add text";
let clong_name = "bruh";
let strip_punct = (s) => {
    s.replace('.','').replace(',','').replace("'",'').replace('"','').replace(';','').replace(':','').replace('!','').replace('?','').replace('\n','');
}
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

function waitUntil(param, test = (x => x), time = 3000) {
  return new Promise((resolve,reject) => {
    var start_time = Date.now();
    function checkFlag() {
      console.log(param.value);
      if (test(param.value)) {
        console.log('met');
        resolve();
      } else if (Date.now() > start_time + time) {
        console.log('not met, time out');
        reject();
      } else {
        window.setTimeout(checkFlag, 1000);
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
    console.log(props.parent);
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
      let bank_em = [];
      for (i=0; i<this.choices.length; i++) {
        // TODO implement font features
        const index = i;
        const position = positions.bank;
        const bank_w = (
            <WordOption text={this.choices[i]} lang={lang} pos={position}/>
        );
        bank_em.push(bank_w);
      }
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
      let list_em = [];
      for (i=0; i<this.choices.length; i++) {
        // TODO implement font features
        const index = i;
        const mcc = (
            <Button className="mc_choice" id={"mcc"+i}
                     onclick={console.log(index)}>
              {this.choices[i]}
            </Button>
        );
        list_em.push(mcc);
      }
      this.state.content = (
          <div id="question_content">
            <div id="original">
              {this.phrase}
            </div>
            <div id="mc_list">
              {list_em}
            </div>
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
              <Form.TextArea label="response" id="sentence"
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
      for (i=0;i<this.choices.length;i++) {
        words.push([this.choices[i][0],true]);
        words.push([this.choices[i][1],false]);
      }
      words=shuffle(words);
      let pair_em = [];
      for (i=0;i<words.length;i++) {
        const pair_w = (
            <Button className="mp_opt" onClick={() => {this.onePair(i)}}>
              {words[i][0]}
            </Button>
        );
        pair_em.push(pair_w);
      }
      this.state.content = (
          <div id="question_content">
            <div id="pair_container">
              {pair_em}
            </div>
          </div>
      );
      setPrompt("Match the pairs.");
    }
    this.ready = true;
    console.log('troled once again');
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

  verify() {
    var fin_tr="";
    var i;
    var j;
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
      const choices = document.getElementsByClassName("mc_choice");
      var fin_ch;
      for (i=0;i<choices.length;i++){
        if (choices.item(i).style.backgroundColor !== "") {
          fin_ch=choices.item(i);
          fin_tr=fin_ch.innerText;
        }
      }
      if (fin_ch===null) {return false;}
      console.log('"'+fin_tr+'"');
      if (fin_tr===this.translation[0]) {
        fin_ch.style.backgroundColor="#77f";
        return true;
      }
      else {
        console.log("Expected:"+this.translation+"\nReceived:"+fin_tr);
        fin_ch.style.backgroundColor="#f77";
        for (i=0;i<choices.length;i++){
          if (choices.item(i).innerText === this.translation[0]) {
            choices.item(i).style.backgroundColor="#7f7";
          }
        }
        return false;
      }
    }//^^ multiple choice
    if (this.type===Question.sentence) {
      const fin_em = document.getElementById("sentence");
      fin_tr=fin_em.value.toLowerCase();
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
      if (this.choices.length === 0) {
        return true;
      }
    }
    return false;
  }

  onePair(n) {
    console.log('1p');
  }

  twoPair(n,pair_em,other,item) {
    console.log('2p');
  }

  checkAns(update) {
    console.log("check");
    this.par.toggleClick();
    const correct = this.verify();
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
      this.qs=[]; // TODO load from db/json
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
      this.qs.push([sample1,Question.bank]);
      this.qs.push([sample2,Question.bank]);
      this.qs.push([sample3,Question.multichoice]);
      this.qs.push([sample4,Question.sentence]);
      this.qs.push([sample5,Question.bank]);
      this.qs.push([sample6,Question.matching]);

      const dat_out=JSON.stringify(this.qs);
      console.log(dat_out);
      this.state = {checkDisabled: false, answering: true, currPrompt: "click to add text"};

      this.state.content = (
            <>
              <div id="prompt_aln">
                <h2 id="prompt">{this.state.currPrompt}</h2>
              </div>
              <Question type={this.qs[0][1]} phrase={this.qs[0][0].phrase}
                        translation={this.qs[0][0].translation} prompter={this.setPrompt.bind(this)}
                        choices={this.qs[0][0].choices} ref={ref => {this.state.q_c = ref}}
                        eng={this.qs[0][0].eng} clong={this.qs[0][0].clong} parent={this}/>
              <div id="checkbar" style={this.state.answering?{}:{backgroundColor: this.state.barColor}}>
                <div id="checktext">
                    {this.state.barText}
                </div>
                {/*!this.state.answering && <Card />*/}
                <Button id="continuebutton" disabled={!this.state.aaaaaaa}
                        onClick={() => this.state.q_c.checkAns(this.displayStatus.bind(this))} positive>
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

      waitUntil({'value': this.state.q_c}, undefined, 10000).then(() => console.log('troled'), () => console.log('no'));
      //this.refreshContent();
  }

  refreshContent() {
    this.setState({content: (
          <>
            <div id="prompt_aln">
              <h2 id="prompt">{this.state.currPrompt}</h2>
            </div>
            <Question type={this.qs[0][1]} phrase={this.qs[0][0].phrase}
                      translation={this.qs[0][0].translation} prompter={this.setPrompt.bind(this)}
                      choices={this.qs[0][0].choices} ref={ref => {this.state.q_c = ref}}
                      eng={this.qs[0][0].eng} clong={this.qs[0][0].clong} parent={this}/>
            <div id="checkbar" style={this.state.answering?{}:{backgroundColor: this.state.barColor}}>
              <div id="checktext">
                  {this.state.barText}
              </div>
              {/*!this.state.answering && <Card />*/}
              <Button id="continuebutton" disabled={this.state.checkDisabled}
                      onClick={() => this.state.q_c.checkAns(this.displayStatus.bind(this))} positive>
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

  // Functions for child elements to use
  toggleClick() {
    this.setState({answering: !this.state.answering});
  }

  setPrompt(p) {
    this.setState({currPrompt: p});
    this.refreshContent();
  }

  displayStatus(correct,ans) {
    console.log("perkele");
    let text = "";
    if (correct==2) {
      text="Correct. Another correct response is '"+ans+"'.";
    }
    else if (correct) {
      text="Correct. Good job!";
    }
    else {
      text="The correct answer was '"+ans+"'."
    }
    this.setState({barColor: correct?"#0f0":"#f00", barText: text})
    this.refreshContent();
  }

  render() {
    console.log("dis ben gerendeered");
    console.log(this.state.content);
    return this.state.content;
  }
}

const MyInfo = (props) => {
  return (
    <QuestionContainer path={props.path}/>
  );
}

export default MyInfo
