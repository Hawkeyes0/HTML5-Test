$(function Game2048(){
	var panel = $("#game-panel");
	const KEY_LEFT = 37;
	const KEY_UP = 38;
	const KEY_RIGHT = 39;
	const KEY_DOWN = 40;
	var panelData = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	panel.data('data', panelData);
	
	var fillData = function() {
		for ( var r = 0; r < 4; r++ ) {
			for ( var c = 0; c < 4; c++ ) {
				if ( panelData[r][c] > 0 )
					panel.find('tr').eq(r).children().eq(c).text(panelData[r][c]);
				else
					panel.find('tr').eq(r).children().eq(c).text('');
			}
		}
	}
	
	var setRandom = function () {
		var r, c, v;
		var i;
		v = [];
		for ( r = 0; r < 4; r++ ) {
			for ( c = 0; c < 4; c++ ) {
				if ( !panelData[r][c] )
					v.push( [r,c] );
			}
		}
		if ( !v.length ) {
			console.log('no blank');
			return;
		}

		i = Math.round(Math.random() * (v.length - 1));
		r = v[i][0];
		c = v[i][1];

		var v = 0;
		while ( !v ) {
			v = Math.round(Math.random() * 2) * 2;
		}
		panelData[r][c] = v;
	}
	
	var moveNumber = function (event) {
		var baseline = 0, step = 1, target = 4;
		switch ( event.keyCode ) {
			case KEY_LEFT:
			case KEY_UP:
				baseline = 0;
				step = 1;
				target = 4;
				break;
			case KEY_RIGHT:
			case KEY_DOWN:
				baseline = 3;
				step = -1;
				target = -1;
				break;
		}
		
		switch ( event.keyCode ) {
			case KEY_LEFT:
			case KEY_RIGHT:
				moveHor ( baseline, target, step );
				break;
			case KEY_UP:
			case KEY_DOWN:
				moveVer ( baseline, target, step );
				break;
		}
		
		if ( doesWin() ) {
			return;
		}
		setRandom();
		fillData();
	}
	
	var moveHor = function ( baseline, target, step ) {
		for ( var r = 0; r < 4; r++ ) {
			for ( var c = baseline, c1 = baseline + step; c1 != target; c1 += step ) {
				if ( panelData[r][c] ) {
					if ( panelData[r][c1] ) {
						if ( panelData[r][c] == panelData[r][c1] ) {
							panelData[r][c] *= 2;
							panelData[r][c1] = 0;
						}
						c += step;
						c1 = c;
					}
				} else {
					if ( panelData[r][c1] ) {
						panelData[r][c] = panelData[r][c1];
						panelData[r][c1] = 0;
					}
				}
			}
		}
	}
	
	var moveVer = function ( baseline, target, step ) {
		for ( var c = 0; c < 4; c++ ) {
			for ( var r = baseline, r1 = baseline + step; r1 != target; r1 += step ) {
				if ( panelData[r][c] ) {
					if ( panelData[r1][c] ) {
						if ( panelData[r][c] == panelData[r1][c] ) {
							panelData[r][c] *= 2;
							panelData[r1][c] = 0;
						}
						r += step;
						r1 = r;
					}
				} else {
					if ( panelData[r1][c] ) {
						panelData[r][c] = panelData[r1][c];
						panelData[r1][c] = 0;
					}
				}
			}
		}
	}
	
	var doesWin = function () {
	}
	
	setRandom();
	setRandom();
	fillData();
	window.onkeypress = moveNumber;

});