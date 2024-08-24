let playerListHTML = document.querySelector(".playerList");
let playerList = [];

let addPlayer = document.getElementById("addPlayer");
addPlayer.addEventListener("click", adicionarPlayer);

let randomize = document.getElementById("aleatorizarBtn");
randomize.addEventListener("click", () => randomizar(playerList));

//Função para exluir o elemento ao clicar na lixeirinha////
function excluir(elemento, identificar) {
    //Seleciona o item que possui id = ao "data-id" da lixeira;
    let item = document.querySelector(`#${elemento}`);
    item.remove();

    if (identificar === "player") {
        //Filtra to dos os elementso de PlayerList e parra para PlayerList uma nova lista com todos os elementos que são diferente de lixoId;
        playerList = playerList.filter(function (element) {
            return element !== elemento;
        })
    } else if (identificar === "historico") {
        let elementoHistorico = elemento.slice(0, -9);
        localStorage.removeItem(elementoHistorico);
    }
}

//Salva o nickname ou a equipe oa apertar ENTER;
function verificarEnter(name) {
    let inputEquipeName = document.querySelector(`#${name}`);
    inputEquipeName.addEventListener("keydown", function (tecla) {
        if (name === "equipeName") {
            if (tecla.key === "Enter") {
                salvarNoStorage();
            }
        }else if(name === "inputName"){
            if (tecla.key === "Enter") {
                adicionarPlayer();
            }
        }
    })
}
verificarEnter("equipeName");
verificarEnter("inputName");

function impedirCaracteres(input){
    let campoDeTexto = document.querySelector(`#${input}`); //Seleciona o elemento com o id igual a input
    
    campoDeTexto.addEventListener("input", function() { //Adiciona um evento para toda vez que o campo receber um valor
        let valor = campoDeTexto.value; //"valor" recebe o valor do input
        let novoValor = valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''); // Remove caracteres inválidos
        if (valor !== novoValor) {
            campoDeTexto.value = novoValor; // Atualiza o campo com o valor corrigido
        }
    });
}
impedirCaracteres("inputName");
impedirCaracteres("equipeName");

//Adiciona os jogadores que estão armazenados no Array, para a tela de equipe atual
function playerListParaTela() {
    // Iterar sobre cada elemento de PlayerList e adicionar na tela;
    // Primeiramente vamos limpar a tela para que não se duplique valores;
    playerListHTML.innerHTML = "";
    playerList.forEach(function (player) {
        let newPlayer = document.createElement("div");
        newPlayer.classList.add("player");
        newPlayer.id = player;
        newPlayer.innerHTML = `
                <span>•</span><p>${player.replace(/_/g, " ")}</p>
                <svg class="lixeira" onclick="excluir('${player}', 'player')" xmlns="http://www.w3.org/2000/svg" height="34px"
                    viewBox="0 -960 960 960" width="34px" fill="#e8eaed">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
            `;
        playerListHTML.appendChild(newPlayer);
    });
}


//ADICIONAR PLAYER
function adicionarPlayer() {
    let inputPlayerName = document.getElementById("inputName").value.trim();
    inputPlayerName = inputPlayerName.replace(/ /g, "_");
    if (inputPlayerName) {
        if (playerList.length < 16) {
            //Adiciona o novo Player à lista playerList
            playerList.push(inputPlayerName);

            //Adiciona os jogadores que estão armazenados no Array, para a tela de equipe atual
            playerListParaTela();

            // Limpa o input de adicionar player names;
            document.getElementById("inputName").value = "";
        } else {
            alert("Limite máximo de 16 players!");
            document.getElementById("inputName").value = "";
        }
    } else {
        alertWindow("Insira um nickname!")

    }
}

//Aleatoriza o array;
function randomizar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let numeroAleatorio = Math.floor(Math.random() * (i + 1));
        [array[i], array[numeroAleatorio]] = [array[numeroAleatorio], array[i]];
    }

    let aleatorios = document.querySelector(".aleatorios");
    aleatorios.innerHTML = "";

    for (let i = 0; i < array.length; i += 2) {
        let novoGrupo = document.createElement("div");
        novoGrupo.classList.add("grupo");
        if (array[i + 1]) {
            novoGrupo.innerHTML = `
            <p>${array[i]}</p> / <p>${array[i + 1]}</p>
        `
        } else {
            novoGrupo.innerHTML = `
            <p>${array[i]}</p>
        `
        }


        aleatorios.appendChild(novoGrupo);
    }
}

///////////////HISTORICO/////////////////////

//Coloca os elementos do LocalStorage no campo "Histórico"
function getElementsLocalStorage() {
    let historico = document.querySelector(".partidas");
    historico.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {
        let chave = localStorage.key(i);

        let listaAtual = JSON.parse(localStorage[chave]);

        let div = document.createElement("div");
        div.classList.add("historicoTabela");
        div.id = chave + "historico";
        div.innerHTML = `
            <div class="historicoNome" onclick="capturarDoHistorico('${chave}')">${chave.replace(/_/g, " ")}</div>
                <div class="quantiaDePlayers" onclick="capturarDoHistorico('${chave}')" id="${chave + 'Quantia'}" onmouseover="tabela('${chave + 'Quantia'}', '${chave}')" >${listaAtual.length}<br>Players</div>
                <div class="deletar">
                <svg class="lixeira" onclick="excluir('${chave + "historico"}', 'historico')" xmlns="http://www.w3.org/2000/svg" height="34px"
                    viewBox="0 -960 960 960" width="34px" fill="#e8eaed">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
            </div>
        `
        historico.appendChild(div);
    }
}

//Chama a função
getElementsLocalStorage();

////////////SALVAR UMA EQUIPE NO LOCALSTORAGE/////////////
function salvarNoStorage() {
    let equipeName = document.querySelector("#equipeName");
    let equipeNameValue = equipeName.value.trim();
    equipeNameValue = equipeNameValue.replace(/ /g, "_");
    if (equipeNameValue) {
        //Tranforma o array "playerList" em uma string;
        let equipe = JSON.stringify(playerList);

        //Armazena o "playerList = equipe" atual, ligado ao valor da variável "equipeNameValue", ex: acoaminas: "['carlo', 'du']";
        localStorage.setItem(equipeNameValue, equipe);

        //Limpa o campo do input "NOME DA EQUIPE";
        equipeName.value = "";


        //-----Função para capturar as equipes do localStorage;
        getElementsLocalStorage();

    } else {
        alertWindow("Insira um nome para salvar equipe")
    }
}

//Passa os itens do historico para a equipa atual ao clicar no nome da equipe;
function capturarDoHistorico(equipe) {
    document.querySelector("#equipeName").value = equipe;
    playerList = JSON.parse(localStorage.getItem(equipe));
    playerListParaTela();
}

//Cria uma janela flututante ao passar o mouse por cima da quantia de players no histórico
function tabela(elementOver, chaveLocalStorage) {
    let participantes = JSON.parse(localStorage[chaveLocalStorage]);
    let altura = participantes.length;

    //Retorna o tamanho da maior string dentro do Array;
    function tamanhoDaTabela(lista) {
        maxLength = 0;

        for (let i = 0; i < lista.length; i++) {
            if (lista[i].length > maxLength) {
                maxLength = lista[i].length;
            }
        }
        return maxLength;
    }

    if (altura > 0) {
        altura = altura * 30; //Definie a altura de cada linha ex: 3*40, 3 linhas de 40px
        largura = tamanhoDaTabela(participantes) * 15; //Define o tamanho da largura da tabela
        let div = document.createElement("div");
        div.classList.add("tabela")
        div.style.width = `${largura}px`;
        div.style.height = `${altura}px`;
        document.body.appendChild(div);

        participantes.forEach(function (jogador) {
            let p = document.createElement("p");
            p.innerText = `• ${jogador}`;
            div.appendChild(p);
        })

        let bloco = document.querySelector(`#${elementOver}`);
        bloco.addEventListener("mousemove", function (event) {
            const x = event.clientX;
            const y = event.clientY;

            div.style.left = `${x - (largura / 2 - 5)}px`;
            div.style.top = `${y + 30}px`;
        })

        bloco.addEventListener("mouseout", function () {
            div.remove();
        })
    }
}

function alertWindow(textoAlerta) {
    let janela = document.createElement("div");
    janela.classList.add("alertWindow");
    janela.textContent = textoAlerta;
    document.body.appendChild(janela);
    let listaDeJanelas = document.querySelectorAll(".alertWindow")

    listaDeJanelas.forEach(function (remover) {
        setTimeout(() => {
            remover.style.opacity = "0"
        }, 1800);

        setTimeout(() => {
            remover.remove();
        }, 2200);
    })
}