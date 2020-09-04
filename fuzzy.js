function fuzzifikasi(,jarak_bomb)
{
	
var jarak_player = a_star([cx, cy], [Math.floor(this.target.x / tileSize), Math.floor(this.target.y / tileSize)], game.board, game.map.w, game.map.h);
		if(jarak_player.length > 1){
			for(var u in jarak_player){
				ctx.fillStyle = '#000';
				ctx.fillRect(jarak_player[u].x * tileSize + tileSize / 2, jarak_player[u].y * tileSize + tileSize / 2, 2, 2);

var jarak_bom    = jarak_bom;
 
	
jarakplayerjauh   =fuzzifikasi_jarak_player_jauh(jarak_player);
jarakplayersedang =fuzzifikasi_jarak_player_sedang(jarak_player);
jarakplayerdekat  =fuzzifikasi_jarak_player_dekat(jarak_player);
jarakbombaman     =fuzzifikasi_jarak_bomb_aman(jarak_bom);
jarakbombdekat    =fuzzifikasi_jarak_bomb_dekat(jarak_bom);
}

function fuzzifikasi_jarak_player_dekat (jarak_player)
{
var jarakplayerdekat = 0;

if(jarak_player<0)
{jarakplayerdekat=1;}
else if((jarak_player>0)&&(jarak_player>6))
{jarakplayerdekat=(6-jarak_player)/(6-0);}
else if (jarak_player>6)
{jarakplayerdekat=0;};
return jarakplayerdekat;
}

function fuzzifikasi_jarak_player_sedang (jarak_player)
{ var jarakplayersedang=0;
if((jarak_player<=4)||(jarak_player>=16)
{jarakplayersedang=0;}
else if((jarak_player<=4)&&(jarak_player<=16))
{jarakplayersedang=(jarak_player-4)/(10-4);}
else if((jarak_player<=10)&&(jarak_player<16))
{jarakplayersedang=(16-jarakplayer)/(16-10);};
return jarakplayersedang;
}

function fuzzifikasi_jarak_player_jauh (jarak_player)
{ var jarakplayerjauh=0;
if(jarak_player<14)
{jarakplayerjauh=0;}
else if((jarak_player<14)&&(jarak_player<=30))
{jarakplayerjauh=(jarak_player-14)/(30-14);}
else if(jarak_player>30)
{jarakplayerjauh=1;};
return jarakplayerjauh;
}

function fuzzifikasi_jarak_bomb_dekat (jarak_bom)
{ var jarakbombdekat=0;
if(jarak_bom<=0)
{jarakbombdekat=1;}
else if((jarak_bom<=0)&&(jarak_bom<=2))
{jarakbombdekat=(2-jarak_bom)/(2-0);}
else if(jarak_bom>=2)
{jarakbombdekat=0;};
return jarakbombdekat;
}

function fuzzifikasi_jarak_bomb_aman (jarak_bom)
{ var jarakbombaman=0;
if(jarak_bom<=3)
{jarakbombaman=0;}
else if((jarak_bom<=3)&&(jarakbom<=10))
{jarakbombaman=(jarak_bom-3)/(10-3);}
else if(jarak_bom>=10)
{jarakbombaman=1;};
return jarakbombaman;
}

function get_min(a:float,b:float):float
{if(a<b)
{ return a;}
Else { return b; }
}

function mengejarplayer
(r5:float,r6:float) : float

function mencariplayer
(r4:float) : float

function menjauhibom
(r1:float,r2:float,r3:float) : float

function implikasi (jarakplayerjauh,jarakplayersedang,jarakplayerdekat,jarakbombdekat,jarakbombaman)
{       
        var hasil:float;
		switch(no_rule)
		{ 
		case 1:
        hasil = get_min (jarakplayerjauh, jarakbomdekat);
		break;
        case 2:
        hasil = get_min (jarakplayersedang, jarakbomdekat);
		break;
        case 3:
        hasil = get_min (jarakplayerdekat, jarakbomdekat);
        break;
		case 4 :
        hasil = get_min (jarakplayerjauh, jarakbomaman);
        break;
		case 5 :
        hasil = get_min (jarakplayersedang, jarakbomaman);
        break;
		case 6 :
        hasil = get_min (jarakplayerdekat, jarakbomaman);
        break;
		}
		return hasil;			
		}


function hitung_disjungsi()
{ 
var rule1:float;
var rule2:float;
var rule3:float;
var rule4:float;
var rule5:float;
var rule6:float;

rule1 = implikasi(1);
rule2 = implikasi(2);
rule3 = implikasi(3);
rule4 = implikasi(4);
rule5 = implikasi(5);
rule6 = implikasi(6);

disjungsi_mengejar_player = mengejarplayer (rule5,rule6);
disjungsi_mencari_player = mencariplayer (rule4);
disjungsi_menjauhi_bom = menjauhibom (rule1,rule2,rule3);
}

function defuzzifikasi()
{
var hasil :float;
hasil      = disjungsi_mengejar_player * 2 + disjungsi_mencari_player * 1 + disjungsi_menjauhi_bom * 3;
hasilfuzzy = hasil/(disjungsi_mengejar_player+disjungsi_mencari_player+disjungsi_menghindari_bom);
return hasil;
}
			
			