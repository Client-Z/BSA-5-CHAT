# Web Transports. NodeJS / Socket.io

## chat-example

### Вимоги до завдання:

При завантаженні чату повинно з’являтися випливаюче вікно з формою для збереження імені та ніку.   
Сам інтерфейс чату повинен містити список повідомлень, поле для вводу повідомлення і кнопку надіслати.   
Збоку від списку повідомлень повинен міститися список учасників чату:   
   1. Елемент списку повинен містити імя користувача та нік   
   2. Додатково елемент списку повинен містити та статус online, offline, just appeared (якщо користувач у чаті менше 1 хв включно) ***   
   
Інтерфейс повинен бути акуратним та простим (не треба крутяцькі стилі, верстку, responsive), можна використати bootstrap, або будь яку іншу      бібліотеку. На UI увага не буде сильно звертатися.   

Чат повинен містити історію з 100 повідомлень (очищення за принципом FIFO).    
Вся історія доступна кожному користувачу, незважаючи коли він підключився.   
Коли користувач набирає текст, то в чаті під текстовим полем показати це у форматі: “@userName is typing …” ***   

   Якщо ввести повідомлення у форматі “@nicName”, то у користувача котрому воно адресоване воно повинно бути підсвічене (background іншого кольору наприклад)   

Якщо користувач відключився, то повідомити інших повідомленням що він покинув чат і змінити статус на offline.***   


0. git clone
1. cd chat-socket.io/   
2. node/nodemon index.js   
3. open localhost:3000/
