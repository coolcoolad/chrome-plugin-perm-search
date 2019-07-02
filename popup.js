var source = '';

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        source = request.source;
    }
  });
  
  function onWindowLoad() {
    var searchBox = document.getElementById('searchBox');
    searchBox.onkeyup = filter;
    var message = document.querySelector('#message');
  
    chrome.tabs.executeScript(null, {
      file: "getPagesSource.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
  
  }

  function filter(event) {
    if (event.keyCode == 13) {
        var msg = document.getElementById('message');
        msg.innerText = '';
        var keyword = document.getElementById('searchBox').value;

        getPermutation(keyword);
    }
  }

  function findKeyword(keyword) {
    var msg = document.getElementById('message');
    if (source.indexOf(keyword) >= 0) {
        msg.innerText += keyword + '\n';
    }
  }

  function getPermutation(keyword) {
    var words = keyword.trim().split(' ');
    var flag = [];
    for (var i=0; i < words.length; i++) {
        flag[i] = 0;
    }
    var list = [];
    perm(flag, words, [], list);
    //var msg = document.getElementById('message');
    for (var i=0; i < list.length; i++) {
        findKeyword('\t'+list[i]+'\t');
        //msg.innerText += list[i];
    }
  }

  function perm(flag, words, newWords, list) {
    var sum = flag.reduce((a, b) => a + b, 0);
    if (sum == flag.length) {
        list.push(newWords.join(' '));
    }
    for (var i=0; i < flag.length; i++) {
        if (flag[i] == 0) {
            newWords[sum] = words[i];
            flag[i] = 1;
            perm(flag, words, newWords, list);
            flag[i] = 0;
        }
    }
  }
  
  window.onload = onWindowLoad;