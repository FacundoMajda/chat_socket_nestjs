const username = localStorage.getItem('name');
const StatusOnline = document.querySelector('#status-online');
const StatusOffline = document.querySelector('#status-offline');
const usersUl = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');
const socket = io({ auth: { token: 'Abc123', name: username } });

if (!username) {
  window.location.replace('/');
  throw new Error('Username requerido');
}

//================================================//
const renderUsers = (users) => {
  usersUl.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.name;
    usersUl.appendChild(li);
  });
};

const renderMessage = (data) => {
  const { userId, message, name } = data;
  const div = document.createElement('div');
  div.classList.add('message');

  if (userId !== socket.id) {
    div.classList.add('incoming');
  }

  div.innerHTML = `<small>${name}</small>
  <p>${message}</p>`;
  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;
};

//================================================//
socket.on('connect', () => {
  StatusOnline.classList.remove('hidden');
  StatusOffline.classList.add('hidden');
  console.log('Conectado');
});

socket.on('disconnect', () => {
  StatusOnline.classList.add('hidden');
  StatusOffline.classList.remove('hidden');
  console.log('desconectado');
});

socket.on('welcome', (data) => {
  console.log({ data });
});

socket.on('on-clients-changed', renderUsers);

socket.on('message', renderMessage);

//================================================//
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value;
  input.value = '';
  socket.emit('message', message);
});
