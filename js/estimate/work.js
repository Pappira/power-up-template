var works = [
  {
    "id":0,
    "workTypeId":1,
    "workType":"Encuadernados",
    "image":noImage,
    "name":"Cuaderno",
    "spreadSheetId": "1-wwPI2EDo0JtGgjR3AAZ9cgWlWalSWZ8GtBTasyiW1I",
    "sheetName": "Cuaderno",
    "options":
    [
      {
        "name":"Cantidad",
        "cell":"A3"
      },
      {
        "name":"Tamaño",
        "cell":"E3",
        "values": ["13x17","13x17.5","13x18","13x18.5","13x19","13x19.5","13x20","13x20.5","13x21","13x21.5","13x22","13x22.5","13x23","13x23.5","13,5x17","13,5x17.5","13,5x18","13,5x18.5","13,5x19","13,5x19.5","13,5x20","13,5x20.5","13,5x21","13,5x21.5","13,5x22","13,5x22.5","13,5x23","13,5x23.5","14x17","14x17.5","14x18","14x18.5","14x19","14x19.5","14x20","14x20.5","14x21","14x21.5","14x22","14x22.5","14x23","14x23.5","14,5x17","14,5x17.5","14,5x18","14,5x18.5","14,5x19","14,5x19.5","14,5x20","14,5x20.5","14,5x21","14,5x21.5","14,5x22","14,5x22.5","14,5x23","14,5x23.5","15x17","15x17.5","15x18","15x18.5","15x19","15x19.5","15x20","15x20.5","15x21","15x21.5","15x22","15x22.5","15x23","15x23.5","15,5x17","15,5x17.5","15,5x18","15,5x18.5","15,5x19","15,5x19.5","15,5x20","15,5x20.5","15,5x21","15,5x21.5","15,5x22","15,5x22.5","15,5x23","15,5x23.5","16x17","16x17.5","16x18","16x18.5","16x19","16x19.5","16x20","16x20.5","16x21","16x21.5","16x22","16x22.5","16x23","16x23.5","16,5x17","16,5x17.5","16,5x18","16,5x18.5","16,5x19","16,5x19.5","16,5x20","16,5x20.5","16,5x21","16,5x21.5","16,5x22","16,5x22.5","16,5x23","16,5x23.5","17x17","17x17.5","17x18","17x18.5","17x19","17x19.5","17x20","17x20.5","17x21","17x21.5","17x22","17x22.5","17x23","17x23.5","17,5x17","17,5x17.5","17,5x18","17,5x18.5","17,5x19","17,5x19.5","17,5x20","17,5x20.5","17,5x21","17,5x21.5","17,5x22","17,5x22.5","17,5x23","17,5x23.5","18x17","18x17.5","18x18","18x18.5","18x19","18x19.5","18x20","18x20.5","18x21","18x21.5","18x22","18x22.5","18x23","18x23.5"],
        "default": ["15x21"]
      },
      {
        "name":"Encuadernado",
        "values": ["Rulo","Lomo"],
        "cell": "B3",
        "incidences":
        [
          {
            "selected": ["Lomo"],
            "name": "Cinta-marcapaginas",
            "active": true
          }
        ]
      },      
      {
        "name": "Armado cruzado",
        "values": ["Si", "No"],
        "cell": "F3",
        "default":["No"]
      },
      {
        "name": "Corto cruzado",
        "values": ["Si", "No"],
        "cell": "G3",
        "default":["No"]
      },
      {
        "name": "Cierre-elastico",
        "values": ["Si", "No"],
        "cell": "C3",
        "active": false,
        "disabled": true,
        "default":["No"]
      },
      {
        "name": "Cinta-marcapaginas",
        "values": ["Si", "No"],
        "cell": "D3",
        "active": false,
        "disabled": true,
        "default":["No"]
      },
      {
        "name": "Interior--Cantidad de hojas",
        "cell": "A11"
      },
      {
        "name": "Interior--Impresion",
        "values": ["Sin imprimir","Tinta Negra fondo blanco sin grisados","Tinta Negra","Tinta Primaria (Cyan, Magenta, Amarillo o Negro)","Tinta color lata fondo blanco sin grisados","Tinta color lata","Tinta color pantone fondo blanco sin grisados","Tinta color pantone","Dos tintas primarias (Cyan, Magenta, Amarillo o Negro)","Dos tintas de lata","Dos tintas Pantone","Tinta Primaria y Pantone","Tinta Lata y Pantone","Tres Tintas Pantone","Una Tinta Lata y dos Pantone","Dos Tinta Lata y una Pantone","Una Tinta Primaria y Dos Pantone","Full Color CMYK","Full color CMYK frente - Tinta Negra dorso","Full color CMYK + Pantone"],
        "cell": "B11"
      },
      {
        "name": "Interior--Material", 
        "values": ["Obra 80gr.","Obra 90gr.","Obra 120gr.","Coteado 130gr.","Coteado 150gr.","Coteado 200gr.","Coteado 250gr.","Coteado 300gr.","Cartulina 270gr.","Cartulina 250gr.","Rayado estándar 70gr."],
        "cell": "C11"
      },
      {
        "name": "Interior--Faces",
        "values": ["Simple Faz","Doble Faz"],
        "cell": "D11"
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