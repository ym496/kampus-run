  document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('enter-bib').focus();
  });

  function scrollToBottom() {
      var chatBox = document.getElementById("chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
  }

async function sendMessage() {
    var messageInput = document.querySelector("input[type='text']").value.trim();
    if (messageInput !== "") {
        var currentTime = new Date(); 
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

       var year = currentTime.getFullYear();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

        var requestData = {
            bib_code: messageInput,
            finishTime: {
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                date: formattedDate
            }
        };

                try {
                    const response = await fetch('/finish_log', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData),
                    });

                    if (!response.ok) {
                        throw new Error('Log request failed.');
                    }

                    const data = await response.json();
                    console.log(data);
                    
                    var messageElement = document.createElement("div");
                    messageElement.textContent = '"' + messageInput + '" bib_id successfully logged.';
                    messageElement.style.backgroundColor = "#e8f7e9"; 
                    messageElement.style.padding = "3px"; 
                    messageElement.style.marginBottom = "3px"; 
                    document.getElementById("chat-box").appendChild(messageElement);
                    messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });

                } catch (error) {
                    console.log(error);
                    
                    var messageElement = document.createElement("div");
                    messageElement.textContent = '"' + messageInput + '" didn\'t log correctly.';
                    messageElement.style.backgroundColor = "#ffcccc"; 
                    messageElement.style.padding = "3px"; 
                    messageElement.style.marginBottom = "3px";
                    document.getElementById("chat-box").appendChild(messageElement);
                    messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }

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

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('enter-bib');
    const keyboard = document.getElementById('custom-keyboard');

    keyboard.addEventListener('click', (event) => {
        if (event.target.classList.contains('key')) {
            const key = event.target.textContent;

            if (event.target.classList.contains('delete')) {
                input.value = input.value.slice(0, -1);
            } else if (event.target.classList.contains('clear')) {
                input.value = '';
            } else if (event.target.classList.contains('enter')) {
                sendMessage(); 
            } else {
                input.value += key;
            }
        }
    });
});
