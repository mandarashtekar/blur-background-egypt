'use strict';

var backgroundElement = document.querySelector('#background-container');
var selected_background;
var isHost;

window.onload = function () {
	console.log("window.onload");
	// alert($('#id_alias').val());
	
    var url = document.location.href, params = url.split('?')[1].split('&'), data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }
    // document.getElementById('here').innerHTML = data.name;
    var alias = data.alias;
    var name = data.name;
    var bandwidth = data.bandwidth;
    var source = data.source;
    var pin = data.pin;
    isHost = data.isHost;
    selected_background = data.selected_background;

    if(selected_background != 'bokeh'){
      var s = parse('url(./images/%s.jpg)', selected_background);
      // canvas.style.backgroundImage=s;
      /*backgroundElement.style.backgroundImage=s;
      backgroundElement.style.width=canvas.width;*/

      console.log("s: "+s);
    }

    console.log("Alias:" +alias);
    console.log("Name:" +name);
    console.log("Bandwidth:" +bandwidth);
    console.log("Source:" +source);
    console.log("Pin:" +pin);
    console.log("isHost:" +isHost);
    console.log("selected_background: " +selected_background);

    initialise("vve-tpmg-lab.kp.org", alias, bandwidth, name, "", source);
    // initialise("ttgpexip.ttgtpmg.net", alias, bandwidth, name, "", source);
    // rtc.connect(pin);
}

/* -------------------- CallStats - START -------------------- */
/*var callstats;
//initialize the app with application tokens
var AppID     = "468948303";
var AppSecret = "sDcYsqQkO25I:WCIYaqj5sXu2uruyNyT3cH6qlUu4PAgWHSKZZLIeXF0=";
var localUserID = "abc123";
var remoteUserID = "xyz123";
var csInitCallback;
var csStatsCallback;
var configParams;*/
/* -------------------- CallStats - END -------------------- */

const videoElement = document.querySelector('video');
// const selfvideo = document.getElementById('selfvideo');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas.width: " +canvas.width+ " canvas.height: " +canvas.height);

const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
console.log("canvas2.width: " +canvas2.width+ " canvas2.height: " +canvas2.height);

const canvas3 = document.getElementById('canvas3');
const ctx3 = canvas3.getContext('2d');

const blurBtn = document.getElementById('blur-btn');
const unblurBtn = document.getElementById('unblur-btn');
const callStats = document.getElementById('callstats-btn');

const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#speakerSource');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

var deviceInfos;

audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
      audioOutputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch(error => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
          // Jump back to first output device in the list as it's the default.
          audioOutputSelect.selectedIndex = 0;
        });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

function changeAudioDestination() {
  const audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  // videoElement.srcObject = stream;
  selfvideo.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  
  if(error === PERMISSION_DENIED) {
  	alert("PERMISSION_DENIED");
  }
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const audioSource = audioInputSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
  // videoElement.play();
}

audioInputSelect.onchange = start;
audioOutputSelect.onchange = changeAudioDestination;

videoSelect.onchange = start;


start();


selfvideo.onplaying = () => {
	console.log("videoElement playing");
  console.log("selfvideo.videoWidth: "+selfvideo.videoWidth+" selfvideo.videoHeight: "+selfvideo.videoHeight);

  canvas.width = selfvideo.videoWidth;
	canvas.height = selfvideo.videoHeight;

  canvas2.width = selfvideo.videoWidth;
  canvas2.height = selfvideo.videoHeight;

  /*backgroundElement.width = selfvideo.videoWidth;
  backgroundElement.height = selfvideo.videoHeight;*/
};

blurBtn.addEventListener('click', e => {
	console.log("Blur button clicked");
	blurBtn.hidden = true;
	unblurBtn.hidden = false;

	// videoElement.hidden = true;
	canvas.hidden = false;

  if (selected_background == 'bokeh') {
    console.log("Bokeh effect");
    loadBodyPix();
  } else{
    loadBodyPix();
  }
});

unblurBtn.addEventListener('click', e => {
	console.log("Unblur button clicked");
	blurBtn.hidden = false;
	unblurBtn.hidden = true;

	videoElement.hidden = false;
	canvas.hidden = true;
});


/* -------------------- Tensor Flow Blur Bck & Virtual Back I - START -------------------- */
function loadBodyPix() {
    console.log("main - loadBodyPix");
    var options = {
        architecture: 'ResNet50',
        // multiplier: 0.75,
        stride: 16,
        quantBytes: 4
    }
    bodyPix.load(options)
        .then(net => perform(net))
        .catch(err => console.log(err))
}

async function perform(net) {
    while (blurBtn.hidden) {
        const backgroundBlurAmount = 10;
        const edgeBlurAmount = 20;
        const flipHorizontal = false;
        const segmentation = await net.segmentPerson(selfvideo);

        if (selected_background == 'bokeh') {
            console.log("Bokeh effect");

            bodyPix.drawBokehEffect(
              canvas, selfvideo, segmentation, backgroundBlurAmount,
              edgeBlurAmount, flipHorizontal);
        } else{
            var myImgElement = document.getElementById('foo');

            canvas.width = myImgElement.width;
            canvas.height = myImgElement.height;
            ctx.drawImage(myImgElement, 0, 0, canvas.width, canvas.height);

            canvas2.width = myImgElement.width;
            canvas2.height = myImgElement.height;
            ctx2.drawImage(myImgElement, 0, 0, canvas.width, canvas.height);

            drawBody(segmentation);
        } /*else{
            var image = new Image();
            image.src = "./images/sphinx.jpg";

            const maskBackground = true;
            // Convert the personSegmentation into a mask to darken the background.
            // const backgroundColor = {r: 0, g: 0, b: 0, a: 255};
            const backgroundColor = {r: 255, g: 0, b: 0, a: 1};
            const backgroundDarkeningMask = bodyPix.toMask(segmentation, maskBackground, backgroundColor);

            const opacity = 0.7;
            const maskBlurAmount = 3;
            const flipHorizontal = true;

            bodyPix.drawMask(canvas, selfvideo, backgroundDarkeningMask, opacity, maskBlurAmount, flipHorizontal);
        }*/ /*else{
            var image = new Image();
            image.src = "./images/sphinx.jpg";

            const foreground = {r: 255, g: 0, b: 0, a: 1};
            const background = image;

            bodyPix.toMask(segmentation, foreground, background);
        }*/
        /*else{
            net.segmentPerson(selfvideo,  {
                flipHorizontal: false,
                internalResolution: 'medium',
                segmentationThreshold: 0.5
              })
              .then(personSegmentation => {
                if(personSegmentation!=null){
                    drawBody(personSegmentation);
                }
            });
            // cameraFrame = requestAnimFrame(detectBody);
            // drawBody(segmentation);
        }*/
    }
}

function drawBody(personSegmentation) {
    console.log("inside drawBody()");
    console.log("selfvideo.width: " +selfvideo.width+ " selfvideo.height: " +selfvideo.height);
    console.log("canvas.width: " +canvas.width+ " canvas.height: " +canvas.height);
    console.log("canvas2.width: " +canvas2.width+ " canvas2.height: " +canvas2.height);

    ctx.drawImage(selfvideo, 0, 0, selfvideo.width, selfvideo.height);

    var imageData = ctx.getImageData(0, 0, selfvideo.width, selfvideo.height);
    var pixel = imageData.data;
    
    var imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    var pixel2 = imageData2.data;

    for (var p = 0; p<pixel.length; p+=4)
    {
      if (personSegmentation.data[p/4] == 0) {
          // pixel[p+3] = 0;
          pixel[p+0] = pixel2[p+0];
          pixel[p+1] = pixel2[p+1];
          pixel[p+2] = pixel2[p+2];
          pixel[p+3] = 255;
      }
    }
    ctx.imageSmoothingEnabled = true;
    ctx.putImageData(imageData, 0, 0);
    // ctx.globalAlpha = 0.5;
}

/*function drawBody(personSegmentation) {
    console.log("Virtual Background effect");
    var image = new Image();
    image.src = "./images/sphinx.jpg";

    if(canvas.getContext){
      ctx.drawImage(selfvideo, 0, 0, 200, 150);
      ctx.drawImage(image, 50, 10, 100, 30);
      // ctx.drawImage(image, 0, 0, 200, 150);
    }
}*/

/*function drawBody(personSegmentation) {
    console.log("Virtual Background effect");
    var image = new Image();
    // image.setAttribute('crossOrigin', '');
    // image.crossOrigin = "Anonymous";
    image.src = "./images/sphinx.jpg";
    
    ctx2.drawImage(image, 0, 0, selfvideo.width, selfvideo.height);
    let frame2 =  ctx2.getImageData(0, 0, selfvideo.width, selfvideo.height);

    ctx.drawImage(selfvideo, 0, 0, selfvideo.width, selfvideo.height);
    let frame = ctx.getImageData(0, 0, selfvideo.width, selfvideo.height);

    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];

      if (g > 100 && r > 100 && b < 43){
        frame.data[i * 4 + 0] = frame2.data[i * 4 + 0]
        frame.data[i * 4 + 1] = frame2.data[i * 4 + 1]
        frame.data[i * 4 + 2] = frame2.data[i * 4 + 2]
      }
    }
    ctx3.putImageData(frame, 0, 0);
    // ctx3.putImageData(frame, 0, 0, selfvideo.width, selfvideo.height);
}*/

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}
/* -------------------- Tensor Flow Blur Bck & Virtual Back I- END -------------------- */


/* -------------------- Tensor Flow Virtual Bck II - START -------------------- */

function loadBodyPix2() {
  console.log("main - loadBodyPix");
  var options = {
      multiplier: 0.75,
      stride: 16,
      quantBytes: 4
  }
  bodyPix.load(options)
      .then(net => perform2(net))
      .catch(err => console.log(err))
}

async function perform2(net) {
  while (blurBtn.hidden) {
      const backgroundBlurAmount = 10;
      const edgeBlurAmount = 20;
      const flipHorizontal = false;

      const segmentation = await net.segmentPerson(selfvideo);

      var myImgElement = document.getElementById('foo');

      canvas.width = myImgElement.width;
      canvas.height = myImgElement.height;
      // ctx.drawImage(myImgElement, 0, 0, canvas.width, canvas.height);

      canvas2.width = myImgElement.width;
      canvas2.height = myImgElement.height;
      // ctx2.drawImage(myImgElement, 0, 0, canvas.width, canvas.height);

      drawBody2(segmentation);
  }
}

function drawBody2(personSegmentation) {
  console.log("inside drawBody()");
  console.log("selfvideo.width: " +selfvideo.width+ " selfvideo.height: " +selfvideo.height);
  console.log("canvas.width: " +canvas.width+ " canvas.height: " +canvas.height);
  console.log("canvas2.width: " +canvas2.width+ " canvas2.height: " +canvas2.height);
  
  ctx.drawImage(myImgElement, 0, 0);
  ctx.drawImage(selfvideo, 10, 10, selfvideo.width, selfvideo.height);

  var imageData = ctx.getImageData(0, 0, selfvideo.width, selfvideo.height);
  var pixel = imageData.data;
  
  var imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
  var pixel2 = imageData2.data;

  for (var p = 0; p<pixel.length; p+=4)
  {
    if (personSegmentation.data[p/4] == 0) {
        // pixel[p+3] = 0;
        pixel[p+0] = pixel2[p+0];
        pixel[p+1] = pixel2[p+1];
        pixel[p+2] = pixel2[p+2];
        pixel[p+3] = 255;
    }
  }
  ctx.imageSmoothingEnabled = true;
  ctx.putImageData(imageData, 0, 0);
  // ctx.globalAlpha = 0.5;
}

/* -------------------- Tensor Flow Virtual Bck II - END -------------------- */


/* -------------------- Tensor Flow Virtual Bck III - START -------------------- */
function loadBodyPixNew(){
    console.log("Inside Virtual Background");
    var options = {
      multiplier: 0.75,
      stride: 16,
      quantBytes: 4
    }
    bodyPix.load(options)
        .then(net => performNew(net))
        .catch(err => console.log(err))
}

async function performNew(net) {
  console.log("Inside performNew");
  while (blurBtn.hidden) {
      const backgroundBlurAmount = 10;
      const edgeBlurAmount = 20;
      const flipHorizontal = false;

      const outputStride = 16;
      const segmentationThreshold = 0.5;
      const personSegmentation = await net.estimatePersonSegmentation(selfvideo, outputStride, segmentationThreshold);

      console.log("personSegmentation: ",personSegmentation);

      const maskBackground = true;
      
      // Convert the personSegmentation into a mask to darken the background.
      const backgroundDarkeningMask = bodyPix.toMaskImageData(personSegmentation, maskBackground);

      const opacity = 0.7;

      // draw the mask onto the image on a canvas.  With opacity set to 0.7 this will darken the background.
      bodyPix.drawMask(
        canvas, imageElement, backgroundDarkeningMask, opacity);


      // var myImgElement = document.getElementById('foo');

      // canvas.width = myImgElement.width;
      // canvas.height = myImgElement.height;
      // ctx.drawImage(myImgElement, 0, 0, canvas.width, canvas.height);

      // canvas2.width = myImgElement.width;
      // canvas2.height = myImgElement.height;
      // ctx2.drawImage(myImgElement, 0, 0, canvas.width, canvas.height);

      // drawBodyNew(segmentation);
  }
}
/* -------------------- Tensor Flow Virtual Bck III - END -------------------- */




/* -------------------- CallStats - START -------------------- */
// callStats.addEventListener('click', e => {
function initialiseCallStats(pcObject){
  console.log("CallStat button clicked");

  //initialize the app with application tokens
  var AppID     = "468948303";
  var AppSecret = "sDcYsqQkO25I:WCIYaqj5sXu2uruyNyT3cH6qlUu4PAgWHSKZZLIeXF0=";
  var localUserID = "abc123";
  var remoteUserID = "xyz123";
  var csInitCallback;
  var csStatsCallback;
  var configParams;
  var conferenceID = "m.ncal.med.0.0.1111.2222";

  // callStats();
  callstats = new callstats();
  //localUserID is generated or given by the origin server
  callstats.initialize(AppID, AppSecret, localUserID, csInitCallback, csStatsCallback, configParams);
  
  /*function csInitCallback(csError, csErrMsg) {
    console.log("Status: errCode= " + csError + " errMsg= " + csErrMsg ); }
  }*/
  // console.log("pcObject: " +pcObject);

  function pcCallback (err, msg) {
    console.log("Monitoring status: "+ err + " msg: " + msg);
  };

  /*function createOfferError(err) {
    callstats.reportError(pcObject, conferenceID, callstats.webRTCFunctions.createOffer, err);
  }*/

  // pcObject is created, tell callstats about it
  // pick a fabricUsage enumeration, if pc is sending both media and data: use multiplex.
  var usage = callstats.fabricUsage.multiplex;
  var fabricAttributes = {
    remoteEndpointType:   callstats.endpointType.peer,
    fabricTransmissionDirection:  callstats.transmissionDirection.sendrecv
    };

  // remoteUserID is the recipient's userID
  // conferenceID is generated or provided by the origin server (webrtc service)
  // pcObject is created, tell callstats about it
  // pick a fabricUsage enumeration, if pc is sending both media and data: use multiplex.
  callstats.addNewFabric(pcObject, remoteUserID, usage, conferenceID, fabricAttributes, pcCallback);

  // let the "negotiationneeded" event trigger offer generation
  /*pcObject.onnegotiationneeded = function () {
    // create offer
    pcObject.createOffer().then(
      localDescriptionCreatedCallback,
      createOfferErrorCallback
    );
  }*/
}
// });

/* -------------------- CallStats - END -------------------- */
