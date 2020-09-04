<?
$ip = $_SERVER['REMOTE_ADDR'];
switch($_REQUEST['action']){
case "getip":
	exit($ip);
case "level":
	$level = intval($_REQUEST['level']);
	putHighscore($level);
	break;
case "getHighscore":
	$highscore = getHighscore();
	exit(json_encode($highscore));
	break;
}
function getHighscore(){
	return unserialize(file_get_contents("highscore.data"));
}
function putHighscore($level){
	global $ip;
	$highscore = getHighscore();
	if($highscore[$ip] < $level)
		$highscore[$ip] = $level;
	file_put_contents("highscore.data", serialize($highscore));
}
