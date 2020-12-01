<?php 
require_once "conexion/conexion.php";
require_once "respuestas.class.php";

class inventario extends conexion {   

    public function crearinventario($datos){
        $_respuestas = new respuestas;
                //Se Genera cadena para insertar todos al mismo tiempo 
                $SQLcadena='';          
                
                for($i=0;$i<count($datos);$i++){
                    $SQLcadena.='(';  
                    $SQLcadena.='"'.$datos[$i]["descripcion"].'",';
                    $SQLcadena.=''.$datos[$i]["precio"].',';
                    $SQLcadena.=''.$datos[$i]["existencia"].'';
                    $SQLcadena.=')';
                }               
                //Se coloca , para separar  los registros sin colocar al final
                $SQLcadena=str_replace(')(','),(',$SQLcadena); 
                
                $resp = $this->insertarInventario($SQLcadena);
            if($resp){
                $respuesta = $_respuestas->response;
                $respuesta["result"] = array(
                    "ok" => true
                );
                return $respuesta;
            }else{
                return $_respuestas->error_500();
            }
    }

    private function insertarInventario($inventario){
        $query = "DELETE FROM syam_inventario";
        $resp = parent::nonQuery($query);

        $query = "INSERT INTO syam_inventario (descripcion,precio,existencia)
        VALUES  ".$inventario."";      
        $resp = parent::nonQuery($query);
        if($resp){
             return $resp;
        }else{
            return false;
        }
    }

    public function consultarinventario(){
        $query = "SELECT * FROM syam_inventario";
        $datos = parent::obtenerDatos($query);
        return ($datos);
    }

}
?>