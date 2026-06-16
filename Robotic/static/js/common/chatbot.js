document.addEventListener('DOMContentLoaded', () => {
  const chatbotWidget = document.getElementById('chatbot-widget');
  const chatbotHeader = document.getElementById('chatbot-header');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const closeChatbot = document.getElementById('close-chatbot');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotTyping = document.getElementById('chatbot-typing');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotChips = document.querySelectorAll('[data-chat-prompt]');

  let isDragging = false;
  let offsetX, offsetY;

  // --- Draggable Chatbot ---
  const move = (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const body = document.body.getBoundingClientRect();

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + chatbotWidget.offsetWidth > body.width) x = body.width - chatbotWidget.offsetWidth;
    if (y + chatbotWidget.offsetHeight > body.height) y = body.height - chatbotWidget.offsetHeight;


    chatbotWidget.style.left = `${x}px`;
    chatbotWidget.style.top = `${y}px`;
    chatbotWidget.style.right = 'auto';
    chatbotWidget.style.bottom = 'auto';
  };

  chatbotHeader.addEventListener('mousedown', (e) => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    isDragging = true;
    offsetX = e.clientX - chatbotWidget.getBoundingClientRect().left;
    offsetY = e.clientY - chatbotWidget.getBoundingClientRect().top;
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.removeEventListener('mousemove', move);
    });
  });


  chatbotHeader.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (chatbotWidget.classList.contains('open')) {
        closeChat();
      } else {
        openChat();
      }
    }
  });

  // --- Chat Functionality ---
  const addMessage = (text, sender) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chatbot-message', sender);
    messageElement.textContent = text;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const setTyping = (isTyping) => {
    if (!chatbotTyping) return;
    chatbotTyping.hidden = !isTyping;
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const openChat = () => {
    chatbotWidget.classList.add('open');
    chatbotToggle.style.display = 'none';
    chatbotWidget.setAttribute('aria-hidden', 'false');
    chatbotInput.focus();
  };

  const closeChat = () => {
    chatbotWidget.classList.remove('open');
    chatbotToggle.style.display = 'flex';
    chatbotWidget.setAttribute('aria-hidden', 'true');
  };

  chatbotToggle.addEventListener('click', openChat);
  closeChatbot.addEventListener('click', closeChat);

  chatbotChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-chat-prompt');
      if (!prompt) return;
      chatbotInput.value = prompt;
      openChat();
      sendMessage();
    });
  });

  const sendMessage = async () => {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    addMessage(message, 'user');
    chatbotInput.value = '';
    setTyping(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = data.choices[0]?.message?.content.trim();
      setTyping(false);
      if (botMessage) {
        addMessage(botMessage, 'bot');
      }
    } catch (error) {
      console.error('Error fetching from Groq API:', error);
      setTyping(false);
      addMessage('Sorry, something went wrong. Please try again.', 'bot');
    }
  };

  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Initial bot message
  addMessage('Hello! I can help with crop disease questions, field monitoring, and treatment ideas.', 'bot');
  chatbotWidget.setAttribute('aria-hidden', 'true');
});
