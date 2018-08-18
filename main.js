			var id_match;
			var mytime;
			var status = false;
			var type;
			var successline;
			var clearx;
			var clearo;
			var col = 20;
			var row = 20;
			rightTo = col - 1;
			leftTo = col + 1;
			for (i = 1; i <= row; i++) {
			    $('#caroTable').append('<tr data-rowId=' + i + '><tr>');
			    var appendData = '';
			    for (z = 1; z <= col; z++) {
			        appendData += '<td data-id="' + ((i - 1) * col + z) + '"></td>';
			    }
			    $('tr[data-rowId="' + i + '"]').append(appendData);
			}
			var conn = new WebSocket("wss://node2.wsninja.io");
			conn.onopen = function(e) {
			    console.log("Kết nối server thành công!");
			    conn.send(JSON.stringify({
			        guid: "YOUR_WSNINJA_KEY"
			    }));
			    var checkstt = setInterval(function() {
			        if (id_match != null) {
			            $.ajax({
			                method: 'get',
			                url: './whoplay.php?id_match=' + id_match,
			                success: function(data) {
			                    data = JSON.parse(data);
			                    type = data.mytype;
			                    if (type == 'x' && data.status == 'success') {
			                        $('#mytime').html('<p style="color:green">Lượt chơi: Đến lượt bạn !</p>');
			                        mytime = true;
			                    } else mytime = false;
			                    id_match = data.id_match;
			                    $('#myinfo').html('Bạn bên: ' + type);
			                    if (data.status == 'pending') {
			                        $('#status').html('Trạng thái: Đang tìm đứa dở hơi nào đó chơi với bạn...');
			                    } else {
			                        $('#status').html('Trạng thái: <p style="color:green">Đã tìm thấy đứa dở hơi đánh với bạn !</p>');
			                        clearInterval(checkstt);
			                    }
			                }
			            });
			        } else {
			            $.ajax({
			                method: 'get',
			                url: './whoplay.php',
			                success: function(data) {
			                    data = JSON.parse(data);
			                    type = data.mytype;
			                    if (type == 'x' && data.status == 'success') {
			                        $('#mytime').html('<p style="color:green">Lượt chơi: Đến lượt bạn !</p>');
			                        mytime = true;
			                    } else mytime = false;
			                    id_match = data.id_match;
			                    $('#myinfo').html('Bạn bên: ' + type);
			                    if (data.status == 'pending') {
			                        $('#status').html('Trạng thái: Đang tìm đứa dở hơi nào đó chơi với bạn...');
			                    } else {
			                        $('#status').html('Trạng thái: <p style="color:green">Đã tìm thấy đứa dở hơi đánh với bạn !</p>');
			                        clearInterval(checkstt);
			                    }
			                }
			            });
			        }
			    }, 1500);
			};
			conn.onclose = function(x) {}
			conn.onmessage = function(e) {
			    e = JSON.parse(e.data);
			    if (id_match == e.id_match && e.yourtype != type && !e.action) {
			        id = e.areaId;
			        yourtype = e.yourtype;
			        if (yourtype == 'x' && $('td[data-id="' + id + '"]').html() == '') {
			            $('td[data-id="' + id + '"]').html('X');
			            $('td[data-id="' + id + '"]').attr('data-xid', 'x');
			        }
			        if (yourtype == 'o' && $('td[data-id="' + id + '"]').html() == '') {
			            $('td[data-id="' + id + '"]').html('O');
			            $('td[data-id="' + id + '"]').attr('data-oid', 'o');
			        }
			        $('#mytime').html('<p style="color:green">Lượt chơi: Đến lượt bạn !</p>');
			        mytime = true;
			    } else if (e.action == 'win' && e.idlist && id_match == e.id_match) {
			        console.log('Bạn đã thua');
			        dataWin = e.idlist;
			        var colorline = 1;
			        clearo = setInterval(function() {
			            if (colorline % 2 == 1) colornum = 'red';
			            else colornum = 'black';
			            colorline++;
			            for (i = 0; i < dataWin.length; i++) {
			                $('td[data-id="' + dataWin[i] + '"]').css('color', colornum);
			            }
			        }, 400);
			        mytime = false;
			        $('#info_match').html('<p style="color:red">Bạn đã thua !</p><button onclick="reset_game();" style="border:none; border-radius:5px;height:30px;width:70;color:white;background:#5435b0">Game Mới</button>');
			    } else if (e.action == "new_game" && id_match == e.id_match) {
			        $('#info_match').html('<p style="color:green">Yêu cầu tạo game mới</p><button onclick="acpt_reset_game();" style="border:none; border-radius:5px;height:30px;width:70;color:white;background:#5435b0">Chấp nhận</button>');
			    } else if (e.action == "accept" && id_match == e.id_match) {
			        acpt_reset_game_withoutsend();
			    }
			}
			$('td').click(function() {
			    if ($('td[data-id="' + $(this).data('id') + '"]').html() == 'X' || $('td[data-id="' + $(this).data('id') + '"]').html() == 'O') return false;
			    if (mytime == true) {
			        id = $(this).data('id');
			        if (type == 'x' && $('td[data-id="' + id + '"]').html() == '') {
			            $('td[data-id="' + id + '"]').html('X');
			            $('td[data-id="' + id + '"]').attr('data-xid', 'x');
			        }
			        if (type == 'o' && $('td[data-id="' + id + '"]').html() == '') {
			            $('td[data-id="' + id + '"]').html('O');
			            $('td[data-id="' + id + '"]').attr('data-oid', 'o');
			        }
			        $('#mytime').html('<p style="color:black">Lượt chơi: Đến lượt người kia !</p>');
			        conn.send(JSON.stringify({
			            yourtype: type,
			            areaId: id,
			            id_match: id_match
			        }));
			        mytime = false;
			        var id = [];
			        $('td[data-' + type + 'id="' + type + '"]').each(function() {
			            id.push($(this).data('id'));
			        });
			        var successline = [];
			        for (i = 0; i < id.length; i++) {
			            dataid = id[i];
			            //console.log(dataid);
			            for (var z = 0; z <= 4; z++) {
			                if ($.inArray(dataid + z, id) >= 0) {
			                    //console.log(dataid+z);
			                    successline.push(dataid + z);
			                }
			                if (z == 4 && successline.length < 5) {
			                    successline.length = 0;
			                } else if (z == 4 && successline.length == 5 && (successline[0] == 1 || successline[4] == col * row || successline[4] % col >= 5 || successline[4] % col == 0)) {
			                    success(successline);
			                    win(successline, type);
			                    break;
			                } else if (z == 4 && successline.length == 5 && (successline[0] != 1 && successline[4] != col * row && successline[4] % col < 5 && successline[4] % col != 0)) {
			                    successline.length = 0;
			                    continue;
			                }
			            }
			            for (var z = 0; z <= col * 4; z += col) {
			                if ($.inArray(dataid + z, id) >= 0) {
			                    //console.log(dataid+z);
			                    successline.push(dataid + z);
			                }
			                if (z == col * 4 && successline.length < 5) {
			                    successline.length = 0;
			                } else if (z == col * 4 && successline.length == 5) {
			                    success(successline);
			                    win(successline, type);
			                    break;
			                }
			            }
			            for (var z = 0; z <= rightTo * 4; z += rightTo) {
			                if ($.inArray(dataid + z, id) >= 0) {
			                    //console.log(dataid+z);
			                    successline.push(dataid + z);
			                }
			                if (z == rightTo * 4 && successline.length < 5) {
			                    successline.length = 0;
			                } else if (z == rightTo * 4 && successline.length == 5 && (successline[0] % col > 4)) {
			                    success(successline);
			                    win(successline, type);
			                    break;
			                } else if (z == rightTo * 4 && successline.length == 5 && (successline[0] % col <= 4)) {
			                    successline.length = 0;
			                    continue;
			                }
			            }
			            for (var z = 0; z <= leftTo * 4; z += leftTo) {
			                if ($.inArray(dataid + z, id) >= 0) {
			                    //console.log(dataid+z);
			                    successline.push(dataid + z);
			                }
			                if (z == leftTo * 4 && successline.length < 5) {
			                    successline.length = 0;
			                } else if (z == leftTo * 4 && successline.length == 5 && (col - successline[0] % col > 3)) {
			                    success(successline);
			                    win(successline, type);
			                    break;
			                } else if (z == leftTo * 4 && successline.length == 5 && (col - successline[0] % col <= 3)) {
			                    successline.length = 0;
			                    continue;
			                }
			            }
			        };
			    }
			});

			function success(arr) {
			    var colorline_ = 1;
			    clearx = setInterval(function() {
			        if (colorline_ % 2 == 1) colornum_ = '#4285f4';
			        else colornum_ = 'black';
			        for (var a = 0; a < 5; a++) {
			            $('td[data-id="' + arr[a] + '"]').css("color", colornum_);
			        }
			        colorline_++;
			    }, 400);
			    $('#info_match').html('<p style="color:#4285f4;">Bạn đã chiến thắng !</p><button id="reset_btn" onclick="reset_game();" style="border:none; border-radius:5px;height:30px;width:70;color:white;background:#5435b0">Game Mới</button>');
			}

			function win(idlist, type) {
			    conn.send(JSON.stringify({
			        action: "win",
			        type: type,
			        idlist: idlist,
			        id_match: id_match
			    }));
			}

			function reset_game() {
			    conn.send(JSON.stringify({
			        id_match: id_match,
			        action: "new_game"
			    }));
			    $('#reset_btn').html("Đang chờ");
			    $('#reset_btn').removeAttr("onclick");
			    $('#reset_btn').attr("disabled", "disabled");
			}

			function acpt_reset_game() {
			    clearInterval(clearx);
			    clearInterval(clearo);
			    conn.send(JSON.stringify({
			        action: "accept",
			        id_match: id_match
			    }));
			    $('#info_match').html('');
			    $('td').each(function() {
			        $(this).html('');
			        $(this).removeAttr('data-oid');
			        $(this).removeAttr('data-xid');
			        $(this).removeAttr('style');
			    });
			    if (type == 'x') {
			        mytime = true;
			        $('#mytime').html('<p style="color:green">Lượt chơi: Đến lượt bạn !</p>');
			    } else {
			        mytime = false;
			        $('#mytime').html('<p style="color:black">Lượt chơi: Đến lượt người kia !</p>');
			    }
			}

			function acpt_reset_game_withoutsend() {
			    clearInterval(clearx);
			    clearInterval(clearo);
			    $('#info_match').html('');
			    $('td').each(function() {
			        $(this).html('');
			        $(this).removeAttr('data-oid');
			        $(this).removeAttr('data-xid');
			        $(this).removeAttr('style');
			    });
			    if (type == 'x') {
			        mytime = true;
			        $('#mytime').html('<p style="color:green">Lượt chơi: Đến lượt bạn !</p>');
			    } else {
			        mytime = false;
			        $('#mytime').html('<p style="color:black">Lượt chơi: Đến lượt người kia !</p>');
			    }
			}
