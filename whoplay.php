<?php 
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Access-Control-Allow-Origin: *");
$data = json_decode(file_get_contents('dataUser.txt'),true);

if(isset($_GET['id_match'])){$id_match = $_GET['id_match'];for($i=0;$i<count($data);$i++){
	if($data[$i]['id_match']==$id_match){ echo json_encode([
	'id_match' => $id_match,
	'status' =>$data[$i]['status'],
	'mytype'=>'x'
]); break; }
	
}
    exit();
} 
if($data==[]){
	$data =[]; 
	$id_match = 'VUCMS_'.rand(1000000000000,9999999999999999);
	$data[] = [
	'id_match' => $id_match,
	'status' =>'pending',
	'mytype'=>'x'
];
echo json_encode([
	'id_match' => $id_match,
	'status' =>'pending',
	'mytype'=>'x'
]);
}else{
	$find = true;
	for($i=0;$i<count($data);$i++){
		
		if($data[$i]['status']=='pending'){
						echo json_encode([
				'id_match' => $data[$i]['id_match'],
				'status' =>'success',
				'mytype'=>'o'
			]);
			$data[$i]['status'] = 'success';			
			$find = true;
			 break;
		}else{
			$find = false;
		}
	}
	$id_match = 'VUCMS_'.rand(1000000000000,9999999999999999);
	if($find==false){
		$data[] = [
	'id_match' => $id_match,
	'status' =>'pending',
	'mytype'=>'x'
	];
	echo json_encode([
	'id_match' => $id_match,
	'status' =>'pending',
	'mytype'=>'x'
]);
	}
}
file_put_contents('dataUser.txt', json_encode($data));

?>