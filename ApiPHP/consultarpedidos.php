<?php
require_once 'clases/respuestas.class.php';
require_once 'clases/pedidos.class.php';

$_respuestas = new respuestas;
$_pedidos = new pedidos;

switch($_SERVER['REQUEST_METHOD']){
    case("GET"):             
        $listaPedidos = $_pedidos->consultarPedidos();       
        header('Content-Type: application/json');       
        http_response_code(200);  
        echo json_encode($listaPedidos);
    break;
    default:
            header('Content-Type: application/json');
            $datosArray = $_respuestas->error_405();
            echo json_encode($datosArray);
    break;    
    }  

?>