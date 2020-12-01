<?php
require_once 'clases/respuestas.class.php';
require_once 'clases/pedidos.class.php';

$_respuestas = new respuestas;
$_pedidos = new pedidos;
/*
   $salidaJSON = array("respuesta" => 'False', "mensaje" =>'sss',"contenido"=>'warning',"titulo"=>'Alerta');
    echo json_encode($salidaJSON);
    exit;

    $postBody=$_POST['txtJ'];
      // $postBody=json_decode($postBody,true);
      $salidaJSON = $postBody;
      echo ($salidaJSON);
       exit;*/

switch($_SERVER['REQUEST_METHOD']){  
    
    case("POST"):
            if(isset($_POST['txtJ'])){
                $postBody=$_POST['txtJ']; 
            }else{
                $postBody =json_encode($_GET);                
            }               
            $datosArray = $_pedidos->crearDetallePedido($postBody);
            //se agregan cabeceras de respouestas
            header('Content-Type: application/json');
            if(isset($datosArray["result"]["error_id"])){
                $responseCode = $datosArray["result"]["error_id"];
                http_response_code($responseCode);
            }else{
                http_response_code(200);
            }
            echo json_encode($datosArray);  
        break;
    default:
            header('Content-Type: application/json');
            $datosArray = $_respuestas->error_405();
            echo json_encode($datosArray);
     break;    
} 

?>