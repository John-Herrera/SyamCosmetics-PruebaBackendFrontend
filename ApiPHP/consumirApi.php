<?php 
require_once 'clases/respuestas.class.php';
require_once 'clases/inventario.class.php';
$_respuestas = new respuestas;
$_inventario = new inventario;
switch($_SERVER['REQUEST_METHOD']){
    case("GET"):         
        $JSON=file_get_contents('https://syamcosmetics.co/prueba_tecnica/info_prueba.json');
        $Array = json_decode($JSON, true);
        $res = $_inventario->crearinventario($Array);   
        if(isset($res["result"]['ok'])){
           $listadoinventario=$_inventario->consultarinventario();  
           header('Content-Type: application/json');       
           http_response_code(200);  
           echo json_encode($listadoinventario);
        }else{
            return $_respuestas->error_500();
        }
    break;
    default:
            header('Content-Type: application/json');
            $datosArray = $_respuestas->error_405();
            echo json_encode($datosArray);
    break;    
    }  


?>