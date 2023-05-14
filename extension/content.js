( function () {
    let messageAppended = false;
    
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        let resultMessage = document.createElement("div");
        resultMessage = applyCSS(resultMessage);
        if(Number(request.result)==0){
            resultMessage.innerText = `This Address is safe`;
            resultMessage.style.color = "green";
        }
        else{
            resultMessage.innerText = `This is a Phishing/Scam address`;
            resultMessage.style.color = "red";
        }

      console.log("Message received from background script: " + request.message)
      console.log("sender: ", sender)
      if (request.message === "append-message" ) {
        // Get the tweet element
        // Select the element
        let overviewElement = document.querySelector('.card-body h3.h6');

        // Append your message
        overviewElement.insertAdjacentElement('afterend',resultMessage);
        console.log("overviewElement: ", overviewElement)
        messageAppended = false; // reset the variable for the next tweet
      }
    });
  })();
  
  function applyCSS(resultMessage){
    resultMessage.style.border = "0 solid black";
    resultMessage.style.boxSizing = "border-box";
    resultMessage.style.color = "rgba(0,0,0,1.00)";
    // resultMessage.style.display = "inline";
    resultMessage.style.font = "14px -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif";
    resultMessage.style.marginBottom = "0px";
    resultMessage.style.marginLeft = "0px";
    resultMessage.style.marginRight = "0px";
    resultMessage.style.marginTop = "0px";
    resultMessage.style.paddingBottom = "0px";
    resultMessage.style.paddingLeft = "0px";
    resultMessage.style.paddingRight = "0px";
    resultMessage.style.paddingTop = "0px";
    resultMessage.style.whiteSpace = "pre-wrap";
    resultMessage.style.wordWrap = "break-word";
    resultMessage.style.alignItems = "center";
    return resultMessage;
  }