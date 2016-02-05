<?php
function dump(){
	$args = func_get_args();
	
	echo '<pre>';
	foreach($args as $arg)
		var_dump($arg);
	
	echo '</pre>';
	
	return false;
}

class liss {
	
}
class liss_cast extends liss{
}

class liss_uri extends liss {
}

class liss_module extends liss {
	
}

/**
 * _user
 * detect browser and platform
 * @version 1.151008 (based js.user.3.151002)
 */
class _user {
	static $that;
	public $label = array();
	public $mobile;
	
	function __construct(){
		self::$that =&$this;
		
		$this->ua = strtolower($_SERVER['HTTP_USER_AGENT']);

		$this->set('browser', array(
			array('safari', null, 'version/')
		  , array('opera')
		  , array('firefox')
		  , array('trident', 'ie', 'rv:')
		  , array('ie')
		  , array('chrome')
		  , array('edge')
		  , array('opr', 'opera')
		));
		
		$this->set('engine', array(
			array('gecko')
		  , array('webkit')
		  , array('edge')
		  , array('trident')
		));
		
		$this->ua = explode(')', $this->ua);
		$this->ua = $this->ua[0];
		
		if($this->set('os', array(
			array('ipad', 'ios', 'cpu os')
		  , array('iphone', 'ios', 'cpu os')
		  , array('macintosh', null, '/(?:x|rv:)/')
		  , array('linux')
		  , array('tizen')
		  , array('android')
		  , array('windows', null, null
		      , array(
			  		'nt 10.0'=> 10
			  	  , 'nt 6.3'=> 8.1
			  	  , 'nt 6.2'=> 8
			  	  , 'nt 6.1'=> 7
			  	  , 'nt 6.0'=> 'vista'
			  	  , 'nt 5.2'=> 'xp'
			  	  , 'nt 5.1'=> 'xp'
			  	  , 'nt 5.0'=> '2000'
		  	)
		  )
		))) {
			$this->mobile = self::in('android', 'ios', 'tizen') ||
				($this->window && strpbrk($this->window, 'phone'));
		} else if($this->firefox) {
			$this->mobile = !!strpbrk($this->ua, 'mobile');
		}

		$this->ua = null;
	}
	
	static function in($label){
		$args = func_get_args();
		foreach($args as $label)
			if(self::$that->{$label}==true)
				return true;
		return false;
	}
	
	static function equal($label, $version){
		return self::$that->{$label} == $version;
	}
	
	static function under(){
		return self::$that->{$label} < $version;
	}
	
	static function over(){
		return self::$that->{$label} > $version;
	}
	
	private function set($name, $types){
		$match = true;
		$i = count($types);
		while($i-->0){
			$type = $types[$i];
			$keyword = $type[0];
			$label = isset($type[1]) ? $type[1] : $type[0];
			$this->{$label} = null;
			if($match && strpos($this->ua, $keyword)!==false){
				$match = false;
				$versionFlag = isset($type[2]) ? $type[2]  : $type[0];
				if(strpos($this->ua, $versionFlag)!==false){
					$version = explode($versionFlag, $this->ua);
					$version = $version[1];
					$version = preg_replace('/^[^\w;]+/', '', $version);
					$version = str_replace('_', '.', $version);
					$version = preg_split('/[\);]/', $version);
					$version = $version[0];
					
					if(isset($type[3], $type[3][$version]))
						$version = $type[3][$version];
				}
				$version = (int) $version;
				$version = $version ? $version : true;
				$this->{$label} = $version;
				$this->label[$name] = $label;
				$this->{$name} = $label;
				continue;
			}
		}
		if(!$this->{$label}){
			$this->{$label} = 'unknown';
			return false;
		}
		return true;
	}
}

$user = new _user;

echo $user->browser, '<br>';
echo $user->engine, '<br>';
echo $user->os, '<br>';

echo $user->{$user->browser}, '<br>';
echo $user->{$user->engine}, '<br>';
echo $user->{$user->os}, '<br>';
echo $user->mobile; 
?>