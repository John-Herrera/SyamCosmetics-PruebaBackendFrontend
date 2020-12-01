
const Carrito = [];
const Index = []; //evitar loops e iteraciones en array carrito, manejo de index borrar y agregar
const Totales = [0, 0, 0];

let DATA ={};
 datosPedidos();
     function datosPedidos() {    
       //se consume api 'https://syamcosmetics.co/prueba_tecnica/info_prueba.json' y se guarda en db
       return  fetch("ApiPHP/consumirApi", {
            method: 'GET',
          })
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {            
             console.log(data);  
             DATA=data;  
             //llenar select de articulos
            $.each(DATA, function (key, data) {
              $('<option>', { text: data.descripcion }).appendTo($('#inputArticulos'));
            }); 
            return data;
          })
      }

// se muestra precios y se le coloca atributo max para control de maximo total
$('#inputArticulos').on('change', function () {
  let valorinputarticulos = $("#inputArticulos option:selected").text();
  let Existencia = 0;
  $.each(DATA, function (key, data) {
    if (data.descripcion == valorinputarticulos) {
      $("#inputSubtotal").html(data.precio);
      $("#inputCantidad").attr("max", data.existencia);
      $("#inputCantidad").val(1);
      $("#keyTok").val(key);
      Existencia = data.existencia;
      return false;
    } else {
      $("#inputSubtotal").html(0);
      $("#inputCantidad").attr("max", 0);
      $("#inputCantidad").val(0);
      $("#keyTok").val('');
    }
  });
  $("#CantMax").val(Existencia);
})

//Evento agregar guarda en el array carrito y llama metodos para pintar vistas
$('#btnAgregar').on('click', function () {
   //valida  que se haya seleccionado articulo y cantidad
  if ($("#inputArticulos option:selected").text() != "Elije tu articulo..." &&
    !isNaN(parseInt($("#inputCantidad").val())) &&
    parseInt($("#inputCantidad").val()) > 0 &&
    parseInt($("#inputCantidad").val()) <= parseInt($("#CantMax").val())
  ) {//validaciones campos vacios
    $("#Mensaje").html(''); //se borra cualquier error anterior 
    //validacion elemento repetido y recuperacion de index Carrito.find(element => element > 10);
    let position = Index.indexOf($("#keyTok").val());
    let subtotal = 0;
    //Si no encuentrra posicion no existe y se crea
    if (position === -1) {
      let articulo = {};
      articulo["key"] = $("#keyTok").val();
      articulo["pedido"] = $("#inputOrden").val();
      articulo["articulo"] = $("#inputArticulos option:selected").text();
      articulo["cantidad"] = parseInt($("#inputCantidad").val());
      articulo["subtotal"] = parseInt($("#inputSubtotal").html());
      //se agrega index para manejo de eliminados y repetidos
      Index.push($("#keyTok").val());
      Carrito.push(articulo);
    } else { //si encuentra posicion actualiza subtotal y cantidad
      Carrito[(position)]['cantidad'] = (parseInt($("#inputCantidad").val()) + parseInt(Carrito[(position)]['cantidad']));
      Carrito[(position)]['subtotal'] = (parseInt($("#inputSubtotal").html()) + parseInt(Carrito[(position)]['subtotal']));
    }
    //se crea array de Totales
    subtotal = parseInt($("#inputSubtotal").html());
    Totales[0] = subtotal + Totales[0];//sub total
    Totales[1] = Totales[0] * 0.19;//total iva
    Totales[2] = Totales[0] + Totales[1];//total

    //se muestran los valores en el HTML
    VDetalle();
    VTotales();
    //Limpiar campos que deben ser limpiados para mejor uso del sistema - 
    //es mejor no borrar todo el formulario pues si el cliente ingrea su 
    //nombre antes de terminar su compra este siempre se borrar
    $("#inputArticulos").val("Elije tu articulo...");
    $("#inputCantidad").val(0);
    $("#inputSubtotal").html(0);

    var myJsonString = JSON.stringify(Carrito);
    console.log(myJsonString);
  } else {
    $("#Mensaje").html('<div id="msj" class="alert alert-danger" role="alert">Por favor selecciona un articulo con sus respectivas cantidades</div>');
  }
});

//evento que finaliza compra
$('#FinalizarCompra').on('click', function () {
  let r = confirm("Deseas finalizar la compra");
    if (r == true) {
      FinalizarPedido();
    } 
});

//calcular subtotal de acuerdo a la cantidad seleccionada a una etiqueta label
const calcularSubtotal = () => {
  let cant = parseInt($("#inputCantidad").val());
  let max = parseInt($("#CantMax").val());
  if ($("#keyTok").val() != '') {
    if (cant >= max) {
      $("#inputCantidad").val($("#CantMax").val());
    }
    $("#inputSubtotal").html($("#inputCantidad").val() * DATA[$("#keyTok").val()].precio);
  }
}

//Mostar en detalle los articulos agregados
const VDetalle = () => {
  $('#detalleOrden').html('');
  let htmlDetalle = '';
  for (i = 0; i < Carrito.length; i++) {
    htmlDetalle = '<td>' + Carrito[i]['articulo'] + '</td>' +
      '<td class="totales">' + Carrito[i]['cantidad'] + '</td>' +
      '<td class="totales">' + '$' + number_format(Carrito[i]['subtotal']) + '</td>' +
      '<td class="text-center"><i id="Eliminar" onClick="eliminarItem(' + Index.indexOf(Carrito[i]['key']) + ')"  class="fa fa-trash pointer-basura" aria-hidden="true"></i></td>'
    $('<tr>', { html: htmlDetalle }).appendTo($('#detalleOrden'));
  }
}

//Mostar en totales los calculos del pedido total
const VTotales = () => {
  $('#ST').html('$' + number_format(Totales[0]));
  $('#TI').html('$' + number_format(Totales[1]));
  $('#T').html('$' + number_format(Totales[2]));
}

//dar formato de miles a un numero
const number_format = (amount, decimals) => {
  amount += ''; // por si pasan un numero en vez de un string
  amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
  decimals = decimals || 0; // por si la variable no fue fue pasada
  // si no es un numero o es igual a cero retorno el mismo cero
  if (isNaN(amount) || amount === 0)
    return parseFloat(0).toFixed(decimals);
  // si es mayor o menor que cero retorno el valor formateado como numero
  amount = '' + amount.toFixed(decimals);
  var amount_parts = amount.split('.'),
    regexp = /(\d+)(\d{3})/;

  while (regexp.test(amount_parts[0]))
    amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');

  return amount_parts.join('.');
}

const obtenerFecha = () => {
  let d = new Date();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let output = (day < 10 ? '0' : '') + day + '/' +
    (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
  return output;
}

const NumeroOrdenUnico = () => {
  let d = new Date().toJSON();
  $('#inputOrden').val(d);
  let cod = $('#inputOrden').val();
  dex = cod.replaceAll('-', '');
  dex = dex.replaceAll('.', '');
  dex = dex.replaceAll(':', '');
  dex = dex.replaceAll('T', '');
  return dex;
}

const eliminarItem = (position) => {
  //se resta el subtotal y se genera de nuevo los calculos
  Totales[0] = Totales[0] - Carrito[position]['subtotal'];//sub total
  Totales[1] = Totales[0] * 0.19;//total iva
  Totales[2] = Totales[0] + Totales[1];//total
  //se elimina del carrito el item y del vector de index
  if (position !== -1) {
    Carrito.splice(position, 1);
    Index.splice(position, 1);
  }
  //se muestran los valores en el HTML
  VDetalle();
  VTotales();
}

const FinalizarPedido = () => {
  try {
    if ($("#inputNombre").val() != "" && Totales[2] > 0) {
      CrearPedido();
      CrearDetallePedido();
      alert('Pedido completado, exitosamente.');
      $(location).attr('href', 'index.html');

    } else {
      $("#Mensaje").html('<div id="msj" class="alert alert-danger" role="alert">Debes ingresar tu nombre y por lo menos un articulo al carrito</div>');
    }
  } catch (error) {
    alert(error);
  }
}

const CrearPedido = () => {
  let url = "ApiPHP/crearpedido";
  let data = {
    id: $('#inputOrden').val(),
    nombre: $("#inputNombre").val(),
    fecha: $("#inputFecha").val(),
    subtotal: Totales[0],
    totaliva: Totales[1],
    total: Totales[2]
  };
  data = JSON.stringify(data);
  var formData = new FormData();
  formData.append('txtJ', data);
  console.log(data);
  return Jquery(formData, url);
}

const CrearDetallePedido = () => {
  let url = "piPHP/creardetallepedido";
  let data = Carrito;
  data = JSON.stringify(data);
  var formData = new FormData();
  formData.append('txtJ', data);
  console.log(data);
  return Jquery(formData, url);
}

function Jquery(datas, $U) {
  //AQUI USAMOS LA PETICION AJAX
  $.ajax({
    type: 'POST', //TIPO DE PETICION PUEDE SER GET
    dataType: "json", //EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
    url: $U, //DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR              
    data: datas,
    cache: false,
    contentType: false,
    processData: false,
    success: function (response) {//ACCION QUE SUCEDE DESPUES DE REALIZAR CORRECTAMENTE LA PETCION EL CUAL NOS TRAE UNA RESPUESTA                   
      console.log(response);
    },
    error: function () {//SI OCURRE UN ERROR 
      $("#Mensaje").html('<div id="msj" class="alert alert-danger" role="alert">Ocurrio un error revisa la ULR de la api</div>');
    }
  });
  return false;//RETORNAMOS FALSE PARA QUE NO HAGA UN RELOAD EN LA PAGINA    
}

$('#inputFecha').val(obtenerFecha);//obtener fecha
$('#inputOrden').val(NumeroOrdenUnico());//obtener numero unico

//Se maneja los eventos "onkeyup"  y "onChange" para mostrar en tiempo real el subtotal
$('#inputCantidad').on('keyup', calcularSubtotal);
$('#inputCantidad').on('change', calcularSubtotal);

function soloLetras(e) {
  key = e.keyCode || e.which;
  tecla = String.fromCharCode(key).toLowerCase();
  letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
  especiales = [8, 37, 39, 46];

  tecla_especial = false
  for(var i in especiales) {
      if(key == especiales[i]) {
          tecla_especial = true;
          break;
      }
  }

  if(letras.indexOf(tecla) == -1 && !tecla_especial)
      return false;
}

function limpia() {
  var val = document.getElementById("inputNombre").value;
  var tam = val.length;
  for(i = 0; i < tam; i++) {
      if(!isNaN(val[i]))
          document.getElementById("inputNombre").value = '';
  }
}
