class Chatbox {
    constructor() {
        console.log('Constructor initialized');

        this.state = false;
        this.messages = [];
        this.args = null; // Initialize this.args as null

        // Fetch and initialize the chatbox
        this.initializeChatbox().then(() => {
            this.display(); // Call display only after initialization is complete
        });
    }

    async initializeChatbox() {
        try {
            const response = await fetch('chatbot.html');
            const html = await response.text();

            document.body.insertAdjacentHTML('afterbegin', html);

            // Initialize args after the DOM is updated
            this.args = {
                openButton: document.querySelector('.chatbox__button'),
                chatBox: document.querySelector('.chatbox__support'),
                endButton: document.querySelector('.send__button'),
            };

            console.log('Chatbox initialized', this.args);
        } catch (error) {
            console.error('Error loading the footer content:', error);
        }
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args; // Now this.args is guaranteed to be defined

        const x = openButton; // Same as this.args.openButton
        console.log(x);

        x.onclick = () => this.toggleState(chatBox);

        sendButton?.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox?.querySelector('input');
        node?.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://localhost:8080/api/v1/chat', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin": "*"
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();