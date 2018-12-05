## Usage

1. You must have aws-sdk available in the page.
2. Get CognitoPoolId which can access Polly.
3. Initialize the object with `var msg = new pollyVoiceOver(awsCognitoPoolId);`
4. use `addVoiceOver` or `addTranslatedVoiceOver` function with desired text. Example:

#### How to use with delayed input

```
// With delay of 3 seconds
msg.addVoiceOver('This is the demo about voice over with polly!', 3000);
```

#### How to use on click

```
btn = document.getElementById('button');
btn.addEventListener('click', function() {
  msg.addVoiceOver('When we click on this button polly send this request and speaks back to you!');
}, false);
```

### How to use translated voice-over

(just keep in mind to use correct lexicon for better accent.)
```
btn = document.getElementById('button-es');
btn.addEventListener('click', function() {
  msg.addTranslatedVoiceOver('This is translated content in spanish!', 'es', 0, {'lexicon': 'Conchita'});
}, false);
```

## Config

There are few configuration options available in script.
1. Change the css of caption text:
```
var css = {'color': 'indianred', 'background': '#fff'};
msg.addVoiceOver('Caption with different CSS!', 10, {'styles': css});
```

2. Destroy the caption after audio play:
```
msg.addVoiceOver('When we click on this button polly send this request and speaks back to you!', 10, {'hideOnAudioEnd': true});
```

3. Change the voice:
```
msg.addVoiceOver('When we click on this button polly send this request and speaks back to you!', 10, {'hideOnAudioEnd': true, 'lexicon': 'Brian'});
// See full list of lexicons: https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#voice
```
