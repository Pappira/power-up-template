var works = [
  {
    "id":0,
    "workTypeId":1,
    "workType":"Encuadernados",
    "image":noImage,
    "name":"Cuaderno",
    "spreadSheetId": "1NdKz7iBnzowQdC2_fED9KX5DieGz242moRMGXZ0fZms",
    "sheetName": "Copia de Cuadernos",
    "options":
    [
      {
        "name":"Cantidad",
        "cell":"A3"
      },
      {
        "name": "Cinta-marcapaginas",
        "values": ["Si", "No"],
        "cell": "D3",
        "active": false,
        "disabled": true
      },
      {
        "name":"Encuadernado",
        "values": ["rulo","lomo"],
        "cell": "B3",
        "incidences":
        [
          {
            "selected": ["lomo"],
            "name": "Cinta-marcapaginas",
            "active": true
          }
        ]
      },
      {
        "name": "Cierre-elastico",
        "values": ["Si", "No"],
        "cell": "C3",
        "active": false,
        "disabled": true
      },
      {
        "name": "Interior--Impresion",
        "values": ["Sin imprimir","Tinta Negra fondo blanco sin grisados","Tinta Negra","Tinta Primaria (Cyan, Magenta, Amarillo o Negro)","Tinta color lata fondo blanco sin grisados","Tinta color lata","Tinta color pantone fondo blanco sin grisados","Tinta color pantone","Dos tintas primarias (Cyan, Magenta, Amarillo o Negro)","Dos tintas de lata","Dos tintas Pantone","Tinta Primaria y Pantone","Tinta Lata y Pantone","Tres Tintas Pantone","Una Tinta Lata y dos Pantone","Dos Tinta Lata y una Pantone","Una Tinta Primaria y Dos Pantone","Full Color CMYK","Full color CMYK frente - Tinta Negra dorso","Full color CMYK + Pantone"],
        "cell": "B11"
      },
      {
        "name": "Interior--Faces",
        "values": ["Simple Faz","Doble Faz"],
        "cell": "D11"
      },
      {
        "name": "Interior--Material", 
        "values": ["Obra 80gr.","Obra 90gr.","Obra 120gr.","Coteado 130gr.","Coteado 150gr.","Coteado 200gr.","Coteado 250gr.","Coteado 300gr.","Cartulina 270gr.","Cartulina 250gr.","Rayado estándar 70gr."],
        "cell": "D11"
      },
      {
        "name": "Interior--Cantidad de hojas",
        "cell": "A11"
      },
      {
        "name": "Tapa--Tipo",
        "values": ["Flexible", "Semi-Dura", "Dura"],
        "cell": "A7",
        "incidences":
        [
          {
            "selected": ["Semi-Dura", "Dura"],
            "name": "Cierre-elastico",
            "active": true
          }
        ]
      },
      {
        "name": "Tapa--Impresion",
        "values": ["Sin imprimir","Tinta Negra fondo blanco sin grisados","Tinta Negra","Tinta Primaria (Cyan, Magenta, Amarillo o Negro)","Tinta color lata fondo blanco sin grisados","Tinta color lata","Tinta color pantone fondo blanco sin grisados","Tinta color pantone","Dos tintas primarias (Cyan, Magenta, Amarillo o Negro)","Dos tintas de lata","Dos tintas Pantone","Tinta Primaria y Pantone","Tinta Lata y Pantone","Tres Tintas Pantone","Una Tinta Lata y dos Pantone","Dos Tinta Lata y una Pantone","Una Tinta Primaria y Dos Pantone","Full Color CMYK","Full color CMYK frente - Tinta Negra dorso","Full color CMYK + Pantone"],
        "cell": "B7"
      },
      {
        "name": "Tapa--Retiro-impreso",
        "values": ["Si", "No"],
        "cell": "C7"
      },
      {
        "name": "Tapa--Laminado",
        "values": ["Si", "No"],
        "cell": "D7"
      },
    ]
  }
];