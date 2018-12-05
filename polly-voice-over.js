function pollyVoiceOver(awsCognitoPoolId, awsRegion, styles) {
  var pollyObj = this;
  pollyObj.polly = null;
  pollyObj.awsCognitoPoolId = awsCognitoPoolId ? awsCognitoPoolId : null;
  pollyObj.awsRegion = awsRegion ? awsRegion : 'us-east-1';
  var defaultStyle = {
    'position':'fixed',
    'bottom': '0',
    'left': '0',
    'right': '0',
    'color': '#fff',
    'background': '#666',
    'font-size': '22px',
    'padding': '15px',
    'z-index': '1001'
  };
  pollyObj.styles = styles ? Object.assign(defaultStyle, styles) : defaultStyle;

  // Main function (exposed as API) which will send request to Polly.
  pollyObj.addVoiceOver = function(text, timeOut, config) {
    if (!window.AWS) {
      console.log('AWS sdk missing!!!');
      return;
    }
    if (!pollyObj.awsCognitoPoolId) {
      console.log('Please configure awsCognitoPoolId');
      return;
    }
    if (!pollyObj.awsRegion) {
      console.log('Please configure awsRegion');
      return;
    }

    var lexicon = (config && config.lexicon) ? config.lexicon : 'Joanna';
    pollyObj.styles = (config && config.styles) ? Object.assign(pollyObj.styles, config.styles) : pollyObj.styles;
    timeOut = timeOut || 0;

    AWS.config.region = pollyObj.awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: pollyObj.awsCognitoPoolId,
    });
    var params = {
      LexiconNames: [],
      OutputFormat: "mp3",
      Text: text,
      TextType: "text",
      VoiceId: lexicon
    };

    if (!pollyObj.polly) {
      pollyObj.polly = new AWS.Polly({apiVersion:'2016-06-10'});
    }

    pollyObj.polly.synthesizeSpeech(params, function(err, data) {
      if (err) {console.log(err, err.stack); return false;}

      // Add footer element for caption
      var url = processAudioStream(data);
      var audioElement = document.getElementById('polly-player');
      var footer = document.getElementById('polly-footer');
      updateFooterStyles(footer);
      setTimeout(function() {
        footer.classList.remove('hidden');
        footer.innerText = text;
        audioElement.src = url;
        audioElement.play();
        if (config && config.hideOnAudioEnd) {
          audioElement.onended = function() {
            footer.classList.add('hidden');
            footer.innerText = '';
          };
        }
      }, timeOut);
    });
  }

  // Add caption and style element in body.
  function init() {
    if (document.getElementById('polly-footer') && document.getElementById('polly-player')) {
      console.log('already exists');
      return;
    }
    var polly_footer = document.createElement('div');
    polly_footer.innerHTML = `
      <div class="polly-footer hidden" id="polly-footer"></div>
      <audio class="hidden" id="polly-player" src=""></audio>
    `;
    document.body.appendChild(polly_footer);
    // Hide caption element
    var styleElem = document.createElement('style');
    styleElem.innerText = `.hidden{display:none !important}`;
    document.body.appendChild(styleElem);
  }

  function processAudioStream(data) {
    var uInt8Array = new Uint8Array(data.AudioStream);
    var blob = new Blob([uInt8Array.buffer]);
    return URL.createObjectURL(blob);
  }

  function updateFooterStyles(footer) {
    var styles = '';
    Object.keys(pollyObj.styles).map(key => {
      styles += `${key}:${pollyObj.styles[key]};`;
    });
    footer.setAttribute('style', styles);
  }

  // Initialize Polly Script
  init();

  // Return object
  return pollyObj;
}
