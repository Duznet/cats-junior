﻿	function copyMap(i){
		curMap[i] = [];
		for (var k = 0; k < mapFromTest[i].length; ++k){
			curMap[i][k] = new Array();
			for (var l = 0; l < mapFromTest[i][k].length; ++l)
				curMap[i][k][l] = mapFromTest[i][k][l];
		}
	}
	function callScript(url, callback){
		if (atHome){
			$.ajax({
				async: false,
				dataType : "json",
				url: 'script.php',
				data: 'url='+ url,
				success: function(data) {
					callback(data);
				},
				error: function(r, err1, err2){
					//alert(r.responseText);
					alert(err1 + ' ' + err2);
				}  
			});
		} 
		else{
			$.ajax({
				async: false,
				dataType : "json",
				url: url,
				success: function(data) {
					callback(data);
				}
			});
		}
	}
	function callSubmit_(serv, path, submitData, callback){
		if (!atHome)
			return;
		$.ajax({  
			async: false,
			url: "submit.php",
			type: "POST",
			data: 'serv='+ serv + '&' + 'path=' + path + '&' + submitData,  
			success: function(html){  
				callback(html);
			}  
		});  
	}
	function callSubmit(url, submitData, path, serv, sep, l, callback){
		if (atHome)
			return;
		$.ajax({  
			async: false,
			url: url,
			type: "POST",
			contentType: 'multipart/form-data',
			data: submitData,
			beforeSend: function(xhr){
				xhr.setRequestHeader('Host', serv);
				xhr.setRequestHeader('Connection', 'keep-alive');
				xhr.setRequestHeader('Referer', url);
				return true;
			},  
			success: function(html){  
				callback(html);
			},
			error: function(r, err1, err2){
				alert(err1 + " " + err2);
			}  
		}); 
	}
	function getProblemStatement(i){
		$.ajax({
			async: false,
			dataType : "json",
			url: 'problems/' + (i + 1) + '/problem.json',
			success: function(data) {
				if (!data)
					return;
				problems[i] = new Object();
				problems[i].name = data.name;
				problems[i].statement = data.statement;
				problems[i].testsNum = data.testsNum;
				problems[i].commands = data.commands.slice();
				problems[i].start_life = data.start_life;
				problems[i].d_life = data.d_life;
				problems[i].start_pnts = data.start_pnts;
				problems[i].finish_symb = data.finish_symb;
			},
			error: function(r, err1, err2){
				alert(r.responseText);
			}
		});
	}
	function getTest(l, k){
		$.ajax({
			async: false,
			dataType : "json",
			url: 'problems/' + (l  + 1) + '/Tests/' + k +'.json',
			success: function(data) {
				if (!data)
					return;
				mapFromTest[l] = [];
				mapFromTest[l] = data.map.slice();
				var tmp = data.spec_symbols;
				specSymbols[l] = new Object();
				specSymbols[l].list  = [];
				specSymbols[l].style_list = [];
				specSymbols[l].count = [];
				specSymbols[l].names = [];
				specSymbols[l].points = [];
				specSymbols[l].d_life = [];
				specSymbols[l]["do"] = [];
				specSymbols[l].coord = new Object();
				specSymbols[l].coord.x = [];
				specSymbols[l].coord.y = [];
				specSymbols[l].style = [];
				specSymbols[l].cur_count = [];
				specSymbols[l].symb = [];
				specSymbols[l].symbol = [];
				for (var i = 0; i < tmp.length; ++i){
					specSymbols[l].list[i]  = tmp[i].symbol;
					specSymbols[l].style_list[i] = tmp[i].style;
					specSymbols[l].count[i] = tmp[i].count;
					specSymbols[l].names[i] = tmp[i].name;
					specSymbols[l].points[i] = tmp[i].points;
					specSymbols[l].d_life[i] = tmp[i].d_life;
					specSymbols[l]["do"][i] = tmp[i]["do"];
				}
				problems[l].cleaner = data.cleaner.slice();
				problems[l].cleaned = [];
				for (var i = 0; i < data.cleaned.length; ++i)
					problems[l].cleaned[i] = data.cleaned[i].slice();
				if (data.commands)
					problems[l].commands = data.commands.slice();
				if (data.start_life)
					problems[l].start_life = data.start_life;
				if (data.d_life)
					problems[l].d_life = data.d_life;
				if (data.start_pnts)
					problems[l].start_pnts = data.start_pnts;
				if (data.finish_symb)
					problems[l].finish_symb = data.finish_symb;
				var tmp = data.moving_elements;
				movingElems[l] = [];
				movingElems[l].style = [];
				movingElems[l].path = [];
				movingElems[l].looped = [];
				movingElems[l].die = [];
				movingElems[l].symbol = [];
				for (var i = 0; i < tmp.length; ++i){
					movingElems[l].style.push(tmp[i].style);
					movingElems[l].path[i] = [];
					for (var j = 0; j < tmp[i].path.length; ++j)
						movingElems[l].path[i].push(tmp[i].path[j]);
					movingElems[l].looped.push(tmp[i].looped);
					movingElems[l].die.push(tmp[i].die);
					movingElems[l].symbol.push(mElemId);
					mapFromTest[l][tmp[i].path[0].y][tmp[i].path[0].x] = "" + mElemId++;
				}
			},
			error: function(r, err1, err2){
				alert(r.responseText);
			}
		});
	}
	function changeClass(elem){
		if (!elem)
			return false;
		elem = $("#" + elem);
		var divs = ['forward', 'right', 'left', 'wait'];
		for (var k = 0; k < divs.length; ++k){
			if (elem.hasClass(divs[k])){
				elem.removeClass(divs[k]);
				elem.addClass(divs[k] + 1);
			}   
			else if (elem.hasClass(divs[k] + 1)){
				elem.removeClass(divs[k] + 1);
				elem.addClass(divs[k]);
			}
		}
	}
	function isChangedClass(elem){
		if (!elem)
			return false;
		elem = $("#" + elem);
		var divs = ['forward', 'right', 'left', 'wait'];
		for (var k = 0; k < divs.length; ++k)
			if (elem.hasClass(divs[k] + 1))
				return true;
		return false;
	}
	function clearClasses(){
		var el = $("#sortable" + curProblem).children();
		l = el.length;
		for (var i = 0; i < l; ++i){
			if (isChangedClass(el.attr('id')))
				changeClass(el.attr('id'));
			el = el.next();
		}
	}
	function updated(){
		var arr = $("#sortable" + curProblem).sortable('toArray');
		var needToClear = false;
		var k = 0;
		for (var i = 0; i < arr.length; ++i){
			//cmdIndexes[i] = cmdIndexes[i].substr(3);
			var c = parseInt($('#' + arr[i] + ' input')[0].value);
			curList[curProblem][k++] = "_" + arr[i];
			for (var j = 0; j < divs.length; ++j)
				if ($('#' + arr[i]).hasClass(divs[j]) || $('#' + arr[i]).hasClass("" + divs[j] + 1)){
					for (var l = 0; l < c; ++l){
						if ((divs[j] != curList[curProblem][k]) && (k <= curCmdIndex[curProblem]))
							needToClear = true;
						curList[curProblem][k++] = divs[j];
					}
					break;
				}
		}
		if (needToClear){
			setDefault();
			clearClasses();
		}
	}
	function setDefault(f){
		enableButtons();
		$("#sortable" + curProblem).sortable( "enable" );
		dead[curProblem] = false;
		var s = '#' + (curProblem* 10000 + curY[curProblem] * 100 + curX[curProblem]);
		$(s).empty();
		for (var i = 0; i < curMap[curProblem].length; ++i){
			for (var j = 0; j < curMap[curProblem][i].length; ++j){
				s = '#' + (curProblem* 10000 + i * 100 + j);
				$(s).empty();
			}
		}
		for (var k = 0; k < specSymbols[curProblem].coord.x.length; ++k){
			s = "#" + (curProblem* 10000 + specSymbols[curProblem].coord.y[k] * 100 + specSymbols[curProblem].coord.x[k]);
			$(s).empty();
			$(s).append("<div class = '" + specSymbols[curProblem].style[k] + "'></div>");
			specSymbols[curProblem].cur_count[k] = 0;
		}
		for (var k = 0; k < movingElems[curProblem].symbol.length; ++k){
			s = "#" + (curProblem* 10000 + movingElems[curProblem].path[k][curCmdIndex[curProblem] % movingElems[curProblem].symbol.length].y * 100 + movingElems[curProblem].path[curCmdIndex[curProblem] % movingElems[curProblem].symbol.length][0].x);
			$(s).empty();
			s = "#" + (curProblem* 10000 + movingElems[curProblem].path[k][0].y * 100 + movingElems[curProblem].path[k][0].x);
			$(s).prepend("<div class = '" + movingElems[curProblem].style[k] + "'></div>");
		}
		for (var k = 0; k < problems[curProblem].cleaner.length; ++k){			
			var y = problems[curProblem].cleaner[k].y;			
			var x = problems[curProblem].cleaner[k].x;			
			var s = '#' + (curProblem* 10000 + y * 100 + x);			
			$(s).append('<div class = "key"></div>');			
			for (var l = 0; l < problems[curProblem].cleaned[k].length; ++l){				
				y = problems[curProblem].cleaned[k][l].y;				
				x = problems[curProblem].cleaned[k][l].x				
				s = '#' + (curProblem* 10000 + y * 100 + x);				
				$(s).removeClass('floor');				
				//$(s).addClass('wall');				
				$(s).append('<div class = "lock"></div>');			
			}		
		}
		copyMap(curProblem);
		pause[curProblem] = false;
		$("#cons" + curProblem).empty();
		curDir[curProblem] = startDir;
		curX[curProblem] = startX[curProblem];
		curY[curProblem] = startY[curProblem];
		clearClasses();
		stopped[curProblem] = false;
		curCmdIndex[curProblem] = 0;
		curDivName[curProblem] = "";
		if (!f){
			s = "#" + (curProblem* 10000 + curY[curProblem] * 100 + curX[curProblem]);
			$(s).append("<div class = '" + curDir[curProblem] + "'></div>");
		}
	}
	function loop(i, cnt, result){
		var newCmd = undefined;
		if (dead[curProblem])
			return;
		if (pause[curProblem] || stopped[curProblem]){
			if (pause[curProblem])
				pause[curProblem] = false;
			else{
				stopped[curProblem] = false;
				setDefault();
			}
			curCmdIndex[curProblem] = i;
			return;
		}
		var t = result[i];
		if (t.charAt(0) == "_"){
			newCmd = t.substr(1);
			t = result[++i];
			if (i == cnt)
				return;
		}
		if (i > curCmdIndex[curProblem]){
			if (speed[curProblem] != 0 && curDivName[curProblem] && isChangedClass(curDivName[curProblem]))
				changeClass(curDivName[curProblem]);
			if (newCmd){
				curDivName[curProblem] = newCmd;
				curDivIndex[curProblem]++;
			}
		}
		var x = curX[curProblem];
		var y = curY[curProblem];
		while(t.charAt(t.length - 1) >= "0" && t.charAt(t.length - 1) <= "9")
			t = t.substr(0, t.length - 1);
		dx[curProblem] = changeDir[t][curDir[curProblem]].dx;
		dy[curProblem] = changeDir[t][curDir[curProblem]].dy;
		curDir[curProblem] = changeDir[t][curDir[curProblem]].curDir;
		var checked = checkCell(i);
		if (dead[curProblem])
			return;
		if (checked)
			if (curX[curProblem] + dx[curProblem] >= 0 && curX[curProblem] + dx[curProblem] < curMap[curProblem][0].length 
				&& curY[curProblem] + dy[curProblem] >= 0 && curY[curProblem] + dy[curProblem] < curMap[curProblem].length)
				if ((curMap[curProblem][curY[curProblem] + dy[curProblem]][curX[curProblem] + dx[curProblem]] != '#') &&
					(curMap[curProblem][curY[curProblem] + dy[curProblem]][curX[curProblem] + dx[curProblem]] != '#_')){
					curX[curProblem] += dx[curProblem];
					curY[curProblem] += dy[curProblem];
				}
				else{
						$("#cons" + curProblem).append("Шаг " + i + ": Уткнулись в стенку \n");
						var s = '#' + (curProblem* 10000 + curY[curProblem] * 100 + curX[curProblem]);
						$(s).effect("highlight", {}, 300);
					}
			else
				$("#cons" + curProblem).append("Шаг " + i + ": Выход за границу лабиринта \n");
		if (curDivName[curProblem]){
			var numId = $("#" + curDivName[curProblem]).attr('numId');
			var newCnt = $("#spinCnt" + numId).attr('cnt') - 1;
			$("#spinCnt" + numId).attr('cnt', newCnt);
			$("#spinCnt" + numId).attr('value', newCnt + "/" + $("#spin" + numId).attr('value'));
		}
		if (!(speed[curProblem] == 0 && (i + 1) < cnt)){
			if (checked){
				s = '#' + (curProblem* 10000 + y * 100 + x);
				$(s).empty();
				s = '#' + (curProblem* 10000 + curY[curProblem] * 100 + curX[curProblem]);
				$(s).append('<div class = "' + curDir[curProblem]+'"></div>');
			}
			if (newCmd)
				changeClass(curDivName[curProblem]);
			setTimeout(function() { nextStep(i, cnt, result); }, speed[curProblem]);
		}
		else
			nextStep(i, cnt, result);
	}
	function nextStep(i, cnt, result){
		if (dead[curProblem])
			return;
		if (++i <cnt) {
			loop(i, cnt, result);
		} 
		else {
			curCmdIndex[curProblem] = i; 
			playing[curProblem] = false;
			$("#sortable" + curProblem).sortable( "enable" );
			enableButtons();
			showCounters();
		}
	}
	function play(result, cnt){
		if (dead[curProblem])
			return;
		playing[curProblem] = true;
		if (curCmdIndex[curProblem] == result.length)
			setDefault();
		if (!cnt)
			cnt = result.length;
		if (result[curCmdIndex[curProblem]] == "")
			++curCmdIndex[curProblem];
		var j = cnt - curCmdIndex[curProblem];
		loop(curCmdIndex[curProblem], cnt, result);
	}