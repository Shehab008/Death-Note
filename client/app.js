const API = '/api';

let token = localStorage.getItem('token');

async function register(){

    const username =
    document.getElementById('username').value;

    const password =
    document.getElementById('password').value;

    const adminKey =
    document.getElementById('adminKey').value;

    const res =
    await fetch(`${API}/auth/register`,{

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({

            username,
            password,
            adminKey

        })

    });

    const data = await res.json();

    alert(data.msg);

}

async function login(){

    const username =
    document.getElementById('username').value;

    const password =
    document.getElementById('password').value;

    const res =
    await fetch(`${API}/auth/login`,{

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({
            username,
            password
        })

    });

    const data = await res.json();

    if(data.banned){

        document
        .getElementById('authBox')
        .classList.add('hidden');

        document
        .getElementById('bannedBox')
        .classList.remove('hidden');

        return;

    }

    if(data.token){

        localStorage.setItem('token',data.token);

        token = data.token;

        loadUser();

    }

}

function logout(){

    localStorage.removeItem('token');

    location.reload();

}

async function loadUser(){

    document
    .getElementById('authBox')
    .classList.add('hidden');

    document
    .getElementById('app')
    .classList.remove('hidden');

    const res =
    await fetch(`${API}/notes/me`,{

        headers:{
            authorization:token
        }

    });

    const user = await res.json();

    document.getElementById('life')
    .innerHTML =

    `Remaining Life:
    ${Math.floor(user.lifeDays/365)}
    Years`;

    if(user.eyesActive){

        document
        .getElementById('eyesBadge')
        .innerHTML =

        '👁 SHINIGAMI EYES ACTIVE';

    }

    if(user.role === 'admin'){

        document
        .getElementById('userPanel')
        .style.display = 'none';

        loadAdminPanel();

        return;

    }

    loadNotes(user);

}

function loadNotes(user){

    const notesDiv =
    document.getElementById('notes');

    notesDiv.innerHTML = '';

    if(user.hasNotebook === false){

        notesDiv.innerHTML =
        '<h2>You forgot everything...</h2>';

        return;

    }

    user.notes.forEach(note=>{

        notesDiv.innerHTML += `

        <div class="note">

        <h3>${note.victimName}</h3>

        <p>${note.reason}</p>

        <p>${note.details}</p>

        <p>${note.status}</p>

        <p>
        ${new Date(note.writtenAt)
        .toLocaleString()}
        </p>

        </div>

        `;

    });

}

async function loadAdminPanel(){

    const res =
    await fetch(`${API}/notes/all-users`,{

        headers:{
            authorization:token
        }

    });

    const users = await res.json();

    const adminDiv =
    document.getElementById('adminPanel');

    adminDiv.innerHTML =
    '<h1>ADMIN PANEL</h1>';

    users.forEach(user=>{

        adminDiv.innerHTML += `

        <div class="note">

        <h2>${user.username}</h2>

        <p>
        Role:
        ${user.role}
        </p>

        <p>
        Life:
        ${Math.floor(user.lifeDays/365)}
        Years
        </p>

        <p>
        Status:
        ${user.banned ? 'BANNED' : 'ACTIVE'}
        </p>

        <button
        onclick="banUser('${user._id}')">

        BAN

        </button>

        <button
        onclick="unbanUser('${user._id}')">

        UNBAN

        </button>

        <button
        onclick="resetLife('${user._id}')">

        RESET LIFE

        </button>

        <button
        onclick="addLife('${user._id}')">

        ADD 1 YEAR

        </button>

        <div>

        <h3>User Notes</h3>

        ${
            user.notes.map(note=>`

            <div class="note">

            <p>
            Victim:
            ${note.victimName}
            </p>

            <p>
            ${note.reason}
            </p>

            <p>
            ${note.details}
            </p>

            <p>
            ${note.status}
            </p>

            </div>

            `).join('')
        }

        </div>

        </div>

        `;

    });

}

async function banUser(id){

    await fetch(`${API}/notes/ban/${id}`,{

        method:'POST',

        headers:{
            authorization:token
        }

    });

    loadAdminPanel();

}

async function unbanUser(id){

    await fetch(`${API}/notes/unban/${id}`,{

        method:'POST',

        headers:{
            authorization:token
        }

    });

    loadAdminPanel();

}

async function resetLife(id){

    await fetch(`${API}/notes/reset-life/${id}`,{

        method:'POST',

        headers:{
            authorization:token
        }

    });

    loadAdminPanel();

}

async function addLife(id){

    await fetch(`${API}/notes/add-life/${id}`,{

        method:'POST',

        headers:{
            authorization:token
        }

    });

    loadAdminPanel();

}

async function writeNote(){

    const victimName =
    document.getElementById('victim').value;

    const reason =
    document.getElementById('reason').value;

    const details =
    document.getElementById('details').value;

    await fetch(`${API}/notes/write`,{

        method:'POST',

        headers:{
            'Content-Type':'application/json',
            authorization:token
        },

        body:JSON.stringify({

            victimName,
            reason,
            details

        })

    });

    loadUser();

    setTimeout(()=>{

        loadUser();

    },41000);

}

async function activateEyes(){

    await fetch(`${API}/notes/eyes`,{

        method:'POST',

        headers:{
            authorization:token
        }

    });

    loadUser();

}

async function giveUpNotebook(){

    await fetch(`${API}/notes/giveup`,{

        method:'POST',

        headers:{
            authorization:token
        }

    });

    loadUser();

}

async function reclaimNotebook(){

    await fetch(`${API}/notes/reclaim`,{

        method:'POST',

        headers:{
            authorization:token
        }

    });

    loadUser();

}

if(token){

    loadUser();

}
