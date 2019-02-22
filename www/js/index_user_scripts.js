	//VARIAVÉIS UTILIZADAS PELO APP
    var id;
    var isProfessor = 0;
    var userName;
    var notificacao;
    var modoNotificacao;
    var fotoUser;
    var fotoTurma;
    var fotoCadastro;
    var turmaAtual;
    var turma;
    var turmaUsers;
    var events;
    var token;
    var idTrocaSenha;
    var emailTrocaSenha;
    var pageNow = "login";
    var recupera = 1;
    var addEscolha = 1;
    var userPesq;
    var userForAdd = [];
    var pushEventos;

    //FUNÇÃO EM RELAÇÃO QUAL PÁGINA O APP ESTÁ

    function changePage(page) {
    	pageNow = page;
    }

    //FUNÇÃO DE LOGIN

    function login() {
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/login.php',
    		data: ({
    			email: document.getElementById("emailLogin").value,
    			senha: document.getElementById("senhaLogin").value
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
    			id = result.id;
    			isProfessor = result.isProfessor;
    			userName = result.nome;
    			notificacao = result.notificacao;
    			modoNotificacao = result.modoNotificacao;
    			fotoUser = result.foto;
    			var autenticado = result.autenticado;
    			if(autenticado == 1) {
    				document.getElementById("btnLogMenu").click();
    				atlToken();
    				carregaPerfil();
    				carregaNotificacao();
    				carregaTurmas();
                    pushEventos();
    			} else {
    				navigator.notification.alert("Usuário não autenticado!", null, "", "Ok");
    			}
    		},
    		error: function(response) {
    			navigator.notification.alert("Email e/ou senha incorreto(s)!", null, "", "Ok");
    		}
    	});
    }

    //FUNÇÕES EM RELAÇÃO A NOTIFICAÇÕES PUSH

    function atlToken() {
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/atlToken.php',
    		data: ({
    			id: id,
    			token: token
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {},
    		error: function(response) {}
    	});
    }

    function pushNotification(msg1, tempo1) {
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/pushNotifications.php',
    		data: ({
    			id: id,
    			msg: msg1,
    			tempo: tempo1
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {},
    		error: function(response) {}
    	});
    }

    function pushEventos() {
        $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/pushEventos.php',
            data: ({
                id: id
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                pushEventos = result;
            },
            error: function(response) {}
        });
    }
	
	function onPause() {
		setInterval(function(){
			if(notificacao == 1){
				var data = new Date();
				var dia = data.getDate();
				var mes = data.getMonth()+1;
				var ano = data.getFullYear();
				if(modoNotificacao == 1){
					if(dia == 31){
						if(mes == 12){
							dia = 1;
							mes = 1;
							ano = ano+1;
						}else{
							dia = 1;
							mes = mes+1;
						}
					}else if(dia == 30){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = dia+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 1;
							mes = mes+1;
						}
					}else if(dia == 29){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
							dia = dia+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = dia+1;
						}else if(mes == 2){
							dia = 1;
							mes = mes+1;
						}
					}else if(dia == 28){
						if(mes == 2){
							if((ano%4) == 0){
								dia = dia+1;
							}else{
								dia = 1;
								mes = mes+1;
							}
						}else{
							dia = dia+1;
						}
					}else{
						dia = dia+1;
					}
					var dataAtual = ""+ano+"-"+mes+"-"+dia+"";
					var i;
					for(i = 0; i<pushEventos.length;i++){
						var horaAtual = ""+data.getHours()+":"+data.getMinutes()+"";
						if(pushEventos[i]["data"] == dataAtual){
							if(horaAtual == "12:00"){
								pushNotification(pushEventos[i]["nome"], "1 dia");
							}
						}
					}
				}
				if(modoNotificacao == 2){
					if(dia == 31){
						if(mes == 12){
							dia = 2;
							mes = 1;
							ano = ano+1;
						}else{
							dia = 2;
							mes = mes+1;
						}
					}else if(dia == 30){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = 1;
							mes = mes+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 2;
							mes = mes+1;
						}else if(mes == 12){
							dia = 1;
							mes = 1;
							ano = ano+1;
						}
					}else if(dia == 29){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
							dia = dia+2;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 1;
							mes = mes+1;
						}else if(mes == 2){
							dia = 2;
							mes = mes+1;
						}
					}else if(dia == 28){
						if(mes == 2){
							if((ano%4) == 0){
								dia = 1;
								mes = mes+1;
							}else{
								dia = 2;
								mes = mes+1;
							}
						}else{
							dia = dia+2;
						}
					}else{
						dia = dia+2;
					}
					var dataAtual = ""+ano+"-"+mes+"-"+dia+"";
					var i;
					for(i = 0; i<pushEventos.length;i++){
						var horaAtual = ""+data.getHours()+":"+data.getMinutes()+"";
						if(pushEventos[i]["data"] == dataAtual){
							if(horaAtual == "12:00"){
								pushNotification(pushEventos[i]["nome"], "1 dia");
							}
						}
					}
				}
				if(modoNotificacao == 3){
					if(dia == 31){
						if(mes == 12){
							dia = 7;
							mes = 1;
							ano = ano+1;
						}else{
							dia = 7;
							mes = mes+1;
						}
					}else if(dia == 30){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = 6;
							mes = mes+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 7;
							mes = mes+1;
						}else if(mes == 12){
							dia = 6;
							mes = 1;
							ano = ano+1;
						}
					}else if(dia == 29){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = 5;
							mes = mes+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 6;
							mes = mes+1;
						}else if(mes == 12){
							dia = 5;
							mes = 1;
							ano = ano+1;
						}else{
							dia = 6;
							mes = mes+1;
						}
					}else if(dia == 28){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = 4;
							mes = mes+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 5;
							mes = mes+1;
						}else if(mes == 12){
							dia = 4;
							mes = 1;
							ano = ano+1;
						}else if(mes == 2){
							if((ano%4) == 0){
								dia = 6;
								mes = mes+1;
							}else{
								dia = 7;
								mes = mes+1;
							}
						}
					}else if(dia == 27){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = 3;
							mes = mes+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 4;
							mes = mes+1;
						}else if(mes == 12){
							dia = 3;
							mes = 1;
							ano = ano+1;
						}else if(mes == 2){
							if((ano%4) == 0){
								dia = 5;
								mes = mes+1;
							}else{
								dia = 6;
								mes = mes+1;
							}
						}
					}else if(dia == 26){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = 2;
							mes = mes+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 3;
							mes = mes+1;
						}else if(mes == 12){
							dia = 2;
							mes = 1;
							ano = ano+1;
						}else if(mes == 2){
							if((ano%4) == 0){
								dia = 4;
								mes = mes+1;
							}else{
								dia = 5;
								mes = mes+1;
							}
						}
					}else if(dia == 25){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10){
							dia = 1;
							mes = mes+1;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 2;
							mes = mes+1;
						}else if(mes == 12){
							dia = 1;
							mes = 1;
							ano = ano+1;
						}else if(mes == 2){
							if((ano%4) == 0){
								dia = 3;
								mes = mes+1;
							}else{
								dia = 4;
								mes = mes+1;
							}
						}
					}else if(dia == 24){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
							dia = dia+7;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = 1;
							mes = mes+1;
						}else if(mes == 2){
							if((ano%4) == 0){
								dia = 2;
								mes = mes+1;
							}else{
								dia = 3;
								mes = mes+1;
							}
						}
					}else if(dia == 23){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
							dia = dia+7;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = dia+7;
						}else if(mes == 2){
							if((ano%4) == 0){
								dia = 1;
								mes = mes+1;
							}else{
								dia = 2;
								mes = mes+1;
							}
						}
					}else if(dia == 22){
						if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
							dia = dia+7;
						}else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
							dia = dia+7;
						}else if(mes == 2){
							if((ano%4) == 0){
								dia= dia+7;
							}else{
								dia = 1;
								mes = mes+1;
							}
						}
					}else{
						dia = dia+7;
					}
					var dataAtual = ""+ano+"-"+mes+"-"+dia+"";
					var i;
					for(i = 0; i<pushEventos.length;i++){
						var horaAtual = ""+data.getHours()+":"+data.getMinutes()+"";
						if(pushEventos[i]["data"] == dataAtual){
							if(horaAtual == "12:00"){
								pushNotification(pushEventos[i]["nome"], "1 dia");
							}
						}
					}
				}
				if(modoNotificacao == 4){
					if(dia == 31){
						if(mes == 12){
							mes = mes+1;
							ano = ano+1;
						}else if(mes == 3 || mes == 5 || mes == 8 || 10){
							dia = 1;
							mes = mes+2;
						}else if(mes == 1){
							if((ano%4) == 0){
								dia = 2;
								mes = mes+2;
							}else{
								dia = 3;
								mes = mes+2;
							}
						}else{
							mes = mes+1;
						}
					}else if(dia == 30){
						if(mes == 1){
							if((ano%4) == 0){
								dia = 1;
								mes = mes+2;
							}else{
								dia = 2;
								mes = mes+2;
							}
						}else if(mes == 12){
							mes = mes+1;
							ano = ano+1;
						}else{
							mes = mes+1;
						}
					}else if(dia == 29){
						if(mes == 1){
							if((ano%4) == 0){
								mes = mes+1;
							}else{
								dia = 1;
								mes = mes+2;
							}
						}else if(mes == 12){
							mes = mes+1;
							ano = ano+1;
						}else{
							mes = mes+1;
						}
					}else if(dia == 28){
						if(mes == 1){
							mes = mes+1;
						}else if(mes == 12){
							mes = mes+1;
							ano = ano+1;
						}else{
							mes = mes+1;
						}
					}else{
						mes = mes+1;
					}
					var dataAtual = ""+ano+"-"+mes+"-"+dia+"";
					var i;
					for(i = 0; i<pushEventos.length;i++){
						var horaAtual = ""+data.getHours()+":"+data.getMinutes()+"";
						if(pushEventos[i]["data"] == dataAtual){
							if(horaAtual == "12:00"){
								pushNotification(pushEventos[i]["nome"], "1 dia");
							}
						}
					}
				}
			}
		}, 30000);
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA MENU

    function onBackKeyDown() {
    	if(pageNow == "menu") {
    		navigator.notification.confirm("Você deseja fazer logout?", confirmBtn, "", ["Sim", "Não"]);

    		function confirmBtn(btn) {
    			if(btn == 1) {
    				pageNow = "login";
    				document.getElementById("btnSair").click();
    				id = null;
    				isProfessor = null;
    				userName = null;
    				notificacao = null;
    				modoNotificacao = null;
    				fotoUser = null;
    				turma = null;
    				turmaUsers = null;
    				events = null;
    				token = null;
    			} else {}
    		}
    	} else if(pageNow == "turmas") {
    		pageNow = "menu"
    		document.getElementById("clickToMenu").click();
    	} else if(pageNow == "criarTurma") {
    		pageNow = "menu"
    		document.getElementById("clickToMenu").click();
    	} else if(pageNow == "notificacoes") {
    		pageNow = "menu"
    		document.getElementById("clickToMenu").click();
    	} else if(pageNow == "perfil") {
    		pageNow = "menu"
    		document.getElementById("clickToMenu").click();
    	} else if(pageNow == "eventos") {
    		pageNow = "turmas"
    		document.getElementById("bntTurmas").click();
    	} else if(pageNow == "cadastro") {
    		pageNow = "login"
    		document.getElementById("btnVoltaLogin").click();
    	} else if(pageNow == "addMembros") {
			//nada			
    	} else if(pageNow == "login") {
    		navigator.notification.confirm("Você deseja sair do aplicativo?", confirmaBtn, "", ["Sim", "Não"]);

    		function confirmaBtn(btn1) {
    			if(btn1 == 1) {
    				navigator.app.exitApp();
    			} else {}
    		}
    	} else {
    		window.history.back();
    	}
    }

    function minApp() {
    	window.plugins.appMinimize.minimize();
    }

    function sair() {
    	navigator.notification.confirm("Você deseja fazer logout?", confirmBtn, "", ["Sim", "Não"]);

    	function confirmBtn(btn) {
    		if(btn == 1) {
    			pageNow = "login";
    			document.getElementById("btnSair").click();
    			id = null;
    			isProfessor = null;
    			userName = null;
    			notificacao = null;
    			modoNotificacao = null;
    			fotoUser = null;
    			turma = null;
    			turmaUsers = null;
    			events = null;
    			token = null;
    		} else {}
    	}
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA CRIARTURMA

    function criarTurma() {
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/criaTurma.php',
    		data: ({
    			idRep: id,
    			foto: fotoTurma,
    			nome: document.getElementById("nomeTurmaCriar").value
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
                document.getElementById("idTurmaCriada").value = result.id;
    			document.getElementById("btnCriarTurmaNext").click();
    		},
    		error: function(response) {
    			navigator.notification.alert("Não foi possível criar uma turma!", null, "", "Ok");
    		}
    	});
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA PERFIL

    function carregaPerfil() {
    	var fotoPerfil = 'data:image/jpeg;base64,' + fotoUser;
    	$("#IMAGE2").attr('src', fotoPerfil);
        document.getElementById("idPagePerfil").innerHTML = ("Seu ID: " + id + "");
    	document.getElementById("usernamePerfil").value = userName;
    }

    function carregaPerfilMenu() {
    	pageNow = 'perfil';
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/carregaPerfil.php',
    		data: ({
    			id: id
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
    			fotoUser = result.foto;
    			userName = result.username;
    			var fotoPerfil = 'data:image/jpeg;base64,' + fotoUser;
    			$("#IMAGE2").attr('src', fotoPerfil);
    			document.getElementById("idPagePerfil").innerHTML = ("Seu ID: " + id + "");
    			document.getElementById("usernamePerfil").value = userName;
    		},
    		error: function(response) {}
    	});
    }

    function atualizaPerfil() {
    	userName = document.getElementById("usernamePerfil").value;
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/atlPerfil.php',
    		data: ({
    			id: id,
    			nome: userName,
    			foto: fotoUser
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
    			navigator.notification.alert("Perfil atualizado!", null, "", "Ok");
    		},
    		error: function(response) {
    			navigator.notification.alert("Erro ao atualizar perfil!", null, "", "Ok");
    		}
    	});
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA TURMAS

    function carregaTurmas() {
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/turma.php',
    		data: ({
    			id: id
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
    			turma = result;
    			var i;
    			$("#listaTurmas").empty();
    			for(i = 0; i < turma.length; i++) {
    				var item = "<li><a onclick='carregaEventos(" + turma[i]['id'] + "," + i + ")' href='#turmaEvent'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + turma[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + turma[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Clique para entrar</h6></h2></a></li>";
    				$("#listaTurmas").append(item);
    			}
    			$("#labelTurmas").html("&nbsp;Mostrando suas turmas:");

    		},
    		error: function(response) {
    			$("#labelTurmas").html("&nbsp;Você não está em nenhuma turma :(");
    		}
    	});
    }

    function carregaTurmasMenu() {
    	pageNow = 'turma';
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/turma.php',
    		data: ({
    			id: id
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
    			turma = result;
    			var i;
    			$("#listaTurmas").empty();
    			for(i = 0; i < turma.length; i++) {
    				var item = "<li><a onclick='carregaEventos(" + turma[i]['id'] + "," + i + ")' href='#turmaEvent'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + turma[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + turma[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Clique para entrar</h6></h2></a></li>";
    				$("#listaTurmas").append(item);
    			}
    			$("#labelTurmas").html("&nbsp;Mostrando suas turmas:");

    		},
    		error: function(response) {
    			$("#labelTurmas").html("&nbsp;Você não está em nenhuma turma :(");
    		}
    	});
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA TURMAEVENT

    function carregaEventos(idTurma, j) {
    	pageNow == "eventos";
		if(id != turma[j]["idRepresentante"]){
			if(isProfessor == 1){
				$("#btnCriarEventoRep").removeClass("hidden");
			}else{
				$("#btnCriarEventoRep").addClass("hidden");
			}
		}else{
			$("#btnCriarEventoRep").removeClass("hidden");
		}
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/evento.php',
    		data: ({
    			idTurma: idTurma
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
                turmaAtual = j;

    			$("#labelEventos").html("&nbsp;Mostrando eventos:");
    			var fotoTurmaBtn = 'data:image/jpeg;base64,' + turma[j]["foto"];
    			$("#imgTurma").attr('src', fotoTurmaBtn);
    			document.getElementById("nomeTurmaHeader").innerHTML = "" + turma[j]["nome"] + "";

    			events = result;
    			var i;
    			$("#listaEventos").empty();
    			for(i = 0; i < events.length; i++) {
                    var str1 = events[i]["data"];
                    str1 = str1.split("-");
    				var item = "<li><a class='icon calendar' onclick='eventoDetalhe("+i+","+j+")' href='#evento'><b>" + events[i]['nome'] + "</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+str1[2]+"/"+str1[1]+"/"+str1[0]+"</a></li>";
    				$("#listaEventos").append(item);
    			}

    		},
    		error: function(response) {
                turmaAtual = j;
    			$("#listaEventos").empty();
    			$("#labelEventos").html("&nbsp;Nenhum evento marcado!");
    			var fotoTurmaBtn = 'data:image/jpeg;base64,' + turma[j]["foto"];
    			$("#imgTurma").attr('src', fotoTurmaBtn);
    			document.getElementById("nomeTurmaHeader").innerHTML = "" + turma[j]["nome"] + "";
    		}
    	});
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA TURMAUSERS

    function carregaUsers() {
        if(id != turma[turmaAtual]["idRepresentante"]){
            $("#addMembrosTurmaBtn").addClass("hidden");
        }else{
			$("#addMembrosTurmaBtn").removeClass("hidden");
		}
        pageNow == "eventos";
        $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/carregaUsers.php',
            data: ({
                idTurma: turma[turmaAtual]["id"]
            }),
            dataType: "json",
            success: function(result, jqXHR) {

                var fotoTurma = 'data:image/jpeg;base64,' + turma[turmaAtual]["foto"];
                $("#IMAGE3").attr('src', fotoTurma);
                document.getElementById("titleMembrosHeader").innerHTML = "" + turma[turmaAtual]["nome"] + "";
                document.getElementById("nomeTurmaUsersTroca").value = turma[turmaAtual]["nome"];

                membros = result;
                var i;
                $("#listaMembros").empty();
                for(i = 0; i < membros.length; i++) {
                    var item;
                    if(membros[i]["id"] == turma[turmaAtual]["idRepresentante"]){
                       item = "<li><a onclick='usuarioDetalhe("+i+")' href='#usuario'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + membros[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + membros[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Representante</h6></h2></a></li>";
                    }else if(membros[i]["isProfessor"] == 1){
                        item = "<li><a onclick='usuarioDetalhe("+i+")' href='#usuario'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + membros[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + membros[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Professor</h6></h2></a></li>";
                    }else{
                        item = "<li><a onclick='usuarioDetalhe("+i+")' href='#usuario'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + membros[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + membros[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Aluno</h6></h2></a></li>";
                    }  
                    $("#listaMembros").append(item);
                }
            },
            error: function(response) {
                navigator.notification.alert("Não foi possível recuperar os detalhes da turma!", null, "", "Ok");
            }
        });
    }

    function atualizaNomeTurma() {
        userName = document.getElementById("usernamePerfil").value;
        $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/atlNomeTurma.php',
            data: ({
                id: turma[turmaAtual]["id"],
                nome: document.getElementById("nomeTurmaUsersTroca").value
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                turma[turmaAtual]["nome"] = document.getElementById("nomeTurmaUsersTroca").value;
                carregaUsers();
                navigator.notification.alert("Nome da turma atualizado!", null, "", "Ok");
            },
            error: function(response) {
                navigator.notification.alert("Erro ao atualizar nome da turma!", null, "", "Ok");
            }
        });
    }

    function sairTurma() {
		if(id != turma[turmaAtual]["idRepresentante"]){
			navigator.notification.confirm("Deseja mesmo sair da turma?", confirmBtnSairTurma, "", ["Sim", "Não"]);

			function confirmBtnSairTurma(btn){
				if(btn == 1){
					$.ajax({
						type: "POST",
						url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/removerMembro.php',
						 data:({   
							id: id,
							idTurma: turma[turmaAtual]['id']
						}),
						dataType: "json",
						success: function(result, jqXHR) {
							carregaTurmasMenu();
							carregaEventos(turma[turmaAtual]["id"], turmaAtual);
							carregaUsers();
							navigator.notification.alert("Você saiu da turma!", null, "", "Ok");
							document.getElementById("sairTurmaBtn").click();
						},
						error: function(response) {
							navigator.notification.alert("Erro ao sair da turma!", null, "", "Ok");
						}
					});
				}else{}
			}
		}else{
			navigator.notification.alert("Deixe de ser representante antes!", null, "", "Ok");
		}
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA USUARIO

    function usuarioDetalhe(i){
        document.getElementById("idUser").innerHTML = "ID: "+membros[i]["id"]+"";
        document.getElementById("nomeUser").innerHTML = "Nome de usuário: "+membros[i]["nome"]+"";
        document.getElementById("emailUser").innerHTML = "Email: "+membros[i]["email"]+"";
        document.getElementById("userIdDetalhe").value= membros[i]["id"];
        var fotoUserDetalhe = 'data:image/jpeg;base64,' + membros[i]["foto"];
        $("#fotoUserDetalhes").attr('src', fotoUserDetalhe);
        if(id != turma[turmaAtual]['idRepresentante']){
            $("#removeMembro").addClass("hidden");
            $("#tornaRep").addClass("hidden");
        }else{
			$("#removeMembro").removeClass("hidden");
            $("#tornaRep").removeClass("hidden");
		}
    }

    function removerMembro() {
        navigator.notification.confirm("Deseja mesmo remover este membro?", confirmBtnUser, "", ["Sim", "Não"]);

        function confirmBtnUser(btn){
            if(btn == 1){
                $.ajax({
                    type: "POST",
                    url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/removerMembro.php',
                    data: ({
                        id: document.getElementById("userIdDetalhe").value,
						turma: turma[turmaAtual]["id"]
                    }),
                    dataType: "json",
                    success: function(result, jqXHR) {
                        carregaTurmasMenu();
					    carregaEventos(turma[turmaAtual]["id"], turmaAtual);
					    carregaUsers();
						navigator.notification.alert("Membro removido!", null, "", "Ok");
                        document.getElementById("voltaUsers").click();
                    },
                    error: function(response) {
                        navigator.notification.alert("Erro ao remover membro!", null, "", "Ok");
                    }
                });
            }else{}
        }
    }

    function tornarRepresentante() {
        navigator.notification.confirm("Deseja mesmo tornar este membro representante?", confirmBtnRep, "", ["Sim", "Não"]);

        function confirmBtnRep(btn){
            if(btn == 1){
                $.ajax({
                    type: "POST",
                    url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/tornarRepresentante.php',
                    data: ({
                        id: document.getElementById("userIdDetalhe").value,
                        turma: turma[turmaAtual]['id']
                    }),
                    dataType: "json",
                    success: function(result, jqXHR) {
						carregaTurmasMenu();
					    carregaEventos(turma[turmaAtual]["id"], turmaAtual);
					    carregaUsers();
						navigator.notification.alert("Membro elevado ao cargo de representante!", null, "", "Ok");
                        document.getElementById("voltaUsers").click();
                    },
                    error: function(response) {
                        navigator.notification.alert("Erro ao tornar membro representante!", null, "", "Ok");
                    }
                });
            }else{}
        }
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA EVENTO

    function eventoDetalhe(i,j){
        document.getElementById("nomeEventoDetalhe").innerHTML = events[i]["nome"];
        document.getElementById("descricaoEventoDetalhe").innerHTML ="Descrição: "+events[i]["descricao"]+"";
        var str = events[i]["data"];
        str = str.split("-");
        document.getElementById("dataEventoDetalhe").innerHTML = "Data: "+str[2]+"/"+str[1]+"/"+str[0]+"";
        var hora = events[i]["hora"]
        hora = hora.split(':');
        document.getElementById("horaEventoDetalhe").innerHTML = "Hora: "+hora[0]+":"+hora[1]+"";
        document.getElementById("eventoIdDetalhe").value= i;
        if(id != turma[j]['idRepresentante']){
			if(isProfessor == 1){
				$("#editaEvento").removeClass("hidden");
				$("#excluiEvento").removeClass("hidden");
			}else{
				$("#editaEvento").addClass("hidden");
				$("#excluiEvento").addClass("hidden");
			}				
        }else{
			$("#editaEvento").removeClass("hidden");
            $("#excluiEvento").removeClass("hidden");
		}
    }

    function excluirEvento() {
        navigator.notification.confirm("Deseja mesmo remover este evento?", confirmBtnEvent1, "", ["Sim", "Não"]);

        function confirmBtnEvent1(btn){
            if(btn == 1){
                $.ajax({
                    type: "POST",
                    url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/removerEvento.php',
                    data: ({
                        id: events[document.getElementById("eventoIdDetalhe").value]["id"]
                    }),
                    dataType: "json",
                    success: function(result, jqXHR) {
                        navigator.notification.alert("Evento removido!", null, "", "Ok");
                        document.getElementById("eventosRecarregaExcluir").click();
                    },
                    error: function(response) {
                        navigator.notification.alert("Erro ao remover evento!", null, "", "Ok");
                    }
                });
            }else{}
        }
    }

    function editarEvento() {
        navigator.notification.confirm("Deseja editar este evento?", confirmBtnEvent2, "", ["Sim", "Não"]);

        function confirmBtnEvent2(btn){
            if(btn == 1){
                var ij = document.getElementById("eventoIdDetalhe").value;
                document.getElementById("nomedoeventoEditar").value = events[ij]["nome"];
                document.getElementById("descricaodoeventoEditar").value = events[ij]["descricao"];
                var dataEdita = ""+events[ij]["data"]+"T"+events[ij]["hora"]+"";
                document.getElementById("datetimedoeventoEditar").value = dataEdita;
                document.getElementById("valueOfI").value = ij;
                document.getElementById("editaEventoHref").click();
            }else{}
        }
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA NOTIFICAÇÕES

    function carregaNotificacao() {
    	if(notificacao == 1) {
    		if(modoNotificacao == 1) {
    			discheckOneDay();
    		} else if(modoNotificacao == 2) {
    			discheckTwoDays();
    		} else if(modoNotificacao == 3) {
    			discheckOneWeek();
    		} else if(modoNotificacao == 4) {
    			discheckOneMonth();
    		}
    	} else {
    		$("#idNotificacao").removeClass("icon check black");
    		$("#oneDay").removeClass("icon clock black");
    		$("#twoDays").removeClass("icon clock black");
    		$("#oneWeek").removeClass("icon clock black");
    		$("#oneMonth").removeClass("icon clock black");
    		$("#labelNotificacao").addClass("hidden");
    		$("#oneDay").addClass("hidden");
    		$("#twoDays").addClass("hidden");
    		$("#oneWeek").addClass("hidden");
    		$("#oneMonth").addClass("hidden");
    	}
    }

    function discheck() {
    	if($("#idNotificacao").hasClass("icon check black")) {
    		$("#idNotificacao").removeClass("icon check black");
    		$("#oneDay").removeClass("icon clock black");
    		$("#twoDays").removeClass("icon clock black");
    		$("#oneWeek").removeClass("icon clock black");
    		$("#oneMonth").removeClass("icon clock black");
    		$("#labelNotificacao").addClass("hidden");
    		$("#oneDay").addClass("hidden");
    		$("#twoDays").addClass("hidden");
    		$("#oneWeek").addClass("hidden");
    		$("#oneMonth").addClass("hidden");
    		notificacao = 0;
    	} else {
    		$("#idNotificacao").addClass("icon check black");
    		$("#labelNotificacao").removeClass("hidden");
    		$("#oneDay").removeClass("hidden");
    		$("#twoDays").removeClass("hidden");
    		$("#oneWeek").removeClass("hidden");
    		$("#oneMonth").removeClass("hidden");
    		notificacao = 1;
    		if(modoNotificacao == 1) {
    			discheckOneDay();
    		} else if(modoNotificacao == 2) {
    			discheckTwoDays();
    		} else if(modoNotificacao == 3) {
    			discheckOneWeek();
    		} else if(modoNotificacao == 4) {
    			discheckOneMonth();
    		}
    	}
    }

    function discheckOneDay() {
    	$("#oneDay").addClass("icon clock black");
    	$("#twoDays").removeClass("icon clock black");
    	$("#oneWeek").removeClass("icon clock black");
    	$("#oneMonth").removeClass("icon clock black");
    	modoNotificacao = 1;
    }

    function discheckTwoDays() {
    	$("#oneDay").removeClass("icon clock black");
    	$("#twoDays").addClass("icon clock black");
    	$("#oneWeek").removeClass("icon clock black");
    	$("#oneMonth").removeClass("icon clock black");
    	modoNotificacao = 2;
    }

    function discheckOneWeek() {
    	$("#oneDay").removeClass("icon clock black");
    	$("#twoDays").removeClass("icon clock black");
    	$("#oneWeek").addClass("icon clock black");
    	$("#oneMonth").removeClass("icon clock black");
    	modoNotificacao = 3;
    }

    function discheckOneMonth() {
    	$("#oneDay").removeClass("icon clock black");
    	$("#twoDays").removeClass("icon clock black");
    	$("#oneWeek").removeClass("icon clock black");
    	$("#oneMonth").addClass("icon clock black");
    	modoNotificacao = 4;
    }

    function atualizaNotificacao() {
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/atlNotificacao.php',
    		data: ({
    			id: id,
    			notificacao: notificacao,
    			modoNotificacao: modoNotificacao
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
    			navigator.notification.alert("Notificações atualizadas!", null, "", "Ok");
    		},
    		error: function(response) {
    			navigator.notification.alert("Erro ao atualizar notificações!", null, "", "Ok");
    		}
    	});
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA CADASTRO

    function cadastro() {
    	var emailCadastro = document.getElementById("emailCadastro").value;
    	var perguntaCadastro = document.getElementById("pergunta").value;
    	var respostaCadastro = document.getElementById("resposta").value;
    	var senhaCadastro = document.getElementById("passwordCadastro").value;
    	var userNameCadastro = document.getElementById("usernameCadastro").value;
    	var isProfessorCadastro = isProfessor;
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/cadastro.php',
    		data: ({
    			email: emailCadastro,
    			pergunta: perguntaCadastro,
    			resposta: respostaCadastro,
    			senha: senhaCadastro,
    			username: userNameCadastro,
    			isProfessor: isProfessorCadastro,
    			foto: fotoCadastro
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {
    			emailVerificacao(result.id, emailCadastro);
    			navigator.notification.alert("Cadastro completo! Agora ative a sua conta entrando no link do email de ativação!", null, "", "Ok");
				$("#IMAGE").attr('src', 'img/calender.png');
				document.getElementById("usernameCadastro").value = "";
				document.getElementById("emailCadastro").value = "";
				document.getElementById("passwordCadastro").value = "";
				document.getElementById("pergunta").value = "";
				document.getElementById("resposta").value = "";
    		},
    		error: function(response) {
    			navigator.notification.alert("Erro ao fazer o cadastro!", null, "", "Ok");
    		}
    	});
    }

    function emailVerificacao(idCadastro, emailCadastro) {
    	$.ajax({
    		type: "POST",
    		url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/email.php',
    		data: ({
    			id: idCadastro,
    			email: emailCadastro
    		}),
    		dataType: "json",
    		success: function(result, jqXHR) {},
    		error: function(response) {}
    	});
    }

    function alunoClass() {
    	$("#isProfessor").removeClass("icon user black");
    	$("#isAluno").addClass("icon user black");
    	isProfessor = 0;
    }

    function professorClass() {
    	$("#isAluno").removeClass("icon user black");
    	$("#isProfessor").addClass("icon user black");
    	isProfessor = 1;
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA RECUPERASENHA

    function isID() {
    	$("#isEmail").removeClass("icon key black");
    	$("#isId").addClass("icon key black");
    	$("#labelRecupera").html("ID");
    	document.getElementById('inputEmail').type = 'hidden';
    	document.getElementById('inputId').type = 'number';
    	recupera = 1;
    }

    function isEmail() {
    	$("#isId").removeClass("icon key black");
    	$("#isEmail").addClass("icon key black");
    	$("#labelRecupera").html("Email");
    	document.getElementById('inputEmail').type = 'email';
    	document.getElementById('inputId').type = 'hidden';
    	recupera = 2;
    }

    function recuperaPergunta() {
    	if(recupera == 1) {
    		$.ajax({
    			type: "POST",
    			url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/recuperaPerguntaId.php',
    			data: ({
    				id: document.getElementById('inputId').value
    			}),
    			dataType: "json",
    			success: function(result, jqXHR) {
                    idTrocaSenha = document.getElementById('inputId').value;
    				$("#pergnt").html("" + result.pergunta + "");
    				$("#divResposta").removeClass("hidden");
    				$("#pageTrocaSenha1").removeClass("hidden");
    				document.getElementById('inputResposta').type = 'text';
    			},
    			error: function(response) {
    				navigator.notification.alert("Id inexistente!", null, "", "Ok");
    			}
    		});
    	} else {
    		$.ajax({
    			type: "POST",
    			url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/recuperaPerguntaEmail.php',
    			data: ({
    				email: document.getElementById('inputEmail').value
    			}),
    			dataType: "json",
    			success: function(result, jqXHR) {
                    emailTrocaSenha = document.getElementById('inputEmail').value;
    				$("#pergnt").html("" + result.pergunta + "");
    				$("#divResposta").removeClass("hidden");
    				$("#btnResposta").removeClass("hidden");
    				document.getElementById('inputResposta').type = 'text';
    			},
    			error: function(response) {
    				navigator.notification.alert("Email inexistente!", null, "", "Ok");
    			}
    		});
    	}
    }

    function checaResposta() {
        if(recupera== 1){
            $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/checaRespostaId.php',
            data: ({
                id: idTrocaSenha,
				resposta: document.getElementById('inputResposta').value
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                document.getElementById("pageTrocaSenha").click();
            },
            error: function(response) {
                navigator.notification.alert("Resposta errada!", null, "", "Ok");
            }
            });
        }else{
            $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/checaRespostaEmail.php',
            data: ({
                email: emailTrocaSenha,
				resposta: document.getElementById('inputResposta').value
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                document.getElementById("pageTrocaSenha").click();
            },
            error: function(response) {
                navigator.notification.alert("Resposta errada!", null, "", "Ok");
            }
            });
        }
    	
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA MUDASENHA

    function trocaSenha() {
        if(recupera== 1){
            $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/trocaSenhaId.php',
            data: ({
                id: idTrocaSenha,
                senha: document.getElementById('novaSenha').value
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                navigator.notification.alert("Senha alterada com sucesso!", null, "", "Ok");
				document.getElementById("novaSenha").value = "";
				document.getElementById("inputResposta").value = "";
				document.getElementById("inputId").value = "";
				document.getElementById("inputEmail").value = "";
                document.getElementById("trocaSenhaMainPage").click();
            },
            error: function(response) {
                navigator.notification.alert("Não foi possível trocar a senha!", null, "", "Ok");
            }
            });
        }else{
            $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/trocaSenhaEmail.php',
            data: ({
                email: emailTrocaSenha,
                senha: document.getElementById('novaSenha').value
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                navigator.notification.alert("Senha alterada com sucesso!", null, "", "Ok");
				document.getElementById("novaSenha").value = "";
				document.getElementById("inputResposta").value = "";
				document.getElementById("inputId").value = "";
				document.getElementById("inputEmail").value = "";
                document.getElementById("trocaSenhaMainPage").click();
            },
            error: function(response) {
                navigator.notification.alert("Não foi possível trocar a senha!", null, "", "Ok");
            }
            });
        }
        
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA CRIAREVENTO

    function criarEvento() {
        var nomeDoEvento = document.getElementById("nomedoevento").value;
        var descricaoDoEvento = document.getElementById("descricaodoevento").value;
        var datetimeDoEvento = document.getElementById("datetimedoevento").value;
        datetimeDoEvento = datetimeDoEvento.split("T");

        $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/criaEvento.php',
            data: ({
                nome: nomeDoEvento,
                descricao: descricaoDoEvento,
                data: datetimeDoEvento[0],
                hora: datetimeDoEvento[1],
                idTurma: turma[turmaAtual]['id']
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                navigator.notification.alert("Evento criado!", null, "", "Ok");
				document.getElementById("nomedoevento").value = "";
				document.getElementById("descricaodoevento").value = "";
				document.getElementById("datetimedoevento").value = "";
                document.getElementById("eventosRecarrega").click();
            },
            error: function(response) {
                navigator.notification.alert("Erro ao criar evento!", null, "", "Ok");
            }
        });
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA EDITAREVENTO

    function atualizarEvento() {
        var nomeDoEvento = document.getElementById("nomedoeventoEditar").value;
        var descricaoDoEvento = document.getElementById("descricaodoeventoEditar").value;
        var datetimeDoEvento = document.getElementById("datetimedoeventoEditar").value;
        datetimeDoEvento = datetimeDoEvento.split("T");

        $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/atualizarEvento.php',
            data: ({
                nome: nomeDoEvento,
                descricao: descricaoDoEvento,
                data: datetimeDoEvento[0],
                hora: datetimeDoEvento[1],
                id: events[document.getElementById("valueOfI").value]['id']
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                navigator.notification.alert("Evento atualizado!", null, "", "Ok");
				document.getElementById("nomedoeventoEditar").value = "";
				document.getElementById("descricaodoeventoEditar").value = "";
				document.getElementById("datetimedoeventoEditar").value = "";
                document.getElementById("eventosRecarregaEdita").click();
            },
            error: function(response) {
                navigator.notification.alert("Erro ao atualizar evento!", null, "", "Ok");
            }
        });
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA ADDMEMBROS

    function isAddID() {
        $("#isEmailAdd").removeClass("icon check black");
        $("#isIdAdd").addClass("icon check black");
        addEscolha = 1;
    }

    function isAddEmail() {
        $("#isIdAdd").removeClass("icon check black");
        $("#isEmailAdd").addClass("icon check black");
        addEscolha = 2;
    }

    function procuraUsers(){
        if(document.getElementById("procuraInput").value != ""){
            if(addEscolha == 1){
                $.ajax({
                type: "POST",
                url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/procuraUsersId.php',
                data: ({
                    id: document.getElementById("procuraInput").value
                }),
                dataType: "json",
                success: function(result, jqXHR) {
                    userPesq = result;
                    var i;
                    $("#listaUserProcurado").empty();
                    for(i = 0; i < userPesq.length; i++) {
                        var item;
                        if(userPesq[i]["isProfessor"] == 1){
                            item = "<li><a onclick='addUserSelec("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Professor</h6></h2></a></li>";
                        }else{
                            item = "<li><a onclick='addUserSelec("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Aluno</h6></h2></a></li>";
                        }
                        $("#listaUserProcurado").append(item);
                    }
                },
                error: function(response) {
                }
                });
            }else{
                $.ajax({
                type: "POST",
                url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/procuraUsersEmail.php',
                data: ({
                    email: document.getElementById("procuraInput").value
                }),
                dataType: "json",
                success: function(result, jqXHR) {
                    userPesq = result;
                    var i;
                    $("#listaUserProcurado").empty();
                    for(i = 0; i < userPesq.length; i++) {
                        var item;
                        if(userPesq[i]["isProfessor"] == 1){
                            item = "<li><a onclick='addUserSelec("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Professor</h6></h2></a></li>";
                        }else{
                            item = "<li><a onclick='addUserSelec("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Aluno</h6></h2></a></li>";
                        }                   
                        $("#listaUserProcurado").append(item);
                    }
                },
                error: function(response) {
                }
                });
            }
        }else{
            $("#listaUserProcurado").empty();
        }

    }

    function addUserSelec(idPesq, i){
		$("#listaUserProcurado").empty();
        $("#listaUserSelec").remove();
        var pos = userForAdd.push(idPesq) - 1;
        var item;
        if(userPesq[i]["isProfessor"] == 1){
            var strTipo = "Professor";
            item = "<li id='"+idPesq+"'><a onclick='deleteSelect("+pos+","+idPesq+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64,"+userPesq[i]['foto']+"' align='left' height='50px' width='65px'/>&nbsp;"+userPesq[i]['nome']+"<br><h6>&nbsp;&nbsp;&nbsp;Professor</h6></h2></a></li>";
        }else{
            var strTipo = "Aluno";
            item = "<li id='"+idPesq+"'><a onclick='deleteSelect("+pos+","+idPesq+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64,"+userPesq[i]['foto']+"' align='left' height='50px' width='65px'/>&nbsp;"+userPesq[i]['nome']+"<br><h6>&nbsp;&nbsp;&nbsp;Aluno</h6></h2></a></li>";
        }
        $("#listaUserSelecionado").append(item);
    }

    function deleteSelect(pos, idPesq1){
        userForAdd.splice(pos,1);
        $("#"+idPesq1+"").remove();
    }

    function addMembrosIrTurma(){
        $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/addMembros.php',
            data:({   
                idTurma: document.getElementById("idTurmaCriada").value,
                usersForAdd: userForAdd,
				tam: userForAdd.length
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                navigator.notification.alert("Turma Criada!", null, "", "Ok");
				carregaTurmasMenu();
				document.getElementById("nomeTurmaCriar").value = "";
				$("#IMAGE1").attr('src', 'img/calender.png');
				$("#listaUserProcurado").empty();
				$("#listaUserSelecionado").empty();
                document.getElementById("bntTurmas").click();
            },
            error: function(response) {
                navigator.notification.alert("Erro ao criar turma!", null, "", "Ok");
            }
        });
    }

    //FUNÇÕES EM RELAÇÃO A PÁGINA ADDMEMBROSTURMA

    function isAddIDTurma() {
        $("#isEmailAddTurma").removeClass("icon check black");
        $("#isIdAddTurma").addClass("icon check black");
        addEscolha = 1;
    }

    function isAddEmailTurma() {
        $("#isIdAddTurma").removeClass("icon check black");
        $("#isEmailAddTurma").addClass("icon check black");
        addEscolha = 2;
    }

    function procuraUsersTurma(){
        if(document.getElementById("procuraInputTurma").value != ""){
            if(addEscolha == 1){
                $.ajax({
                type: "POST",
                url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/procuraUsersId.php',
                data: ({
                    id: document.getElementById("procuraInputTurma").value
                }),
                dataType: "json",
                success: function(result, jqXHR) {
                    userPesq = result;
                    var i;
                    $("#listaUserProcuradoTurma").empty();
                    for(i = 0; i < userPesq.length; i++) {
                        var item;
                        if(userPesq[i]["isProfessor"] == 1){
                            item = "<li><a onclick='addUserSelecTurma("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Professor</h6></h2></a></li>";
                        }else{
                            item = "<li><a onclick='addUserSelecTurma("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Aluno</h6></h2></a></li>";
                        }
                        $("#listaUserProcuradoTurma").append(item);
                    }
                },
                error: function(response) {
                }
                });
            }else{
                $.ajax({
                type: "POST",
                url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/procuraUsersEmail.php',
                data: ({
                    email: document.getElementById("procuraInputTurma").value
                }),
                dataType: "json",
                success: function(result, jqXHR) {
                    userPesq = result;
                    var i;
                    $("#listaUserProcuradoTurma").empty();
                    for(i = 0; i < userPesq.length; i++) {
                        var item;
                        if(userPesq[i]["isProfessor"] == 1){
                            item = "<li><a onclick='addUserSelecTurma("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Professor</h6></h2></a></li>";
                        }else{
                            item = "<li><a onclick='addUserSelecTurma("+userPesq[i]["id"]+","+i+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64," + userPesq[i]['foto'] + "' align='left' height='50px' width='65px'/>&nbsp;" + userPesq[i]['nome'] + "<br><h6>&nbsp;&nbsp;&nbsp;Aluno</h6></h2></a></li>";
                        }                   
                        $("#listaUserProcuradoTurma").append(item);
                    }
                },
                error: function(response) {
                }
                });
            }
        }else{
            $("#listaUserProcuradoTurma").empty();
        }

    }

    function addUserSelecTurma(idPesq, i){
		$("#listaUserProcuradoTurma").empty();
        $("#listaUserSelecTurma").remove();
        var pos = userForAdd.push(idPesq) - 1;
        var item;
        if(userPesq[i]["isProfessor"] == 1){
            var strTipo = "Professor";
            item = "<li id='"+idPesq+"'><a onclick='deleteSelectTurma("+pos+","+idPesq+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64,"+userPesq[i]['foto']+"' align='left' height='50px' width='65px'/>&nbsp;"+userPesq[i]['nome']+"<br><h6>&nbsp;&nbsp;&nbsp;Professor</h6></h2></a></li>";
        }else{
            var strTipo = "Aluno";
            item = "<li id='"+idPesq+"'><a onclick='deleteSelectTurma("+pos+","+idPesq+")'><h2 style='color: black;'><img src = 'data:image/jpeg;base64,"+userPesq[i]['foto']+"' align='left' height='50px' width='65px'/>&nbsp;"+userPesq[i]['nome']+"<br><h6>&nbsp;&nbsp;&nbsp;Aluno</h6></h2></a></li>";
        }
        $("#listaUserSelecionadoTurma").append(item);
    }

    function deleteSelectTurma(pos, idPesq1){
        userForAdd.splice(pos,1);
        $("#"+idPesq1+"").remove();
    }

    function addMembrosIrTurmaTurma(){
        $.ajax({
            type: "POST",
            url: 'http://web.farroupilha.ifrs.edu.br/paginas/~vinicius.meng/Projetos/Schoolendar/addMembros.php',
            data:({
                idTurma: turma[turmaAtual]["id"],
                usersForAdd: userForAdd,
				tam: userForAdd.length
            }),
            dataType: "json",
            success: function(result, jqXHR) {
                navigator.notification.alert("Membros Adicionados!", null, "", "Ok");
				$("#listaUserProcuradoTurma").empty();
				$("#listaUserSelecionadoTurma").empty();
                document.getElementById("btnTurmaEventImg").click();
            },
            error: function(response) {
                navigator.notification.alert("Erro ao adicionar membros!", null, "", "Ok");
            }
        });
    }


    //FUNÇÃO PARA O TECLADO NÃO FICAR EM CIMA DO INPUT EM FOCO

    function scrolling() {
    	setTimeout(function() {
    		$('body').scrollTo(200);
    	}, 300);
    }