import React from 'react';
import hasher from 'node-object-hash';
import pixelmatch from 'pixelmatch';
import imghash from 'imghash';
import leven from 'leven';
import logo from './logo.svg';
import './App.css';
import { getVideoHash, getDiffMap } from './utils';

let finalData = [];
let hashArray = [];

let hash1Video = [];
let hash2Video = [];
let diffMap = [];
let gap = 0.5;

let count = 0;
var hashCoerce = hasher({sort:false, coerce:false});


class App extends React.Component {

  constructor(props) {
    super(props);
    //this.finalData = [];
  }

  componentDidMount() {

      document.addEventListener('DOMContentLoaded', function(){
        var v1 = document.getElementById('v1');
        var v2 = document.getElementById('v2');
        var canvas = document.getElementById('c');
        var context = canvas.getContext('2d');

        // clean code
        var back = document.createElement('canvas');
        var backcontext = back.getContext('2d');

        var cw,ch;
        cw = v1.clientWidth;
        ch = v1.clientHeight;
        canvas.width = cw;
        canvas.height = ch;
        back.width = cw;
        back.height = ch;

        var back1 = document.createElement('canvas');
        var backcontext1 = back1.getContext('2d');
        var back2 = document.createElement('canvas');
        var backcontext2 = back2.getContext('2d');
        
    
        v1.currentTime = gap;

        v1.addEventListener('play', function(){
          cw = v1.clientWidth;
          ch = v1.clientHeight;
          canvas.width = cw;
          canvas.height = ch;
          back.width = cw;
          back.height = ch;
          //draw(v1,context,backcontext,cw,ch);
        },false);
      
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
  
        v1.addEventListener('ended', function(){

          console.log(finalData);
          console.log(count);
          console.log(hashArray);
          finalData=[];
          hashArray=[];
        },false);


        v2.addEventListener('play', function(){
          cw = v2.clientWidth;
          ch = v2.clientHeight;
          canvas.width = cw;
          canvas.height = ch;
          back.width = cw;
          back.height = ch;
          //draw(v2,context,backcontext,cw,ch);
        },false);
      
        v2.addEventListener('ended', function(){
          console.log(finalData);
          console.log(count);
          console.log(hashArray);
          finalData=[];
          hashArray=[];
        },false);
      },false);
      
      function draw(v1, v2,c,bc1, bc2,w,h) {
        //if(v.paused || v.ended)	return false;
        // First, draw it into the backing canvas
        bc1.drawImage(v1,0,0,w,h);
        // Grab the pixel data from the backing canvas
        var idata1 = bc1.getImageData(0,0,w,h);
        var data1 = idata1.data;


        bc2.drawImage(v2,0,0,w,h);
        // Grab the pixel data from the backing canvas
        var idata2 = bc2.getImageData(0,0,w,h);
        var data2 = idata2.data;

        //var diff;
        var canvas = document.getElementById('c');


        let cw = v2.clientWidth;
          let ch = v2.clientHeight;
          //var canvas = document.getElementById('c');
          canvas.width = cw;
          canvas.height = ch;

        var context = canvas.getContext('2d');
        const diff = context.createImageData(w, h);

        const hash1 = imghash.hashRaw(idata1, 32);
        const hash2 = imghash.hashRaw(idata2, 32);
        const distance = leven(hash1, hash2);
         console.log(distance);
        // console.log(hash1);
        // console.log(hash2);
        if (distance <= 20) {
          console.log("Images are similar");
        } else {
          console.log("Images are NOT similar");
        }
        pixelmatch(data1, data2, diff.data, w, h, {threshold: 0.2, includeAA: true, alpha: 0});
        //console.log(diff);
        
          context.putImageData(diff,0,0);
        // Loop through the pixels, turning them grayscale
        // for(var i = 0; i < data.length; i+=4) {
        //   var r = data[i];
        //   var g = data[i+1];
        //   var b = data[i+2];
        //   var brightness = (3*r+4*g+b)>>>3;
        //   data[i] = brightness;
        //   data[i+1] = brightness;
        //   data[i+2] = brightness;
        // }



        //idata.data = data;
        // finalData.push(data);
        // hashArray.push(hashCoerce.hash(data));
        // count++;
        // const newObj = new ImageData(data, idata.width, idata.height);
        // //newObj.data = data;
        // //const tempObj = {...idata};

        // // Draw the pixels onto the visible canvas
        // c.putImageData(newObj,0,0);
        // Start over!
        //setTimeout(draw,1000,v,c,bc,w,h);
      }
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
