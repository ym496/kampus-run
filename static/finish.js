  document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('enter-bib').focus();
  });

  function scrollToBottom() {
      var chatBox = document.getElementById("chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
  }

function sendMessage() {
    var messageInput = document.querySelector("input[type='text']").value.trim();
    if (messageInput !== "") {
        var currentTime = new Date(); 
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        var requestData = {
            bib_code: messageInput,
            finishTime: {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        };

        fetch('/finish_log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Log request failed.');
          }
        })
        .then(data => {
            console.log(data)
            var messageElement = document.createElement("div");
            messageElement.textContent = '"'+ messageInput +'"' + " bib_id successfully logged.";
            messageElement.style.backgroundColor = "#e8f7e9"; 
            messageElement.style.padding = "3px"; 
            messageElement.style.marginBottom = "3px"; 
            document.getElementById("chat-box").appendChild(messageElement);
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });

        })
        .catch(error => {
            console.log(error)
            var messageElement = document.createElement("div");
            messageElement.textContent = '"' + messageInput + '"' + " didn't log correctly.";
            messageElement.style.backgroundColor = "#ffcccc"; 
            messageElement.style.padding = "3px"; 
            messageElement.style.marginBottom = "3px";
            document.getElementById("chat-box").appendChild(messageElement);
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });

        document.querySelector("input[type='text']").value = ""; 
    }
}

document.querySelector("input[type='text']").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage(); 
    }
});

document.getElementById("send-btn").addEventListener("click", function() {
    sendMessage(); 
});
