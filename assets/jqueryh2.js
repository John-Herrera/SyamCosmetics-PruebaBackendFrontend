
//se llama api y se pinta la tabla
datosPedidos();
function datosPedidos() {
  return fetch("ApiPHP/consultarpedidos", {
    method: 'GET',
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let DATA = (data);
      let htmlDetalle = '';
      let TOTAL = 10;
      //hacer por cada uno de la lista de pedidos una fila en la tabla
      $.each(DATA, function (key, data) {
        htmlDetalle = '<td>' + data.id + '</td>' +
          '<td class="totales">' + '$' + number_format(data.subtotal) + '</td>' +
          '<td class="totales">' + '$' + number_format(data.totaliva) + '</td>' +
          '<td class="totales">' + '$' + number_format(data.total) + ' </td>'
        $('<tr>', { html: htmlDetalle }).appendTo($('#pedidos'));
        TOTAL = TOTAL + parseFloat(data.total);

      });
      // alert(TOTAL);
      $("#TOTALP").html('$' + number_format(TOTAL));
      return true;
    })
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
