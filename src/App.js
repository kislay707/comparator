import React from 'react';

import './App.css';
import { getVideoHash, getDiffMap } from './utils';

let hash1Video = [];
let hash2Video = [];
let diffMap = [];
let gap = 0.5;



class App extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

      document.addEventListener('DOMContentLoaded', function(){
        var v1 = document.getElementById('v1');
        var v2 = document.getElementById('v2');
        var canvas = document.getElementById('c');

        var back = document.createElement('canvas');
        var backcontext = back.getContext('2d');

        var cw,ch;
        cw = v1.clientWidth;
        ch = v1.clientHeight;
        canvas.width = cw;
        canvas.height = ch;
        back.width = cw;
        back.height = ch;

        v1.currentTime = gap;
      
        v1.addEventListener('timeupdate', function(event){
          const time = event.srcElement.currentTime;
          let hash = getVideoHash(v1, backcontext, cw, ch);
          hash1Video.push(hash);
          if (time + gap  < v1.duration)
          {
            v1.currentTime = time + gap;
          } else {
            v2.currentTime = gap;
          }
        },false);
  
        v2.addEventListener('timeupdate', function(event){
          const time = event.srcElement.currentTime;
          let hash = getVideoHash(v2, backcontext, cw, ch);
          hash2Video.push(hash);
          if (time + gap < v2.duration)
          {
            v2.currentTime = time + gap;
          } else {
            console.log(hash1Video);
            console.log(hash2Video);
            diffMap = getDiffMap(hash1Video, hash2Video);
            console.log(diffMap);
          }
        },false);
      },false);
  }

  render() {
    return (
      <div>
      <h1>HTML5 Video (Press &#9658;)</h1>
      <video id="v1" controls crossOrigin="anonymous">
        <source src='https://vod-progressive.akamaized.net/exp=1625745989~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4112%2F22%2F570561221%2F2696952955.mp4~hmac=95c9834f38e8af68b705c82c013b791f72faeb1272cf1ee7f52aed1116ec6062/vimeo-prod-skyfire-std-us/01/4112/22/570561221/2696952955.mp4?filename=jl.mp4' type='video/mp4'/>
      </video>
  
      <h1>Second Video</h1>
      <video id="v2" controls crossOrigin="anonymous">
        <source src='https://vod-progressive.akamaized.net/exp=1625745985~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4112%2F22%2F570560505%2F2696950224.mp4~hmac=1f1a6c82015c81be0c8c53bcd8e41f4e7d97029e08f102289f4754409edaa46e/vimeo-prod-skyfire-std-us/01/4112/22/570560505/2696950224.mp4?filename=jl.mp4' type='video/mp4'/>
      </video>

      <h1>Rendered Canvas</h1>
      <canvas id='c'></canvas>
      </div>
    );
  }

}

export default App;
