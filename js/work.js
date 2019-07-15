var works = [
    {
      'id':0,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':[
        {
          'value':'90x54mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['90x54mm']
            },
          ]
        },
        {
          'value':'90x50mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['90x50mm']
            },
          ]
        }
      ],
      'image':tarjetaImage,
      'name':'Tarjetas Personales',
      'quantity':[50,100,200,300,500,1000],
      "mandatoryFinishGroups":
      [
        {
          "groupName": "Variaciones",
          "finishes":
          [
            {
              "finish":"Todas iguales",
              "finishComment":"Todas las tarjetas personales a imprimir son idénticas, sin ningún tipo de variante",
              "showToClientFinish":false
            },
            {
              "finish":"Un cambio de nombre",
              "finishComment":"Todas las tarjetas personales tienen el mismo diseño base, y la única variante es que se tendrá datos personales de 2 personas",
              "showToClientFinish":true
            },
            {
              "finish":"Dos cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Tres cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Cuatro cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Cinco cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Seis cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Siete cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Ocho cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Nueve cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            }
          ]
        }
      ],
      'items':[
        {
          'id':0,
          'name':'Tarjeta',
          'bleedPrint':true, 
          'inks':[
            {
              'inksDetails':'Full color',
              'inksQuantity':4,
            },
            {
              'inksDetails':'Tinta negra',
              'inksQuantity':1,
            }
          ],
          'allTheSame':false,
          'quantityOfPages':[1],
          'quantityOfVias':[1],
          'openedSize':[],
          'faces':['Simple Faz','Doble Faz'],
          'materials':[
            {
              'paper':'Coteado',
              'gr':'300'
            },
            {
              'paper':'Opalinas',
              'gr':'230'
            },
            {
              'paper':'Magic',
              'gr':'180'
            },
            {
              'paper':'Ecoria Tipo Reciclado',
              'gr':'240'
            },
            {
              'paper':'Jazmin',
              'gr':'240'
            },
            {
              'paper':'Milenium Tipo Reciclado',
              'gr':'240'
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Puntas redondeadas",
              "finishComment":"",
              "showToClient":true
            }
          ]
        }
      ]
    },
    {
      "id":1,
      "workTypeId":1,
      "workType":"Encuadernados",
      "image":noImage,
      "name":"Cuaderno",
      "clossedSizes":["150x210mm"],
      "quantity":[50,100,200,300,500,1000],
      "mandatoryFinishGroups":
      [
        {
          "groupName": "Encuadernado",
          "finishes":
          [
            {
              "finish":"HotMelt",
              "finishComment":"",
              "showToClientFinish":true,
              "incidences":
              [
                {
                  "itemId":-1,
                  "type":"optionalFinishes",
                  "action":"add",
                  "values":
                  [
                    {
                      "finish":"Marca Páginas",
                      "finishComment":"",
                      "showToClientFinish":true
                    }
                  ]
                }
              ]
            },
            {
              "finish":"Rulo Wire-o",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Cosido con dos grapas",
              "finishComment":"",
              "showToClientFinish":true
            }
          ]
        }
      ],
      "items":
      [
        {
          "id":0,
          "name":"Tapa y contratapa",
          "bleedPrint":true,
          "inks":[
            {
              "inksDetails":"Full color",
              "inksQuantity":4
            }
          ],
          "openedSize":["150x210mm"],
          "allTheSame":false,
          "mandatoryFinishGroups":
          [
            {
              "groupName": "Tipo de Tapa",
              "finishes": 
              [
                {
                  "finish":"Tapa Flexible",
                  "finishComment":"",
                  "showToClientFinish":true,
                  "incidences":
                  [
                    {
                      "itemId":0,
                      "type":"materials",
                      "action":"replace",
                      "values":
                      [
                        {
                          "paper":"Cartulina Blanca/Blanca",
                          "gr":"250"
                        },
                        {
                          "paper":"Coteado",
                          "gr":"300"
                        }
                      ]
                    }
                  ]
                },
                {
                  "finish":"Tapa SemiDura",
                  "finishComment":"",
                  "showToClientFinish":true,
                  "incidences":
                  [
                    {
                      "itemId":0,
                      "type":"materials",
                      "action":"replace",
                      "values":
                      [{
                        "paper":"Cartulina Blanca/Blanca",
                        "gr":"250"
                      }]
                    },
                    {
                      "itemId":-1,
                      "type":"optionalFinishes",
                      "action":"add",
                      "values":
                      [
                        {
                          "finish":"Cierre Elástico",
                          "finishComment":"",
                          "showToClientFinish":true
                        }
                      ]
                    }
                  ]
                },
                {
                  "finish":"Tapa Dura",
                  "finishComment":"",
                  "showToClientFinish":true,
                  "incidences":
                  [
                    {
                      "itemId":0,
                      "type":"materials",
                      "action":"replace",
                      "values":
                      {
                        "paper":"Coteado",
                        "gr":"150"
                      }
                    },
                    {
                      "itemId":-1,
                      "type":"optionalFinishes",
                      "action":"add",
                      "values":
                      [
                        {
                          "finish":"Cierre Elástico",
                          "finishComment":"",
                          "showToClientFinish":true
                        }
                      ]
                    }
                  ]
                }
              ] 
            }
          ],
          "quantityOfPages":[2],
          "quantityOfVias":[1],
          "faces":["Simple Faz","Doble Faz"],
          "materials":[
            {
              "paper":"Cartulina Blanca/Blanca",
              "gr":"250"
            },
            {
              "paper":"Coteado",
              "gr":"300"
            },
            {
              "paper":"Coteado",
              "gr":"150"
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            }
          ]
        },
        {
          "id":1,
          "name":"Interior",
          "bleedPrint":true,
          "inks":
          [
            {
              "inksDetails":"Sin imprimir",
              "inksQuantity":0
            },
            {
              "inksDetails":"Tinta Negra",
              "inksQuantity":1
            },
            {
              "inksDetails":"2 tintas",
              "inksQuantity":2
            }
          ],
          "openedSize":["150x210mm"],
          "allTheSame":false,
          "quantityOfPages":[50,70,100],
          "quantityOfVias":[1],
          "faces":["Simple Faz","Doble Faz"],
          "materials":
          [
            {
              "paper":"Obra Blanco",
              "gr":"80"
            },
            {
              "paper":"Obra Blanco",
              "gr":"90"
            },
            {
              "paper":"Rayado estándar",
              "gr":"70"
            }
          ]
        } 
      ],
      "optionalFinishes":[]
    },
    {
      'id':2,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':[
        {
          'value':'100x150mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['100x150mm']
            },
          ]
        },  
        {
          'value':'150x150mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['150x150mm']
            },
          ]
        },        
        {
          'value':'130x170mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['130x170mm']
            },
          ]
        },        
        {
          'value':'120x180mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['120x180mm']
            },
          ]
        },        
        {
          'value':'130x190mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['130x190mm']
            },
          ]
        },        
        {
          'value':'150x220mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['150x220mm']
            },
          ]
        }
      ],
      'image':noImage,
      'name':'Tarjetas de invitación',
      'quantity':[10,50,100,300],
      'items':[
        {
          'id':0,
          'name':'Tarjeta',
          'bleedPrint':true, 
          'inks':[
            {
              'inksDetails':'Full color',
              'inksQuantity':4,
            }
          ],
          'allTheSame':false,
          'quantityOfPages':[1],
          'openedSize':[],
          'quantityOfVias':[1],
          'faces':['Simple Faz','Doble Faz'],
          'materials':[
            {
              'paper':'Coteado',
              'gr':'300'
            },
            {
              'paper':'Opalinas',
              'gr':'230'
            },
            {
              'paper':'Magic',
              'gr':'180'
            },
            {
              'paper':'Ecoria Tipo Reciclado',
              'gr':'240'
            },
            {
              'paper':'Milenium Tipo Reciclado',
              'gr':'240'
            },
            {
              'paper':'Jazmin',
              'gr':'240'
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Puntas redondeadas",
              "finishComment":"",
              "showToClient":true
            }
          ]
        }
      ]
    },
    {
      'id':3,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':[
        {
          'value':'160x150mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['160x300mm']
            },
          ]
        },  
        {
          'value':'200x140mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['200x280mm']
            },
          ]
        }
      ],
      'image':noImage,
      'name':'Tarjetas de invitación díptico',
      'quantity':[10,50,100,300],
      'items':[
        {
          'id':0,
          'name':'Tarjeta',
          'bleedPrint':true, 
          'inks':[
            {
              'inksDetails':'Full color',
              'inksQuantity':4,
            }
          ],
          'allTheSame':false,
          'quantityOfPages':[1],
          'openedSize':[],
          'quantityOfVias':[1],
          'faces':['Simple Faz','Doble Faz'],
          'materials':[
            {
              'paper':'Coteado',
              'gr':'300'
            },
            {
              'paper':'Opalinas',
              'gr':'230'
            },
            {
              'paper':'Magic',
              'gr':'180'
            },
            {
              'paper':'Ecoria Tipo Reciclado',
              'gr':'240'
            },
            {
              'paper':'Milenium Tipo Reciclado',
              'gr':'240'
            },
            {
              'paper':'Jazmin',
              'gr':'240'
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Puntas redondeadas",
              "finishComment":"",
              "showToClient":true
            }
          ]
        }
      ]
    },
    {
      'id':4,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':[
        {
          'value':'160x150mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['160x310mm']
            },
          ]
        }
      ],
      'image':noImage,
      'name':'Tarjetas de invitación tríptico ventana',
      'quantity':[10,50,100,300],
      'items':[
        {
          'id':0,
          'name':'Tarjeta',
          'bleedPrint':true, 
          'inks':[
            {
              'inksDetails':'Full color',
              'inksQuantity':4,
            }
          ],
          'allTheSame':false,
          'quantityOfPages':[1],
          'openedSize':[],
          'quantityOfVias':[1],
          'faces':['Simple Faz','Doble Faz'],
          'materials':[
            {
              'paper':'Coteado',
              'gr':'300'
            },
            {
              'paper':'Opalinas',
              'gr':'230'
            },
            {
              'paper':'Magic',
              'gr':'180'
            },
            {
              'paper':'Ecoria Tipo Reciclado',
              'gr':'240'
            },
            {
              'paper':'Milenium Tipo Reciclado',
              'gr':'240'
            },
            {
              'paper':'Jazmin',
              'gr':'240'
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Puntas redondeadas",
              "finishComment":"",
              "showToClient":true
            }
          ]
        }
      ]
    },
    {
      'id':5,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':[
        {
          'value':'140x180mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['140x180mm']
            },
          ]
        }
      ],
      'image':noImage,
      'name':'Sobres de Invitación ya armados',
      'quantity':[10,50,100,300,500],
      'items':[
        {
          'id':0,
          'name':'Tarjeta',
          'bleedPrint':true, 
          'inks':[
            {
              'inksDetails':'Tinta Negra',
              'inksQuantity':1,
            }
          ],
          'allTheSame':false,
          'quantityOfPages':[1],
          'openedSize':[],
          'quantityOfVias':[1],
          'faces':['Simple Faz'],
          'materials':[
            {
              'paper':'Sobre Blanco Gallito',
              'gr':'110'
            },
            {
              'paper':'Sobre Tarjeta Colores',
              'gr':'120'
            },
            {
              'paper':'Sobre Tarjeta Colores',
              'gr':'180'
            }
          ],
          "optionalFinishes":
          [
          ]
        }
      ]
    }
  ];