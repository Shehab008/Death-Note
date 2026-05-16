const API = '/api';

let token = localStorage.getItem('token');

async function register(){

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    const res = await fetch(`${API}/auth/register`,{

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

    alert(data.msg);

}

async function login(){

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    const res = await fetch(`${API}/auth/login`,{

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

    if(data.token){

        localStorage.setItem('token',data.token);

        token = data.token;

        loadUser();

    }

}

async function loadUser(){

    document.getElementById('authBox')
    .classList.add('hidden');

    document.getElementById('app')
    .classList.remove('hidden');

    const res = await fetch(`${API}/notes/me`,{

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

        document.getElementById('eyesBadge')
        .innerHTML =
        '👁 SHINIGAMI EYES ACTIVE';

    }

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