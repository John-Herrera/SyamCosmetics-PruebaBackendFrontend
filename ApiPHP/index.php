<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API - Prubebas</title>
    <link rel="stylesheet" href="assets/estilo.css" type="text/css">
</head>
<body>

<div  class="container">
    <h1>Api de pruebas</h1>
    <div class="divbody">
        <h3>Consumir Api y guardar en BD</h3>
        <code>
           GET <?php echo  str_replace('index.php','',$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);?>consumirApi.php          
        </code>
    </div> 
    <div class="divbody">
        <h3>Consultar Pedidos</h3>
        <code>
           GET <?php echo  str_replace('index.php','',$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);?>consultarpedidos.php
          
        </code>
    </div> 
    <div class="divbody">
        <h3>Crear pedido</h3>
        <code>
           POST <?php echo  str_replace('index.php','',$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);?>crearpedido.php
          
        </code>
    </div> 
    <div class="divbody">
        <h3>Crear detalle pedido</h3>
        <code>
           POST <?php echo  str_replace('index.php','',$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);?>creardetallepedido.php
          
        </code>
    </div> 


</div>
    
</body>
</html>

