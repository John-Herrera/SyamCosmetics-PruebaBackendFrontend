<?php 
require_once "conexion/conexion.php";
require_once "respuestas.class.php";

class pedidos extends conexion {
   
    private $id = "";
    private $nombre = "";
    private $fecha = "";
    private $subtotal = "";
    private $totaliva = "";
    private $total = "";

    private $fechaNacimiento = "0000-00-00";
    private $correo = "";
    private $token = "";
    
    public function crearPedido($json){
        $_respuestas = new respuestas;
                //se convierte valor a objeto json
                $datos = json_decode($json,true);   
                //se validan lops campos obligatorios             
                if(!isset($datos['id']) ||
                 !isset($datos['nombre']) ||
                  !isset($datos['fecha']) || 
                  !isset($datos['subtotal']) || 
                  !isset($datos['totaliva']) || 
                  !isset($datos['total'])){                  
                    return $_respuestas->error_400();
                }else{
                    $this->id = $datos['id'];
                    $this->nombre = $datos['nombre'];
                    $this->fecha = $datos['fecha'];
                    $this->subtotal = $datos['subtotal'];
                    $this->totaliva = $datos['totaliva'];
                    $this->total = $datos['total'];
                
                    $resp = $this->insertarPedido();
                    if($resp){
                        $respuesta = $_respuestas->response;
                        $respuesta["result"] = array(
                            "Se creo el registro" => $resp
                        );
                        return $respuesta;
                    }else{
                        return $_respuestas->error_500();
                    }
                }
    }

    
    private function insertarPedido(){
        $query = "INSERT INTO syam_pedido (id,nombre,fecha,fecha_creacion,subtotal,totaliva,total)
        VALUES  ('" . $this->id. "','" . $this->nombre . "','" . $this->fecha ."',NOW(),'" . $this->subtotal . "','"  .$this->totaliva. "','" . $this->total . "')"; 
        $resp = parent::nonQuery($query);
        if($resp){
             return $resp;
        }else{
            return false;
        }
    }

    public function crearDetallePedido($json){
        $_respuestas = new respuestas;
        //se convierte valor a objeto json
        $datos = json_decode($json,true);        
                //Se Genera cadena para insertar todos al mismo tiempo 
                $SQLcadena='';                  
                foreach ($datos as &$valor) {
                    $SQLcadena.='(';  
                    $SQLcadena.='"'.$valor["pedido"].'",';
                    $SQLcadena.='"'.$valor["articulo"].'",';
                    $SQLcadena.=''.$valor["cantidad"].',';
                    $SQLcadena.=''.$valor["subtotal"].'';
                    $SQLcadena.=')'; 
                }
                //Se coloca , para separar  los registros sin colocar al final
                $SQLcadena=str_replace(')(','),(',$SQLcadena);
                $resp = $this->insertarDetallePedido($SQLcadena);
            if($resp){
                $respuesta = $_respuestas->response;
                $respuesta["result"] = array(
                    "Se creo el detalle" => $resp
                );
                return $respuesta;
            }else{
                return $_respuestas->error_500();
            }
    }

    private function insertarDetallePedido($detalle){
        $query = "INSERT INTO syam_detalle_pedido (idpedido,articulo,cantidad,subtotal)
        VALUES  ".$detalle.""; 
        $resp = parent::nonQuery($query);
        if($resp){
             return $resp;
        }else{
            return false;
        }
    }

    public function consultarPedidos(){  
            $query = "SELECT * FROM syam_pedido";
            $datos = parent::obtenerDatos($query);
            return ($datos);
    }


}
?>